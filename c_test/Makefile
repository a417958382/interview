# Makefile for C++ testing
CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -g
TARGET = test_runner
SOURCES = main.cpp

# Default target
all: $(TARGET)

# Build the test runner
$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SOURCES)

# Run tests
test: $(TARGET)
	./$(TARGET)

# Clean build artifacts
clean:
	rm -f $(TARGET)

# Rebuild everything
rebuild: clean all

.PHONY: all test clean rebuild