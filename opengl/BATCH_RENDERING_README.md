# OpenGL 批处理渲染优化示例

## 概述

这个示例展示了如何使用OpenGL的实例化渲染（Instanced Rendering）技术来优化大量相似对象的渲染性能。通过批处理技术，我们可以将原本需要1000次绘制调用的渲染任务减少到仅需1次绘制调用。

## 核心优化技术

### 1. 实例化渲染 (Instanced Rendering)
- 使用 `glDrawArraysInstanced()` 替代多次 `glDrawArrays()` 调用
- 一次绘制调用渲染多个相同几何体的实例
- 大幅减少CPU与GPU之间的通信开销

### 2. 实例数据缓冲 (Instance Data Buffer)
- 将每个实例的变换矩阵和颜色数据存储在单独的缓冲区中
- 使用 `glVertexAttribDivisor()` 设置实例属性的更新频率
- 避免在每次绘制时重复设置uniform变量

### 3. 着色器优化
- 在顶点着色器中直接使用实例属性
- 减少uniform变量的使用
- 提高GPU并行处理效率

## 性能对比

### 传统渲染方式
```cpp
// 需要1000次绘制调用
for (int i = 0; i < 1000; i++) {
    setUniforms(objects[i]);
    glDrawArrays(GL_TRIANGLES, 0, 6);
}
```

### 批处理渲染方式
```cpp
// 只需要1次绘制调用
updateInstanceBuffer(allObjects);
glDrawArraysInstanced(GL_TRIANGLES, 0, 6, 1000);
```

## 关键代码解析

### 实例数据结构
```cpp
struct InstanceData {
    glm::mat4 modelMatrix;  // 变换矩阵
    glm::vec3 color;        // 实例颜色
};
```

### 顶点着色器
```glsl
layout (location = 2) in mat4 aInstanceMatrix;  // 实例变换矩阵
layout (location = 6) in vec3 aInstanceColor;   // 实例颜色

void main() {
    gl_Position = projection * view * aInstanceMatrix * vec4(aPos, 1.0);
    FragColor = aInstanceColor;
}
```

### 实例属性设置
```cpp
// 设置实例矩阵属性（占用4个位置）
for (int i = 0; i < 4; i++) {
    glVertexAttribPointer(2 + i, 4, GL_FLOAT, GL_FALSE, sizeof(InstanceData), 
                        (void*)(i * sizeof(glm::vec4)));
    glEnableVertexAttribArray(2 + i);
    glVertexAttribDivisor(2 + i, 1);  // 每个实例更新一次
}
```

## 编译和运行

1. 确保已安装必要的依赖库（GLFW, GLAD, GLM）
2. 运行编译脚本：
   ```bash
   compile_batch.bat
   ```
3. 程序将显示性能统计信息，包括：
   - 平均渲染时间
   - FPS（每秒帧数）
   - 渲染对象数量
   - 绘制调用次数

## 性能优势

### 预期性能提升
- **绘制调用减少**: 从1000次减少到1次（减少99.9%）
- **CPU开销降低**: 显著减少CPU-GPU通信
- **帧率提升**: 在相同硬件条件下可获得数倍性能提升
- **内存效率**: 更好的缓存局部性和内存访问模式

### 适用场景
- 粒子系统渲染
- 草地、树木等大量重复对象
- UI元素批量渲染
- 游戏中的敌人、子弹等对象

## 扩展建议

1. **纹理数组**: 结合纹理数组技术支持不同纹理的实例
2. **LOD系统**: 根据距离动态调整实例的细节级别
3. **视锥剔除**: 在CPU端预先剔除不可见的实例
4. **动态批处理**: 根据材质和状态动态组织批次

## 注意事项

1. 所有实例必须使用相同的几何体和着色器
2. 实例数据的更新频率会影响性能
3. 过大的实例缓冲可能导致内存问题
4. 需要合理平衡批次大小和绘制调用次数

这个示例为OpenGL渲染优化提供了一个实用的起点，可以根据具体需求进行进一步的定制和优化。

cmake --build build_batch --config Release