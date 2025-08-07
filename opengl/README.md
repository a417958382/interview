# OpenGL 开发环境配置指南

## 环境要求
- Windows 10/11
- Visual Studio 2019/2022 或 MinGW-w64
- CMake 3.16+

## 目录结构
```
opengl/
├── src/           # 源代码
├── include/       # 头文件
├── lib/           # 库文件
├── shaders/       # 着色器文件
├── assets/        # 资源文件
├── build/         # 构建输出
├── CMakeLists.txt # CMake配置
└── README.md      # 说明文档
```

## 快速开始

### 方法一：使用修复版安装脚本（推荐）
1. 运行 `setup_fixed.bat` 安装依赖
2. 运行 `build.bat` 编译项目
3. 运行 `run.bat` 启动示例

### 方法二：手动配置
如果自动下载失败，请手动下载以下库：

1. **GLFW** - 窗口管理
   - 下载地址：https://www.glfw.org/download.html
   - 解压到 `include/` 和 `lib/` 目录

2. **GLM** - 数学库
   - 下载地址：https://github.com/g-truc/glm/releases
   - 解压到 `include/glm/` 目录

3. **GLAD** - OpenGL加载器（已包含）
   - 已经创建了基础的GLAD文件
   - 如需完整版本，访问：https://glad.dav1d.de/

## 依赖库说明
- **GLFW 3.3.8** - 跨平台窗口管理和输入处理
- **GLAD** - OpenGL函数加载器
- **GLM** - OpenGL数学库，提供向量和矩阵运算
- **stb_image** - 图像加载库（可选）

## 示例项目
当前包含的示例：
- **基础三角形渲染** - 展示基本的OpenGL渲染流程
- **旋转彩色三角形** - 包含变换矩阵和着色器

## 编译说明

### 使用CMake（推荐）
```bash
mkdir build
cd build
cmake .. -G "Visual Studio 17 2022" -A x64
cmake --build . --config Release
```

### 使用批处理脚本
```bash
# 安装依赖
setup_fixed.bat

# 编译项目
build.bat

# 运行示例
run.bat
```

## 故障排除

### 常见问题
1. **GLFW下载失败**
   - 手动从官网下载并解压到对应目录

2. **GLM下载失败**
   - 手动从GitHub下载并解压到include/glm/

3. **编译错误**
   - 确保Visual Studio已安装C++开发工具
   - 检查CMake版本是否满足要求

4. **运行时错误**
   - 确保显卡驱动支持OpenGL 3.3+
   - 检查dll文件是否在正确路径

### 环境检查
运行以下命令检查环境：
```bash
cmake --version
```

## 扩展开发

### 添加新的示例
1. 在 `src/` 目录创建新的cpp文件
2. 修改 `CMakeLists.txt` 添加新的可执行文件
3. 重新编译项目

### 添加新的依赖
1. 下载库文件到 `lib/` 目录
2. 添加头文件到 `include/` 目录
3. 在 `CMakeLists.txt` 中链接新库

## 学习资源
- [LearnOpenGL](https://learnopengl.com/) - 优秀的OpenGL教程
- [OpenGL官方文档](https://www.opengl.org/documentation/)
- [GLFW文档](https://www.glfw.org/documentation.html)

## 技术支持
如遇到问题，请检查：
1. 系统是否满足最低要求
2. 依赖库是否正确安装
3. 编译器和CMake版本是否兼容