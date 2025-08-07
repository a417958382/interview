@echo off
chcp 65001 >nul
echo 编译批处理渲染示例...

if not exist "build" mkdir build
cd build

:: 尝试找到Visual Studio的vcvars64.bat
set "VS_PATH="
if exist "C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat" (
    set "VS_PATH=C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Auxiliary\Build\vcvars64.bat"
) else if exist "C:\Program Files\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat" (
    set "VS_PATH=C:\Program Files\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat"
) else if exist "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat" (
    set "VS_PATH=C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat"
)

if "%VS_PATH%"=="" (
    echo 错误：找不到Visual Studio编译器
    echo 请安装Visual Studio或MinGW-w64
    pause
    exit /b 1
)

:: 设置Visual Studio环境
call "%VS_PATH%" >nul 2>&1

:: 编译
cl /std:c++17 /EHsc ^
   /I..\include ^
   /I..\include\glm ^
   ..\src\glad.c ^
   ..\src\batch_rendering.cpp ^
   /link ^
   ..\lib\glfw3.lib ^
   opengl32.lib ^
   gdi32.lib ^
   user32.lib ^
   kernel32.lib ^
   shell32.lib ^
   /NODEFAULTLIB:MSVCRT ^
   /OUT:batch_rendering.exe

if %ERRORLEVEL% EQU 0 (
    echo 编译成功！正在运行...
    batch_rendering.exe
) else (
    echo 编译失败！
)

cd ..
pause