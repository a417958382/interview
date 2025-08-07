#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <vector>
#include <random>
#include <chrono>

/**
 * 顶点结构体
 * 包含顶点的位置和颜色信息
 */
struct Vertex {
    glm::vec3 position;  // 顶点位置坐标
    glm::vec3 color;     // 顶点颜色
};

/**
 * 实例数据结构体
 * 用于实例化渲染，每个实例包含独立的变换矩阵和颜色
 */
struct InstanceData {
    glm::mat4 modelMatrix;  // 模型变换矩阵（位置、旋转、缩放）
    glm::vec3 color;        // 实例颜色
};

/**
 * 批处理渲染器类
 * 实现OpenGL实例化渲染技术，能够用单次绘制调用渲染大量相同几何体的不同实例
 * 这大大减少了CPU到GPU的通信开销，提高渲染性能
 */
class BatchRenderer {
private:
    GLuint VAO, VBO, instanceVBO;        // 顶点数组对象、顶点缓冲对象、实例缓冲对象
    GLuint shaderProgram;                 // 着色器程序ID
    std::vector<Vertex> vertices;         // 基础几何体顶点数据
    std::vector<InstanceData> instances;  // 实例数据数组

    // 顶点着色器源代码
    // 支持实例化渲染，每个实例有独立的变换矩阵和颜色
    const char* vertexShaderSource = R"(
        #version 330 core
        layout (location = 0) in vec3 aPos;
        layout (location = 1) in vec3 aColor;
        layout (location = 2) in mat4 aInstanceMatrix;
        layout (location = 6) in vec3 aInstanceColor;
        
        uniform mat4 view;
        uniform mat4 projection;
        
        out vec3 FragColor;
        
        void main() {
            gl_Position = projection * view * aInstanceMatrix * vec4(aPos, 1.0);
            FragColor = aInstanceColor;
        }
    )";

    // 片段着色器源代码
    // 简单地输出从顶点着色器传递过来的颜色
    const char* fragmentShaderSource = R"(
        #version 330 core
        in vec3 FragColor;
        out vec4 color;
        
        void main() {
            color = vec4(FragColor, 1.0);
        }
    )";

public:
    /**
     * 构造函数
     * 初始化批处理渲染器，设置着色器、缓冲区和基础几何体
     */
    BatchRenderer() {
        setupShaders();      // 设置着色器程序
        setupBuffers();      // 设置OpenGL缓冲区
        setupQuadVertices(); // 设置四边形顶点数据
    }

    /**
     * 析构函数
     * 清理OpenGL资源，防止内存泄漏
     */
    ~BatchRenderer() {
        glDeleteVertexArrays(1, &VAO);        // 删除顶点数组对象
        glDeleteBuffers(1, &VBO);             // 删除顶点缓冲对象
        glDeleteBuffers(1, &instanceVBO);     // 删除实例缓冲对象
        glDeleteProgram(shaderProgram);       // 删除着色器程序
    }

    /**
     * 设置着色器程序
     * 编译顶点着色器和片段着色器，创建完整的着色器程序
     */
    void setupShaders() {
        // 编译顶点着色器
        GLuint vertexShader = glCreateShader(GL_VERTEX_SHADER);
        glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
        glCompileShader(vertexShader);
        checkShaderCompilation(vertexShader, "VERTEX");  // 检查编译是否成功

        // 编译片段着色器
        GLuint fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
        glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
        glCompileShader(fragmentShader);
        checkShaderCompilation(fragmentShader, "FRAGMENT");  // 检查编译是否成功

        // 创建着色器程序并链接
        shaderProgram = glCreateProgram();
        glAttachShader(shaderProgram, vertexShader);    // 附加顶点着色器
        glAttachShader(shaderProgram, fragmentShader);  // 附加片段着色器
        glLinkProgram(shaderProgram);                   // 链接程序
        checkProgramLinking(shaderProgram);             // 检查链接是否成功

        // 清理临时着色器对象（程序已经链接，不再需要）
        glDeleteShader(vertexShader);
        glDeleteShader(fragmentShader);
    }

    /**
     * 设置OpenGL缓冲区
     * 配置顶点数组对象(VAO)、顶点缓冲对象(VBO)和实例缓冲对象
     * 这是实例化渲染的核心设置
     */
    void setupBuffers() {
        // 生成OpenGL对象
        glGenVertexArrays(1, &VAO);        // 创建顶点数组对象
        glGenBuffers(1, &VBO);             // 创建顶点缓冲对象
        glGenBuffers(1, &instanceVBO);     // 创建实例缓冲对象

        glBindVertexArray(VAO);  // 绑定VAO，后续的顶点属性设置都会保存到这个VAO中

        // 设置基础几何体的顶点缓冲区
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        // 位置属性 (location = 0)
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)0);
        glEnableVertexAttribArray(0);
        // 颜色属性 (location = 1) 
        glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void*)offsetof(Vertex, color));
        glEnableVertexAttribArray(1);

        // 设置实例缓冲区
        glBindBuffer(GL_ARRAY_BUFFER, instanceVBO);

        // 实例变换矩阵 (占用4个属性位置: location 2-5)
        // 因为mat4太大，需要分成4个vec4来传递
        for (int i = 0; i < 4; i++) {
            glVertexAttribPointer(2 + i, 4, GL_FLOAT, GL_FALSE, sizeof(InstanceData),
                (void*)(i * sizeof(glm::vec4)));
            glEnableVertexAttribArray(2 + i);
            glVertexAttribDivisor(2 + i, 1);  // 设置为实例属性，每个实例更新一次
        }

        // 实例颜色 (location = 6)
        glVertexAttribPointer(6, 3, GL_FLOAT, GL_FALSE, sizeof(InstanceData),
            (void*)offsetof(InstanceData, color));
        glEnableVertexAttribArray(6);
        glVertexAttribDivisor(6, 1);  // 设置为实例属性

        glBindVertexArray(0);  // 解绑VAO
    }

    /**
     * 设置四边形顶点数据
     * 创建一个基础的四边形几何体，所有实例都将基于这个几何体进行渲染
     * 使用三角形列表方式定义四边形（两个三角形组成）
     */
    void setupQuadVertices() {
        // 创建一个简单的四边形（由两个三角形组成）
        // 每个顶点包含位置和颜色信息
        vertices = {
            // 第一个三角形
            {{-0.5f, -0.5f, 0.0f}, {1.0f, 0.0f, 0.0f}},  // 左下角 - 红色
            {{ 0.5f, -0.5f, 0.0f}, {0.0f, 1.0f, 0.0f}},  // 右下角 - 绿色
            {{ 0.5f,  0.5f, 0.0f}, {0.0f, 0.0f, 1.0f}},  // 右上角 - 蓝色
            // 第二个三角形
            {{-0.5f,  0.5f, 0.0f}, {1.0f, 1.0f, 0.0f}},  // 左上角 - 黄色
            {{-0.5f, -0.5f, 0.0f}, {1.0f, 0.0f, 0.0f}},  // 左下角 - 红色
            {{ 0.5f,  0.5f, 0.0f}, {0.0f, 0.0f, 1.0f}}   // 右上角 - 蓝色
        };

        // 将顶点数据上传到GPU
        glBindBuffer(GL_ARRAY_BUFFER, VBO);
        glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(Vertex),
            vertices.data(), GL_STATIC_DRAW);  // 静态绘制，数据不会频繁改变
    }

    /**
     * 添加一个渲染实例
     * @param position 实例的世界坐标位置
     * @param scale 实例的缩放比例
     * @param rotation 实例的旋转角度（弧度）
     * @param color 实例的颜色
     */
    void addInstance(const glm::vec3& position, const glm::vec3& scale,
        float rotation, const glm::vec3& color) {
        InstanceData instance;

        // 创建变换矩阵（按照 缩放->旋转->平移 的顺序）
        instance.modelMatrix = glm::mat4(1.0f);  // 初始化为单位矩阵
        instance.modelMatrix = glm::translate(instance.modelMatrix, position);  // 应用平移
        instance.modelMatrix = glm::rotate(instance.modelMatrix, rotation, glm::vec3(0.0f, 0.0f, 1.0f));  // 绕Z轴旋转
        instance.modelMatrix = glm::scale(instance.modelMatrix, scale);  // 应用缩放

        instance.color = color;  // 设置实例颜色
        instances.push_back(instance);  // 添加到实例列表中
    }

    /**
     * 执行批处理渲染
     * 使用单次绘制调用渲染所有实例，这是性能优化的关键
     * @param view 视图矩阵（摄像机变换）
     * @param projection 投影矩阵（透视或正交投影）
     */
    void render(const glm::mat4& view, const glm::mat4& projection) {
        if (instances.empty()) return;  // 如果没有实例，直接返回

        glUseProgram(shaderProgram);  // 使用我们的着色器程序

        // 设置uniform变量（对所有实例都相同的数据）
        glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "view"), 1, GL_FALSE, glm::value_ptr(view));
        glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "projection"), 1, GL_FALSE, glm::value_ptr(projection));

        // 更新实例数据到GPU
        glBindBuffer(GL_ARRAY_BUFFER, instanceVBO);
        glBufferData(GL_ARRAY_BUFFER, instances.size() * sizeof(InstanceData),
            instances.data(), GL_DYNAMIC_DRAW);  // 动态绘制，数据每帧都会更新

        // 执行实例化绘制 - 关键的性能优化点！
        glBindVertexArray(VAO);
        glDrawArraysInstanced(GL_TRIANGLES, 0, vertices.size(), instances.size());  // 一次调用绘制所有实例
        glBindVertexArray(0);
    }

    /**
     * 清空所有实例
     * 通常在每帧开始时调用，为新的一帧准备
     */
    void clearInstances() {
        instances.clear();
    }

    /**
     * 获取当前实例数量
     * @return 当前存储的实例数量
     */
    size_t getInstanceCount() const {
        return instances.size();
    }

private:
    /**
     * 检查着色器编译状态
     * @param shader 着色器ID
     * @param type 着色器类型（用于错误信息显示）
     */
    void checkShaderCompilation(GLuint shader, const std::string& type) {
        GLint success;
        GLchar infoLog[1024];
        glGetShaderiv(shader, GL_COMPILE_STATUS, &success);  // 获取编译状态
        if (!success) {
            glGetShaderInfoLog(shader, 1024, NULL, infoLog);  // 获取错误信息
            std::cout << "Shader compilation error (" << type << "): " << infoLog << std::endl;
        }
    }

    /**
     * 检查着色器程序链接状态
     * @param program 着色器程序ID
     */
    void checkProgramLinking(GLuint program) {
        GLint success;
        GLchar infoLog[1024];
        glGetProgramiv(program, GL_LINK_STATUS, &success);  // 获取链接状态
        if (!success) {
            glGetProgramInfoLog(program, 1024, NULL, infoLog);  // 获取错误信息
            std::cout << "Shader program linking error: " << infoLog << std::endl;
        }
    }
};

/**
 * 性能测试类
 * 用于测量渲染时间和计算FPS，帮助评估批处理渲染的性能提升
 */
class PerformanceTest {
private:
    std::chrono::high_resolution_clock::time_point startTime;  // 开始时间点

public:
    /**
     * 开始计时
     * 记录当前时间作为测试开始点
     */
    void start() {
        startTime = std::chrono::high_resolution_clock::now();
    }

    /**
     * 获取经过的时间（毫秒）
     * @return 从start()调用到现在经过的时间，以毫秒为单位
     */
    double getElapsedMs() {
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(endTime - startTime);
        return duration.count() / 1000.0;  // 转换为毫秒
    }
};

/**
 * 窗口大小改变回调函数
 * 当窗口大小改变时，更新OpenGL视口
 */
void framebuffer_size_callback(GLFWwindow* window, int width, int height) {
    glViewport(0, 0, width, height);
}

/**
 * 主函数
 * 程序入口点，初始化OpenGL环境，创建批处理渲染器，并运行渲染循环
 */
int main() {
    // 初始化GLFW
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);  // 设置OpenGL主版本号
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);  // 设置OpenGL次版本号
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);  // 使用核心模式

    // 创建窗口
    GLFWwindow* window = glfwCreateWindow(1200, 800, "OpenGL Batch Rendering Optimization Example", NULL, NULL);
    if (window == NULL) {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);  // 设置当前OpenGL上下文
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);  // 设置窗口大小改变回调

    // 初始化GLAD
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }

    // 启用深度测试
    glEnable(GL_DEPTH_TEST);

    // 创建批处理渲染器和性能测试器
    BatchRenderer batchRenderer;
    PerformanceTest perfTest;

    // 设置随机数生成器
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<float> posDis(-10.0f, 10.0f);    // 位置分布
    std::uniform_real_distribution<float> scaleDis(0.1f, 0.5f);     // 缩放分布
    std::uniform_real_distribution<float> rotDis(0.0f, 6.28f);      // 旋转分布（0到2π）
    std::uniform_real_distribution<float> colorDis(0.0f, 1.0f);     // 颜色分布

    // 设置摄像机参数
    glm::vec3 cameraPos = glm::vec3(0.0f, 0.0f, 15.0f);      // 摄像机位置
    glm::vec3 cameraTarget = glm::vec3(0.0f, 0.0f, 0.0f);    // 摄像机目标点
    glm::vec3 cameraUp = glm::vec3(0.0f, 1.0f, 0.0f);        // 摄像机上方向

    // 渲染循环变量
    int frameCount = 0;                    // 帧计数器
    double totalRenderTime = 0.0;          // 总渲染时间
    const int OBJECT_COUNT = 1000;         // 渲染对象数量（1000个对象用于性能测试）

    std::cout << "Batch Rendering Optimization Example Started" << std::endl;
    std::cout << "Rendering Object Count: " << OBJECT_COUNT << std::endl;
    std::cout << "Press ESC to exit" << std::endl;

    // 主渲染循环
    while (!glfwWindowShouldClose(window)) {
        // 处理输入
        if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
            glfwSetWindowShouldClose(window, true);

        // 清空缓冲区
        glClearColor(0.1f, 0.1f, 0.1f, 1.0f);  // 设置背景色为深灰色
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        // 开始性能测试
        perfTest.start();

        // 清空上一帧的实例
        batchRenderer.clearInstances();

        // 添加大量实例（模拟游戏中的多个对象）
        for (int i = 0; i < OBJECT_COUNT; i++) {
            glm::vec3 position(posDis(gen), posDis(gen), posDis(gen));  // 随机位置
            glm::vec3 scale(scaleDis(gen), scaleDis(gen), 1.0f);        // 随机缩放
            float rotation = rotDis(gen);                               // 随机旋转
            glm::vec3 color(colorDis(gen), colorDis(gen), colorDis(gen)); // 随机颜色

            batchRenderer.addInstance(position, scale, rotation, color);
        }

        // 设置视图和投影矩阵
        glm::mat4 view = glm::lookAt(cameraPos, cameraTarget, cameraUp);  // 视图矩阵
        glm::mat4 projection = glm::perspective(glm::radians(45.0f), 1200.0f / 800.0f, 0.1f, 100.0f);  // 透视投影矩阵

        // 批处理渲染（只需要一次绘制调用！）
        batchRenderer.render(view, projection);

        // 记录渲染时间
        double renderTime = perfTest.getElapsedMs();
        totalRenderTime += renderTime;
        frameCount++;

        // 每60帧输出一次性能统计
        if (frameCount % 60 == 0) {
            double avgRenderTime = totalRenderTime / frameCount;
            std::cout << "Average Render Time: " << avgRenderTime << "ms, "
                      << "FPS: " << 1000.0 / avgRenderTime << ", "
                      << "Object Count: " << batchRenderer.getInstanceCount() 
                      << " (Single Draw Call)" << std::endl;
        }

        // 交换缓冲区并处理事件
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    // 输出最终性能统计
    if (frameCount > 0) {
        double avgRenderTime = totalRenderTime / frameCount;
        std::cout << "\n=== Final Performance Statistics ===" << std::endl;
        std::cout << "Total Frames: " << frameCount << std::endl;
        std::cout << "Average Render Time: " << avgRenderTime << "ms" << std::endl;
        std::cout << "Average FPS: " << 1000.0 / avgRenderTime << std::endl;
        std::cout << "Objects Per Frame: " << OBJECT_COUNT << std::endl;
        std::cout << "Draw Calls: 1 (Batch Optimized)" << std::endl;
        std::cout << "Performance Improvement: Reduced " << (OBJECT_COUNT - 1) << " draw calls compared to traditional method (Improvement: " 
                  << ((float)(OBJECT_COUNT - 1) / OBJECT_COUNT * 100) << "%)" << std::endl;
    }

    // 清理资源
    glfwTerminate();
    return 0;
}