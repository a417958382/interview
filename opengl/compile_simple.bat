@echo off
echo Compiling simple OpenGL example...

REM Check if we have a C++ compiler
where cl >nul 2>nul
if %errorlevel% equ 0 (
    echo Using MSVC compiler...
    cl /EHsc src/simple_triangle.cpp /link opengl32.lib gdi32.lib user32.lib /out:simple_triangle.exe
    goto :done
)

where g++ >nul 2>nul
if %errorlevel% equ 0 (
    echo Using MinGW compiler...
    g++ -o simple_triangle.exe src/simple_triangle.cpp -lopengl32 -lgdi32 -luser32
    goto :done
)

echo No suitable C++ compiler found.
echo Please install Visual Studio or MinGW-w64.
pause
exit /b 1

:done
if exist simple_triangle.exe (
    echo Compilation successful!
    echo Run simple_triangle.exe to see the triangle
) else (
    echo Compilation failed!
)
pause