#include <iostream>
#include <new>
#include <memory>
#include <cstring>

// 自定义类用于演示new和placement new
class MyClass {
private:
    int value;
    char* data;

public:
    // 构造函数
    MyClass(int val = 0, const char* str = "default") : value(val) {
        size_t len = strlen(str);
        data = new char[len + 1];
        strcpy(data, str);
        std::cout << "构造函数调用: value=" << value << ", data=" << data << std::endl;
    }

    // 析构函数
    ~MyClass() {
        std::cout << "析构函数调用: value=" << value << ", data=" << data << std::endl;
        delete[] data;
    }

    // 显示信息
    void display() const {
        std::cout << "MyClass对象 - value: " << value << ", data: " << data 
                  << ", 地址: " << this << std::endl;
    }

    // 获取值
    int getValue() const { return value; }
    const char* getData() const { return data; }
};

// 自定义内存池类
class MemoryPool {
private:
    char* pool;
    size_t size;
    size_t used;

public:
    MemoryPool(size_t poolSize) : size(poolSize), used(0) {
        pool = new char[size];
        std::cout << "内存池创建，大小: " << size << " 字节，地址: " << (void*)pool << std::endl;
    }

    ~MemoryPool() {
        std::cout << "内存池销毁" << std::endl;
        delete[] pool;
    }

    void* allocate(size_t bytes) {
        if (used + bytes > size) {
            std::cout << "内存池空间不足！" << std::endl;
            return nullptr;
        }
        void* ptr = pool + used;
        used += bytes;
        std::cout << "从内存池分配 " << bytes << " 字节，地址: " << ptr << std::endl;
        return ptr;
    }

    void reset() {
        used = 0;
        std::cout << "内存池重置" << std::endl;
    }

    size_t getUsed() const { return used; }
    size_t getRemaining() const { return size - used; }
};

int main() {
    std::cout << "=== new 和 placement new 演示 ===" << std::endl;

    // 场景1: 普通的new操作符
    std::cout << "\n1. 普通new操作符演示:" << std::endl;
    MyClass* obj1 = new MyClass(100, "普通new");
    obj1->display();
    delete obj1;  // 记得释放内存

    // 场景2: new[]数组分配
    std::cout << "\n2. new[]数组分配:" << std::endl;
    MyClass* objArray = new MyClass[3]{
        MyClass(1, "数组1"),
        MyClass(2, "数组2"),
        MyClass(3, "数组3")
    };
    
    for (int i = 0; i < 3; i++) {
        std::cout << "数组元素[" << i << "]: ";
        objArray[i].display();
    }
    delete[] objArray;  // 使用delete[]释放数组

    // 场景3: placement new基础用法
    std::cout << "\n3. placement new基础用法:" << std::endl;
    
    // 预分配内存
    char buffer[sizeof(MyClass)];
    std::cout << "预分配缓冲区地址: " << (void*)buffer << std::endl;
    
    // 使用placement new在指定内存位置构造对象
    MyClass* obj2 = new(buffer) MyClass(200, "placement new");
    obj2->display();
    
    // 手动调用析构函数（placement new不会自动调用delete）
    obj2->~MyClass();

    // 场景4: 内存池中使用placement new
    std::cout << "\n4. 内存池中使用placement new:" << std::endl;
    MemoryPool pool(1024);
    
    // 在内存池中分配多个对象
    void* mem1 = pool.allocate(sizeof(MyClass));
    MyClass* poolObj1 = new(mem1) MyClass(301, "池对象1");
    
    void* mem2 = pool.allocate(sizeof(MyClass));
    MyClass* poolObj2 = new(mem2) MyClass(302, "池对象2");
    
    void* mem3 = pool.allocate(sizeof(MyClass));
        MyClass* poolObj3 = new(mem3) MyClass(303, "池对象3");
        
        std::cout << "内存池使用情况: " << pool.getUsed() << "/" 
                  << (pool.getUsed() + pool.getRemaining()) << " 字节" << std::endl;
    
    // 显示所有对象
    poolObj1->display();
    poolObj2->display();
    poolObj3->display();
    
    // 手动析构（注意顺序）
    poolObj3->~MyClass();
    poolObj2->~MyClass();
    poolObj1->~MyClass();

    // 场景5: placement new数组
    std::cout << "\n5. placement new数组:" << std::endl;
    const int arraySize = 3;
    char arrayBuffer[sizeof(MyClass) * arraySize];
    // 在缓冲区中构造对象数组
    MyClass* placementArray = reinterpret_cast<MyClass*>(arrayBuffer);
    for (int i = 0; i < arraySize; i++) {
        new(placementArray + i) MyClass(400 + i, ("placement数组" + std::to_string(i)).c_str());
    }
    
    // 显示数组元素
    for (int i = 0; i < arraySize; i++) {
        std::cout << "placement数组[" << i << "]: ";
        placementArray[i].display();
    }
    
    // 手动析构数组元素（逆序）
    for (int i = arraySize - 1; i >= 0; i--) {
        placementArray[i].~MyClass();
    }

    // 场景6: nothrow new
    std::cout << "\n6. nothrow new演示:" << std::endl;
    try {
        // 普通new在失败时抛出异常
        MyClass* obj3 = new MyClass(500, "可能异常");
        obj3->display();
        delete obj3;
        
        // nothrow new在失败时返回nullptr
        MyClass* obj4 = new(std::nothrow) MyClass(501, "不抛异常");
        if (obj4) {
            obj4->display();
            delete obj4;
        } else {
            std::cout << "nothrow new 分配失败" << std::endl;
        }
    } catch (const std::bad_alloc& e) {
        std::cout << "内存分配异常: " << e.what() << std::endl;
    }

    // 场景7: 对齐的placement new
    std::cout << "\n7. 对齐的placement new:" << std::endl;
    char alignedBuffer[sizeof(MyClass)] __attribute__((aligned(64)));  // 64字节对齐
    std::cout << "对齐缓冲区地址: " << (void*)alignedBuffer 
              << " (应该是64的倍数)" << std::endl;
    
    MyClass* alignedObj = new(alignedBuffer) MyClass(600, "对齐对象");
    alignedObj->display();
    alignedObj->~MyClass();

    // 场景8: 重复使用同一块内存
    std::cout << "\n8. 重复使用同一块内存:" << std::endl;
    char reuseBuffer[sizeof(MyClass)];
    
    // 第一次使用
    MyClass* reuse1 = new(reuseBuffer) MyClass(700, "第一次使用");
    reuse1->display();
    reuse1->~MyClass();
    
    // 第二次使用同一块内存
    MyClass* reuse2 = new(reuseBuffer) MyClass(701, "第二次使用");
    reuse2->display();
    reuse2->~MyClass();

    std::cout << "\n=== 演示结束 ===" << std::endl;
    std::cout << "\n总结:" << std::endl;
    std::cout << "- new: 分配内存 + 调用构造函数" << std::endl;
    std::cout << "- delete: 调用析构函数 + 释放内存" << std::endl;
    std::cout << "- placement new: 在指定内存位置调用构造函数" << std::endl;
    std::cout << "- placement new需要手动调用析构函数" << std::endl;
    std::cout << "- 适用场景: 内存池、对象重用、嵌入式系统等" << std::endl;
    
    return 0;
}