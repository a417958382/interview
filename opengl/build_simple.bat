@echo off
echo Building OpenGL project...

REM Create build directory
if not exist "build" mkdir build
cd build

REM Configure with CMake
cmake .. -G "Visual Studio 17 2022" -A x64
if %errorlevel% neq 0 (
    echo CMake configuration failed. Trying with MinGW...
    cmake .. -G "MinGW Makefiles"
    if %errorlevel% neq 0 (
        echo CMake configuration failed. Please check your CMake installation.
        pause
        exit /b 1
    )
)

REM Build the project
cmake --build . --config Release
if %errorlevel% neq 0 (
    echo Build failed. Please check the error messages above.
    pause
    exit /b 1
)

echo Build completed successfully!
echo Executable should be in build/bin/ directory
cd ..
pause