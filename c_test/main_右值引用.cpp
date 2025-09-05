#include <iostream>
#include <vector>
#include <memory>
#include <utility>
#include <cstring>

// 自定义类用于演示移动语义
class MyString {
private:
    char* data;
    size_t size;

public:
    // 构造函数
    MyString(const char* str = "") {
        size = strlen(str);
        data = new char[size + 1];
        strcpy(data, str);
        std::cout << "构造函数: " << data << std::endl;
    }

    // 拷贝构造函数
    MyString(const MyString& other) {
        size = other.size;
        data = new char[size + 1];
        strcpy(data, other.data);
        std::cout << "拷贝构造函数: " << data << std::endl;
    }

    // 移动构造函数 (右值引用)
    MyString(MyString&& other) noexcept {
        data = other.data;
        size = other.size;
        other.data = nullptr;
        other.size = 0;
        std::cout << "移动构造函数: " << data << std::endl;
    }

    // 拷贝赋值运算符
    MyString& operator=(const MyString& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            data = new char[size + 1];
            strcpy(data, other.data);
            std::cout << "拷贝赋值: " << data << std::endl;
        }
        return *this;
    }

    // 移动赋值运算符 (右值引用)
    MyString& operator=(MyString&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            size = other.size;
            other.data = nullptr;
            other.size = 0;
            std::cout << "移动赋值: " << data << std::endl;
        }
        return *this;
    }

    // 析构函数
    ~MyString() {
        if (data) {
            std::cout << "析构函数: " << data << std::endl;
            delete[] data;
        }
    }

    // 获取数据
    const char* c_str() const { return data ? data : ""; }
};

// 返回临时对象的函数
MyString createString(const char* str) {
    return MyString(str);  // 返回临时对象(右值)
};

// 完美转发示例
template<typename T>
void forwardFunction(T&& arg) {
    // 使用std::forward保持参数的值类别
    processValue(std::forward<T>(arg));
};

void processValue(const MyString& str) {
    std::cout << "处理左值引用: " << str.c_str() << std::endl;
};

void processValue(MyString&& str) {
    std::cout << "处理右值引用: " << str.c_str() << std::endl;
};

int main() {
    std::cout << "=== 右值引用场景演示 ===" << std::endl;

    // 场景1: 基本的左值和右值
    std::cout << "\n1. 基本左值和右值:" << std::endl;
    int x = 10;        // x是左值，10是右值
    int y = x + 5;     // y是左值，x+5是右值表达式
    
    int& lref = x;     // 左值引用绑定到左值
    int&& rref = 20;   // 右值引用绑定到右值
    // int&& rref2 = x;   // 错误：右值引用不能直接绑定到左值
    int&& rref3 = std::move(x);  // 使用std::move将左值转换为右值引用
    
    std::cout << "x = " << x << ", y = " << y << std::endl;
    std::cout << "lref = " << lref << ", rref = " << rref << ", rref3 = " << rref3 << std::endl;

    // 场景2: 移动语义避免不必要的拷贝
    std::cout << "\n2. 移动语义演示:" << std::endl;
    MyString str1("Hello");
    MyString str2 = std::move(str1);  // 移动构造，避免拷贝
    std::cout << "str1 after move: '" << str1.c_str() << "'" << std::endl;
    std::cout << "str2 after move: '" << str2.c_str() << "'" << std::endl;

    // 场景3: 函数返回值优化
    std::cout << "\n3. 函数返回临时对象:" << std::endl;
    MyString str3 = createString("World");  // 可能触发移动构造或RVO

    // 场景4: 容器中的移动语义
    std::cout << "\n4. 容器中的移动语义:" << std::endl;
    std::vector<MyString> vec;
    vec.push_back(MyString("First"));   // 临时对象，触发移动
    vec.push_back(createString("Second")); // 函数返回临时对象
    
    MyString str4("Third");
    vec.push_back(std::move(str4));     // 显式移动

    // 场景5: 完美转发
    std::cout << "\n5. 完美转发演示:" << std::endl;
    MyString str5("Forward Test");
    forwardFunction(str5);              // 传递左值
    forwardFunction(MyString("Temp"));  // 传递右值

    // 场景6: 智能指针的移动
    std::cout << "\n6. 智能指针移动:" << std::endl;
    std::unique_ptr<int> ptr1 = std::make_unique<int>(42);
    std::unique_ptr<int> ptr2 = std::move(ptr1);  // 移动所有权
    
    std::cout << "ptr1 is " << (ptr1 ? "valid" : "null") << std::endl;
    std::cout << "ptr2 points to: " << *ptr2 << std::endl;

    // 场景7: 右值引用作为函数参数
    std::cout << "\n7. 右值引用函数参数:" << std::endl;
    auto processRValue = [](MyString&& str) {
        std::cout << "接收到右值: " << str.c_str() << std::endl;
        // 在函数内部，str是一个左值（有名字的变量）
        // 如果要继续传递为右值，需要使用std::move
        MyString moved = std::move(str);
        return moved;
    };
    
    MyString result = processRValue(createString("RValue Param"));

    // 场景8: 万能引用（Universal Reference）
    std::cout << "\n8. 万能引用演示:" << std::endl;
    auto universalRef = [](auto&& param) {
        using T = std::decay_t<decltype(param)>;
        if constexpr (std::is_same_v<T, MyString>) {
            std::cout << "处理MyString类型: " << param.c_str() << std::endl;
        } else {
            std::cout << "处理其他类型" << std::endl;
        }
    };
    
    MyString str6("Universal");
    universalRef(str6);                    // 左值
    universalRef(MyString("Temp"));        // 右值
    universalRef(42);                      // 其他类型

    std::cout << "\n=== 演示结束 ===" << std::endl;
    return 0;
};