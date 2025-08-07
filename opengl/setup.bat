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
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/glfw/glfw/releases/download/3.3.8/glfw-3.3.8.bin.WIN64.zip' -OutFile 'glfw.zip'"
powershell -Command "Expand-Archive -Path 'glfw.zip' -DestinationPath 'temp' -Force"
xcopy "temp\glfw-3.3.8.bin.WIN64\include\*" "include\" /E /Y
xcopy "temp\glfw-3.3.8.bin.WIN64\lib-vc2022\*" "lib\" /E /Y
rmdir /s /q temp
del glfw.zip

REM Download GLM
echo Downloading GLM...
powershell -Command "Invoke-WebRequest -Uri 'https://github.com/g-truc/glm/releases/download/0.9.9.8/glm-0.9.9.8.zip' -OutFile 'glm.zip'"
powershell -Command "Expand-Archive -Path 'glm.zip' -DestinationPath 'temp' -Force"
xcopy "temp\glm\glm\*" "include\glm\" /E /Y
rmdir /s /q temp
del glm.zip

REM Generate GLAD files
echo Generating GLAD files...
mkdir include\glad 2>nul
powershell -Command "Invoke-WebRequest -Uri 'https://glad.dav1d.de/generated/tmpkqzlvvglglad/glad.zip' -OutFile 'glad.zip'"
powershell -Command "Expand-Archive -Path 'glad.zip' -DestinationPath 'temp' -Force"
xcopy "temp\include\*" "include\" /E /Y
xcopy "temp\src\*" "src\" /E /Y
rmdir /s /q temp
del glad.zip

echo Setup complete!
echo Run build.bat to compile the project.
pause