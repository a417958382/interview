OpenGL渲染管线完整流程
1. 顶点数据输入（Vertex Input）
// 顶点数据准备
float vertices[] = {
    // 位置坐标(本地坐标系)    // 纹理坐标
    -0.5f, -0.5f, 0.0f,     0.0f, 0.0f,
     0.5f, -0.5f, 0.0f,     1.0f, 0.0f,
     0.0f,  0.5f, 0.0f,     0.5f, 1.0f
};
坐标系状态： 本地坐标系（Local Space）

2. 顶点着色器（Vertex Shader）⭐ 主要坐标转换阶段
#version 330 core
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

uniform mat4 model;      // 本地 → 世界
uniform mat4 view;       // 世界 → 观察
uniform mat4 projection; // 观察 → 裁剪

out vec2 TexCoord;

void main() {
    // 🔥 坐标系转换的核心阶段
    vec4 worldPos = model * vec4(aPos, 1.0);           // 本地 → 世界坐标
    vec4 viewPos = view * worldPos;                    // 世界 → 观察坐标
    gl_Position = projection * viewPos;                // 观察 → 裁剪坐标
    
    TexCoord = aTexCoord;
}
坐标系转换： 本地坐标 → 世界坐标 → 观察坐标 → 裁剪坐标

3. 图元装配（Primitive Assembly）
// OpenGL自动执行
// 将顶点组装成图元（点、线、三角形）
glDrawArrays(GL_TRIANGLES, 0, 3);
坐标系状态： 裁剪坐标系（Clip Space）

4. 几何着色器（Geometry Shader）- 可选
#version 330 core
layout (triangles) in;
layout (triangle_strip, max_vertices = 3) out;

void main() {
    // 可以在这里进行额外的坐标变换
    for(int i = 0; i < 3; i++) {
        gl_Position = gl_in[i].gl_Position;
        EmitVertex();
    }
    EndPrimitive();
}
坐标系状态： 仍在裁剪坐标系

5. 裁剪测试（Clipping）⭐ 坐标转换阶段
// OpenGL自动执行视锥体裁剪
// 裁剪范围：-w ≤ x,y,z ≤ w
bool IsInsideFrustum(vec4 clipPos) {
    return clipPos.x >= -clipPos.w && clipPos.x <= clipPos.w &&
           clipPos.y >= -clipPos.w && clipPos.y <= clipPos.w &&
           clipPos.z >= 0.0 && clipPos.z <= clipPos.w;
}
坐标系状态： 裁剪坐标系 → 准备透视除法

6. 透视除法（Perspective Division）⭐ 坐标转换阶段
// OpenGL自动执行透视除法
vec3 ndc = vec3(
    gl_Position.x / gl_Position.w,
    gl_Position.y / gl_Position.w,
    gl_Position.z / gl_Position.w
);
坐标系转换： 裁剪坐标 → 标准化设备坐标（NDC）

7. 视口变换（Viewport Transform）⭐ 坐标转换阶段
// 设置视口
glViewport(0, 0, 800, 600);

// OpenGL自动执行视口变换
int screenX = (ndc.x + 1.0) * 0.5 * viewport_width;
int screenY = (ndc.y + 1.0) * 0.5 * viewport_height;
float depth = (ndc.z + 1.0) * 0.5;  // 深度值 [0,1]
坐标系转换： NDC → 屏幕坐标（Screen Space）

8. 光栅化（Rasterization）
// OpenGL自动执行
// 将几何图元转换为片元（像素）
// 进行插值计算（位置、颜色、纹理坐标等）
坐标系状态： 屏幕坐标系

9. 片元着色器（Fragment Shader）
#version 330 core
in vec2 TexCoord;
out vec4 FragColor;

uniform sampler2D ourTexture;

void main() {
    FragColor = texture(ourTexture, TexCoord);
}
坐标系状态： 屏幕坐标系（处理像素）

10. 逐片元操作（Per-Fragment Operations）
// 深度测试
glEnable(GL_DEPTH_TEST);
glDepthFunc(GL_LESS);

// Alpha混合
glEnable(GL_BLEND);
glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

// 模板测试
glEnable(GL_STENCIL_TEST);
坐标系状态： 屏幕坐标系

11. 帧缓冲输出（Framebuffer Output）
// 最终像素写入帧缓冲
// 显示到屏幕或渲染到纹理
坐标系转换总结
| 渲染管线阶段 | 坐标系转换 | 执行位置 |
|-------------|-----------|----------|
| 顶点着色器 | 本地→世界→观察→裁剪 | 程序员编写 |
| 裁剪测试 | 裁剪坐标系内处理 | OpenGL自动 |
| 透视除法 | 裁剪→NDC | OpenGL自动 |
| 视口变换 | NDC→屏幕 | OpenGL自动 |

关键代码示例
class OpenGLPipeline {
public:
    void RenderFrame() {
        // 1. 准备顶点数据（本地坐标）
        SetupVertexData();
        
        // 2. 设置变换矩阵
        SetupTransformMatrices();
        
        // 3. 顶点着色器执行坐标转换
        glUseProgram(shaderProgram);
        glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
        glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
        glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));
        
        // 4. 设置视口（影响NDC→屏幕转换）
        glViewport(0, 0, screenWidth, screenHeight);
        
        // 5. 绘制（触发整个管线）
        glDrawArrays(GL_TRIANGLES, 0, vertexCount);
        
        // 后续阶段OpenGL自动处理坐标转换
    }
};
核心要点：

顶点着色器是程序员控制坐标转换的主要阶段
透视除法和视口变换由OpenGL自动完成
坐标转换贯穿整个渲染管线的前半部分
从光栅化开始就在屏幕坐标系中工作