cmake_minimum_required(VERSION 3.16)
project(OpenGLDemo)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Set output directories
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# Find OpenGL
find_package(OpenGL REQUIRED)

# Add include directories
include_directories(${CMAKE_SOURCE_DIR}/include)
include_directories(${CMAKE_SOURCE_DIR}/include/glad)
include_directories(${CMAKE_SOURCE_DIR}/include/GLFW)
include_directories(${CMAKE_SOURCE_DIR}/include/glm)

# Add library directories
link_directories(${CMAKE_SOURCE_DIR}/lib)

# Create main executable
add_executable(${PROJECT_NAME} src/main.cpp src/glad.c)

# Create batch rendering example
add_executable(batch_rendering src/batch_rendering.cpp src/glad.c)

# Link libraries
if(WIN32)
    target_link_libraries(${PROJECT_NAME} 
        OpenGL::GL
        glfw3
        gdi32
        user32
        kernel32
    )
    target_link_libraries(batch_rendering 
        OpenGL::GL
        glfw3
        gdi32
        user32
        kernel32
    )
else()
    target_link_libraries(${PROJECT_NAME} 
        OpenGL::GL
        glfw
        dl
        pthread
    )
    target_link_libraries(batch_rendering 
        OpenGL::GL
        glfw
        dl
        pthread
    )
endif()

# Copy shaders and assets to build directory
file(COPY ${CMAKE_SOURCE_DIR}/shaders DESTINATION ${CMAKE_BINARY_DIR})
file(COPY ${CMAKE_SOURCE_DIR}/assets DESTINATION ${CMAKE_BINARY_DIR})