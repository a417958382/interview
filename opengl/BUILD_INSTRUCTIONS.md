# 批处理渲染示例编译指南

## 方法1：使用Visual Studio编译器

如果你安装了Visual Studio，运行：
```
.\compile_batch_vs.bat
```

## 方法2：使用CMake（推荐）

1. 确保已安装CMake
2. 在opengl目录下运行：
```powershell
mkdir build
cd build
cmake ..
cmake --build . --config Release
.\Release\batch_rendering.exe
```

## 方法3：安装MinGW-w64

1. 下载并安装MinGW-w64：https://www.mingw-w64.org/downloads/
2. 将MinGW的bin目录添加到系统PATH
3. 运行原始的编译脚本：
```
.\compile_batch.bat
```

## 方法4：手动编译（如果有编译器）

```powershell
# 创建build目录
mkdir build
cd build

# 使用g++编译（如果已安装）
g++ -std=c++17 -I../include -I../include/glm ../src/glad.c ../src/batch_rendering.cpp -lglfw3 -lopengl32 -lgdi32 -o batch_rendering.exe

# 或使用cl编译（Visual Studio）
cl /std:c++17 /I..\include /I..\include\glm ..\src\glad.c ..\src\batch_rendering.cpp /link opengl32.lib gdi32.lib user32.lib kernel32.lib /OUT:batch_rendering.exe
```

## 运行程序

编译成功后，运行生成的可执行文件：
```
.\batch_rendering.exe
```

程序将显示1000个随机颜色的四边形，并输出性能统计信息。

## 预期效果

- 窗口标题：OpenGL 批处理渲染优化示例
- 显示1000个彩色四边形在3D空间中随机分布
- 控制台输出性能统计：平均渲染时间、FPS、对象数量
- 按ESC键退出程序

## 故障排除

1. **找不到编译器**：安装Visual Studio Community或MinGW-w64
2. **找不到头文件**：确保include目录包含GLFW、GLAD、GLM
3. **链接错误**：确保系统有OpenGL库支持
4. **运行时错误**：确保显卡支持OpenGL 3.3或更高版本