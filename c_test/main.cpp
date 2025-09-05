#include <iostream>
#include <new>
#include <memory>
#include <cstring>
#include <variant>
#include <any>

// 简单的装箱类模板
template<typename T>
class Box {
private:
    T value;
public:
    Box(const T& val) : value(val) {}
    T unbox() const { return value; }
    void setValue(const T& val) { value = val; }
};

// 使用 std::any 实现通用装箱
class AnyBox {
private:
    std::any value;
public:
    template<typename T>
    AnyBox(const T& val) : value(val) {}
    
    template<typename T>
    T unbox() const {
        return std::any_cast<T>(value);
    }
    
    template<typename T>
    void setValue(const T& val) {
        value = val;
    }
};

// 使用 std::variant 实现多类型装箱
using VariantBox = std::variant<int, double, std::string>;

int main() {
    std::cout << "=== 拆装箱示例 ===" << std::endl;
    
    // 1. 简单模板装箱
    std::cout << "\n1. 简单模板装箱:" << std::endl;
    Box<int> intBox(42);
    Box<double> doubleBox(3.14);
    Box<std::string> stringBox("Hello World");
    
    std::cout << "装箱的整数: " << intBox.unbox() << std::endl;
    std::cout << "装箱的浮点数: " << doubleBox.unbox() << std::endl;
    std::cout << "装箱的字符串: " << stringBox.unbox() << std::endl;
    
    // 2. std::any 通用装箱
    std::cout << "\n2. std::any 通用装箱:" << std::endl;
    AnyBox anyBox1(100);
    AnyBox anyBox2(2.718);
    AnyBox anyBox3(std::string("C++ Boxing"));
    
    try {
        std::cout << "拆箱整数: " << anyBox1.unbox<int>() << std::endl;
        std::cout << "拆箱浮点数: " << anyBox2.unbox<double>() << std::endl;
        std::cout << "拆箱字符串: " << anyBox3.unbox<std::string>() << std::endl;
        
        // 错误的类型转换示例
        std::cout << "尝试错误的类型转换..." << std::endl;
        // std::cout << anyBox1.unbox<std::string>() << std::endl; // 这会抛出异常
    } catch (const std::bad_any_cast& e) {
        std::cout << "类型转换错误: " << e.what() << std::endl;
    }
    
    // 3. std::variant 多类型装箱
    std::cout << "\n3. std::variant 多类型装箱:" << std::endl;
    VariantBox varBox1 = 123;
    VariantBox varBox2 = 4.56;
    VariantBox varBox3 = std::string("Variant Box");
    
    // 使用 std::visit 访问值
    auto visitor = [](const auto& value) {
        std::cout << "值: " << value << ", 类型: " << typeid(value).name() << std::endl;
    };
    
    std::visit(visitor, varBox1);
    std::visit(visitor, varBox2);
    std::visit(visitor, varBox3);
    
    // 使用 std::get 获取特定类型的值
    std::cout << "\n使用 std::get 获取值:" << std::endl;
    try {
        std::cout << "获取整数: " << std::get<int>(varBox1) << std::endl;
        std::cout << "获取浮点数: " << std::get<double>(varBox2) << std::endl;
        std::cout << "获取字符串: " << std::get<std::string>(varBox3) << std::endl;
    } catch (const std::bad_variant_access& e) {
        std::cout << "variant 访问错误: " << e.what() << std::endl;
    }
    
    // 4. 动态类型检查
    std::cout << "\n4. 动态类型检查:" << std::endl;
    if (std::holds_alternative<int>(varBox1)) {
        std::cout << "varBox1 包含整数类型" << std::endl;
    }
    if (std::holds_alternative<double>(varBox2)) {
        std::cout << "varBox2 包含浮点数类型" << std::endl;
    }
    if (std::holds_alternative<std::string>(varBox3)) {
        std::cout << "varBox3 包含字符串类型" << std::endl;
    }
    
    return 0;
}
