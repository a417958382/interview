说明

默认以 Creator 3.x/2D Sprite 为例（WebGL/GLES）。若你用 2.x，仅把纹理名与 include 宏替换为 2.x 的写法即可；核心片段一致。
下列要点含：必备 uniform、核心片段公式/逻辑、推荐混合与性能提示、驱动方式。

灰度（Grayscale）
核心 uniform: float u_gray(0..1)
片段公式: g = dot(rgb, vec3(0.299,0.587,0.114)); rgb = mix(rgb, vec3(g), u_gray);
混合/透明: 保持默认与原精灵一致；预乘透明无需额外处理。
驱动示例: material.setProperty('u_gray', 1.0);
性能要点: 仅算一次点积，开销极低；避免额外分支。

受击闪白（Hit Flash White）
核心 uniform: float u_flash(0..1), vec3 u_flashColor(默认白)
片段公式:
线性闪白: rgb = mix(rgb, u_flashColor, u_flash);
更亮型: rgb += u_flash * (u_flashColor - rgb); rgb = clamp(rgb, 0.0, 1.0);
时间驱动: 受击时将 u_flash tween 到 1 再衰减到 0（100~200ms）。
TS 示例: sprite.getMaterial(0).setProperty('u_flash', v);
混合/透明: 与原精灵一致。
提示: 可加 u_mask = step(alphaThresh, a); u_flash *= u_mask; 限制仅对有效像素生效。

描边发光（Outline/Glow）
思路A（Alpha 采样描边，零预处理，通用性好）:
核心 uniform: vec4 u_outlineColor(含强度), float u_outlineWidthPx, float u_alphaThresh, float u_softness(可选)
计算像素偏移: vec2 texel = 1.0 / textureSize(mainTex, 0); vec2 off = u_outlineWidthPx * texel;
取样邻域（8 向或更多环）：对 uv ± off*(dx,dy) 采样 alpha，求 maxNeighbor.
判定描边:
外描边只画外圈: isEdge = step(u_alphaThresh, maxNeighbor) * (1.0 - step(u_alphaThresh, centerA));
软边发光: 用 smoothstep 基于距中心的最大响应做衰减，叠加到颜色上。
合成:
纯描边覆盖外圈: rgb = mix(rgb, u_outlineColor.rgb, isEdge * u_outlineColor.a);
发光感: 用加色混合或 rgb += glow * u_outlineColor.rgb;

思路B（SDF 描边，最佳质量/性能）:
使用 SDF 精灵贴图，dist = texture(sdf, uv).r，描边=smoothstep(threshold, threshold+width, dist)。
优点：1 次采样即可得可控粗细与柔边；缺点：需预处理 SDF 贴图。
混合建议:
纯描边：默认 Alpha 混合即可。
强烈发光：考虑加色混合（Additive）或单独 pass。
性能要点: 8~16 次采样对低端机敏感；UI大图建议 SDF 或较小宽度与方向数。

溶解（Dissolve）
核心 uniform: sampler2D u_noise, float u_threshold(0..1), float u_edgeWidth(0..0.2), vec3 u_edgeColor, float u_noiseScale
片段流程:
采样噪声: n = texture(u_noise, uv * u_noiseScale).r;
主体/裁剪: alive = n > u_threshold; if (!alive) discard;
边缘炽热: edge = 1.0 - smoothstep(u_threshold, u_threshold + u_edgeWidth, n);
着色: rgb = mix(rgb, u_edgeColor, edge);（或加色 rgb += edge * u_edgeColor）
驱动/时序: 动画 u_threshold 从 0→1（消失）或 1→0（出现）；可配合 u_noiseScale 做流动变化。
混合/透明: 含 discard 的 AlphaTest 风格，排序与普通精灵一致；3D 模型需注意阴影/深度写入一致性。
性能要点: 仅多一次噪声采样；边缘平滑用 smoothstep 避免硬锯齿。

Creator 3.x 最小 Effect 骨架（示例）
Pass 配置要点:
blendState.targets[0].blend = true（与精灵默认一致）
UI 精灵一般 depthTest=false, depthWrite=false, cullMode=none
属性/取样命名:
自定义纹理/参数放在 properties，片段里采样 texture(u_noise, uv) 或按你项目宏包装。
时间驱动可用内置 cc_time 或脚本赋值。

示例片段（伪代码，仅展示核心逻辑行）:
灰度: g = dot(col.rgb, vec3(0.299,0.587,0.114)); col.rgb = mix(col.rgb, vec3(g), u_gray);
闪白: col.rgb = mix(col.rgb, u_flashColor, u_flash);
描边取样: centerA = texture(mainTex, uv).a; maxA = max(neighbor(a)); isEdge = step(th, maxA) * (1.0 - step(th, centerA)); col.rgb = mix(col.rgb, u_outlineColor.rgb, isEdge * u_outlineColor.a);
溶解: n = texture(u_noise, uv*scale).r; edge = 1.0 - smoothstep(th, th+edgeW, n); if (n<th) discard; col.rgb = mix(col.rgb, u_edgeColor, edge);

实用建议
统一宏与属性名：同一材质变体（合批）需相同宏开关；仅改 uniform 值不破坏合批。
纹理尺寸/texel: 使用 1.0/textureSize 将像素宽度转为 UV 偏移；WebGL1 可通过材质脚本传入 u_texelSize。
预乘 Alpha: Creator 默认预乘贴图常见；本答复的计算均在非线性空间直接对 rgb 操作即可，最终按引擎状态混合。
资源准备: 溶解用 1 通道噪声（如 Perlin/Worley），描边若走 SDF 请离线生成。

范围与前提

默认面向 Creator 3.x，2D Sprite/粒子等最常见情况；核心算法与平台无关。
下面按“信号怎么来的、为何这样算、如何调参和避坑”的思路解释，并给出最小片段逻辑。
灰度 Grayscale

核心信号: 感知亮度 y = 0.299 R + 0.587 G + 0.114 B。源于人眼对绿色更敏感（BT.601）。
混合思路: 在原色和灰度间插值，控制量 u_gray ∈ [0,1] 决定灰度化强度。
片段流程:
取纹理颜色 col = sample(mainTex, uv)
算亮度 g = dot(col.rgb, vec3(0.299, 0.587, 0.114))
插值 col.rgb = mix(col.rgb, vec3(g), u_gray)
参数与调法:
u_gray=0 原样，=1 完全灰度。也可非线性调制：u_gray^γ 控制感受曲线。
颜色空间与陷阱:
大多移动端纹理在伽马空间直接混合即可；若你已在严格线性空间渲染，先线性化再求亮度更物理。
最小片段:
g = dot(col.rgb, vec3(0.299,0.587,0.114)); col.rgb = mix(col.rgb, vec3(g), u_gray);
受击闪白 Hit Flash

核心信号: “把当前颜色朝某个目标色推近”的插值，目标色常用白色或任意 u_flashColor。
时间域: 受击瞬间把 u_flash 从 0 tween 到 1，再快速衰减回 0（100–200ms），形成“打击反馈”。
两种常见混合:
线性变亮: col.rgb = mix(col.rgb, u_flashColor, u_flash)
增亮趋近: col.rgb += u_flash * (u_flashColor - col.rgb); col.rgb = clamp(col.rgb,0,1)
仅对有效像素生效:
mask = step(alphaThresh, col.a); u_flash *= mask
额外强化:
可叠加边缘光：rim = pow(1.0 - saturate(dot(normal, viewDir)), k); col += rim * u_flash
最小片段:
col.rgb = mix(col.rgb, u_flashColor, u_flash);
描边/发光 Outline/Glow（基于 Alpha 邻域采样）

直觉: 观察某像素邻域是否存在“有墨”（alpha>阈值）而当前像素是“空白”（alpha<阈值），若是则判定为外侧边界。
数学对应: 形态学膨胀（morphological dilation）的近似，用若干邻域采样的 alpha 求最大响应。
关键量:
texel = 1.0 / textureSize(mainTex, 0)（WebGL1 可由脚本传 u_texelSize）
偏移半径 off = u_outlineWidthPx * texel（像素宽度转 UV 偏移）
centerA = sample(mainTex, uv).a，maxA = max(邻域 alpha)
判定:
isEdge = step(u_alphaThresh, maxA) * (1.0 - step(u_alphaThresh, centerA))
maxA 过阈值但中心没过阈值，即外轮廓圈
合成:
纯描边: col.rgb = mix(col.rgb, u_outlineColor.rgb, isEdge * u_outlineColor.a)
发光感: glow = smoothstep(0.0,1.0,maxA - u_alphaThresh) 调成柔和，再加色 col.rgb += glow * u_glowStrength * u_outlineColor.rgb
精度/性能:
8 向采样（上下左右+四对角）通常足够；16 向更圆但更贵。UI 建议宽度≤3px；更粗效果请用 SDF。
最小片段（8 向示意）:
maxA = 0; loop 8 neighbors: maxA = max(maxA, sampleA(uv + dir[i]*off));
centerA = sampleA(uv); isEdge = step(th, maxA) * (1.0 - step(th, centerA));
col.rgb = mix(col.rgb, u_outlineColor.rgb, isEdge * u_outlineColor.a);
SDF 替代（质量更高/更省采样）:
dist = texture(sdfTex, uv).r（0..1 中心化的距离码）
outline = smoothstep(th, th + width, dist) - smoothstep(th2, th2 + width, dist) 等式带来细腻可控描边
缺点：贴图需预处理为 SDF
溶解 Dissolve（噪声阈值 + 边带）

核心信号: 使用噪声 n = noise(uv) 与阈值 u_threshold 比较；n < threshold 的像素被抹去；=threshold 附近形成“燃边”。
选择噪声:
贴图噪声: Worley（细胞状）、Perlin/Simplex（云雾），可 tile 且可控
程序噪声: 移动端成本高，通常不建议在片段动态生成
片段流程:
n = texture(u_noise, uv * u_noiseScale).r
若 n < u_threshold 则 discard（AlphaTest 行为，减少过度绘制）
边带强度: edge = 1.0 - smoothstep(u_threshold, u_threshold + u_edgeWidth, n)
合成边缘: col.rgb = mix(col.rgb, u_edgeColor, edge) 或 col.rgb += edge * u_edgeColor
动画与方向性:
u_threshold 0→1 表示由外向内逐步消失；反向则出现
用时间扰动噪声坐标：uv' = uv * scale + t * flowDir，使溶解边缘流动
排序/混合:
含 discard 的透明对象仍按透明排序；若是 3D 模型，注意与阴影/深度写一致（一般 depthWrite=false）
最小片段:
n = texture(noiseTex, uv*scale).r; if (n < th) discard;
edge = 1.0 - smoothstep(th, th+edgeW, n);
col.rgb = mix(col.rgb, u_edgeColor, edge);
为什么这些算法有效

灰度: 线性组合逼近人眼亮度感知，单点积代价低。
闪白: 插值是最稳定、单调的“向目标靠近”操作，适合用曲线驱动时序。
描边: 邻域 max 是膨胀操作，天然标出形体外缘；用 step/smoothstep 可把硬边变为可调软边。
溶解: 噪声值域单调阈切，本质是“从低到高”的拓扑波前推进，天然形成连贯的消散进程；边带用 smoothstep 得到可调过渡。
常见坑与修正

预乘 Alpha: 大多数 Creator UI 走预乘贴图与混合，以上计算直接对 col.rgb 操作即可；若你做“乘法型”变换（如整体乘亮度），先解除或注意不改变 alpha。
WebGL1 无 textureSize: 通过脚本传入 u_texelSize = vec2(1/width, 1/height)。
大宽度描边的锯齿: 采样方向不足或 alpha 抖动；改用更多方向、叠加多圈、或改用 SDF。
溶解的“黑边”: 透明边缘纹理有颜色溢出，阈切时暴露；在美术导出时启用“去预乘边缘”或在 shader 里用 alpha 去 premultiply 修正。
色彩空间: 若项目启用线性渲染（3D 场景常见），需在正确空间做混合/插值再转回。