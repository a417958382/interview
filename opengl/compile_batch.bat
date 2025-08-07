@echo off
echo 编译批处理渲染示例...

if not exist "build" mkdir build
cd build

g++ -std=c++17 ^
    -I../include ^
    -I../include/glm ^
    ../src/glad.c ^
    ../src/batch_rendering.cpp ^
    -lglfw3 ^
    -lopengl32 ^
    -lgdi32 ^
    -o batch_rendering.exe

if %ERRORLEVEL% EQU 0 (
    echo 编译成功！运行 batch_rendering.exe
    batch_rendering.exe
) else (
    echo 编译失败！
)

cd ..
pause