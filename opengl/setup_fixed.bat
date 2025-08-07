@echo off
echo Setting up OpenGL development environment...

REM Create directories
mkdir include 2>nul
mkdir lib 2>nul
mkdir src 2>nul
mkdir shaders 2>nul
mkdir assets 2>nul
mkdir build 2>nul

echo Downloading dependencies...

REM Download GLFW
echo Downloading GLFW...
powershell -Command "try { Invoke-WebRequest -Uri 'https://github.com/glfw/glfw/releases/download/3.3.8/glfw-3.3.8.bin.WIN64.zip' -OutFile 'glfw.zip' } catch { Write-Host 'GLFW download failed, please download manually' }"
if exist glfw.zip (
    powershell -Command "Expand-Archive -Path 'glfw.zip' -DestinationPath 'temp' -Force"
    xcopy "temp\glfw-3.3.8.bin.WIN64\include\*" "include\" /E /Y
    xcopy "temp\glfw-3.3.8.bin.WIN64\lib-vc2022\*" "lib\" /E /Y
    rmdir /s /q temp
    del glfw.zip
    echo GLFW installed successfully!
) else (
    echo GLFW download failed. Please download manually from: https://www.glfw.org/download.html
)

REM Download GLM
echo Downloading GLM...
powershell -Command "try { Invoke-WebRequest -Uri 'https://github.com/g-truc/glm/releases/download/0.9.9.8/glm-0.9.9.8.zip' -OutFile 'glm.zip' } catch { Write-Host 'GLM download failed, please download manually' }"
if exist glm.zip (
    powershell -Command "Expand-Archive -Path 'glm.zip' -DestinationPath 'temp' -Force"
    xcopy "temp\glm\glm\*" "include\glm\" /E /Y
    rmdir /s /q temp
    del glm.zip
    echo GLM installed successfully!
) else (
    echo GLM download failed. Please download manually from: https://github.com/g-truc/glm/releases
)

REM Create GLAD files manually since the web service is unreliable
echo Creating GLAD files...
mkdir include\glad 2>nul
mkdir include\KHR 2>nul

echo Setup complete!
echo.
echo IMPORTANT: GLAD files need to be generated manually.
echo Please visit: https://glad.dav1d.de/
echo Configure: OpenGL 3.3+ Core, Generate a loader
echo Download and extract to include/glad/ and src/
echo.
echo After adding GLAD files, run build.bat to compile the project.
pause