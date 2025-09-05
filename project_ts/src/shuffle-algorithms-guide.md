# 洗牌算法完全指南

## 🎰 什么是洗牌算法？

洗牌算法用于随机打乱数组中元素的顺序，确保每个排列出现的概率相等。这在游戏开发、模拟实验、机器学习数据预处理等领域都有重要应用。

## 📊 洗牌算法复杂度对比

| 算法名称              | 时间复杂度 | 空间复杂度 | 正确性保证 | 推荐指数 |
|----------------------|-----------|-----------|-----------|---------|
| **Fisher-Yates 洗牌** | O(n)      | O(1)      | ✅ 完美   | ⭐⭐⭐⭐⭐ |
| Knuth 洗牌          | O(n)      | O(1)      | ✅ 完美   | ⭐⭐⭐⭐⭐ |
| 朴素洗牌            | O(n²)     | O(n)      | ❌ 有偏   | ⭐⭐     |
| 排序洗牌            | O(n log n)| O(n)      | ❌ 有偏   | ⭐      |
| 随机交换洗牌        | O(k×n)    | O(1)      | ❌ 有偏   | ⭐⭐     |

## 🔬 算法详解

### 1. Fisher-Yates 洗牌算法 ⭐⭐⭐⭐⭐

#### 核心思想
从数组末尾开始，随机选择一个位置与当前位置交换。

#### 代码实现
```typescript
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
```

#### 优势
- ✅ 时间复杂度 O(n)
- ✅ 空间复杂度 O(1)（不修改原数组）
- ✅ 保证每个排列概率完全相等
- ✅ 实现简单，性能优秀

#### 测试结果
```
正确性: ✅
均匀性得分: 100.0%
性能: 0.0006ms (平均)
```

### 2. Knuth 洗牌算法 ⭐⭐⭐⭐⭐

#### 核心思想
Fisher-Yates 洗牌算法的别名，由 Donald Knuth 在《计算机程序设计艺术》中描述。

#### 特点
- 与 Fisher-Yates 算法完全相同
- 理论基础更完善
- 常用于学术和工业应用

### 3. 朴素洗牌算法 ⭐⭐

#### 核心思想
随机从原数组中选择元素放入新数组，直到所有元素都被选中。

#### 代码实现
```typescript
function naiveShuffle<T>(arr: T[]): T[] {
  const result: T[] = [];
  const temp = [...arr];

  while (temp.length > 0) {
    const randomIndex = Math.floor(Math.random() * temp.length);
    result.push(temp[randomIndex]);
    temp.splice(randomIndex, 1);
  }

  return result;
}
```

#### 问题
- ❌ 时间复杂度 O(n²)，效率低下
- ❌ 空间复杂度 O(n)，需要额外空间
- ❌ 某些情况下分布不均匀

#### 测试结果
```
正确性: ❌
均匀性得分: 100.0%
性能: 0.2018ms (平均) - 比 Fisher-Yates 慢 8 倍
```

### 4. 排序洗牌算法 ⭐

#### 核心思想
使用 `Array.sort()` 并传入随机比较函数。

#### 代码实现
```typescript
function sortShuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
```

#### 问题
- ❌ 依赖于排序算法的具体实现
- ❌ 在某些 JavaScript 引擎中分布不均匀
- ❌ 时间复杂度 O(n log n)

#### 测试结果
```
正确性: ❌
均匀性得分: 99.9%
性能: 0.3972ms (平均) - 最慢的算法
```

### 5. 随机交换洗牌 ⭐⭐

#### 核心思想
随机选择两个位置进行交换，重复多次。

#### 代码实现
```typescript
function randomSwapShuffle<T>(arr: T[], iterations?: number): T[] {
  const result = [...arr];
  const n = result.length;
  const swapCount = iterations || n;

  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * n);
    const idx2 = Math.floor(Math.random() * n);
    [result[idx1], result[idx2]] = [result[idx2], result[idx1]];
  }

  return result;
}
```

#### 特点
- ✅ 空间复杂度 O(1)
- ❌ 不能保证每个排列概率相等
- ❌ 需要多次迭代才能接近均匀分布

## 📈 实际测试对比

### 排列分布测试 (数组 [1,2,3])

| 排列 | Fisher-Yates | 朴素洗牌 | 理想分布 |
|------|-------------|---------|---------|
| [1,2,3] | 17.2% | 16.4% | 16.7% |
| [1,3,2] | 16.6% | 16.9% | 16.7% |
| [2,1,3] | 16.0% | 16.7% | 16.7% |
| [2,3,1] | 16.9% | 16.1% | 16.7% |
| [3,1,2] | 17.0% | 17.9% | 16.7% |
| [3,2,1] | 16.3% | 16.1% | 16.7% |

### 性能测试 (1000 元素数组)

| 算法 | 平均时间 | 最快时间 | 最慢时间 |
|------|---------|---------|---------|
| Fisher-Yates | 0.0241ms | 0.0175ms | 0.2572ms |
| 朴素洗牌 | 0.2018ms | 0.0921ms | 2.7160ms |
| 排序洗牌 | 0.3972ms | 0.2682ms | 2.6421ms |

## 🎯 使用建议

### 推荐场景

#### 🏆 通用应用
```typescript
// 使用 Fisher-Yates 洗牌
const shuffled = fisherYatesShuffle(myArray);
```

#### 🎮 游戏开发
```typescript
// 洗牌扑克牌
const deck = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const shuffledDeck = fisherYatesShuffle(deck);
```

#### 🔬 科学计算
```typescript
// 数据随机化
const dataset = fisherYatesShuffle(originalData);
```

#### 💾 内存受限环境
```typescript
// 就地洗牌，不创建新数组
fisherYatesShuffleInPlace(myArray);
```

### 避免使用的场景

#### ❌ 大数据集
```typescript
// 不要使用朴素洗牌处理大数据
// naiveShuffle(largeArray); // O(n²) 效率低下
```

#### ❌ 需要精确均匀分布的学术研究
```typescript
// 不要使用排序洗牌进行学术研究
// sortShuffle(data); // 分布不保证均匀
```

## 🔧 实用工具函数

### 验证洗牌正确性
```typescript
const validation = validateShuffleCorrectness(fisherYatesShuffle, testArray, 1000);
console.log(`均匀分布: ${validation.isUniform}`);
```

### 性能测试
```typescript
const performance = performanceTestShuffle(fisherYatesShuffle, largeArray, 100);
console.log(`平均时间: ${performance.averageTime}ms`);
```

### 计算数组熵值
```typescript
const entropy = calculateArrayEntropy(shuffledArray);
// 熵值越高，随机性越好
```

## 🧪 测试命令

```bash
# 运行洗牌算法测试
npm run test-shuffle
```

## ✅ 结论

**Fisher-Yates 洗牌算法是洗牌算法的黄金标准**，它：

1. ✅ 提供理论最优的 O(n) 时间复杂度
2. ✅ 保证每个排列出现的概率完全相等
3. ✅ 空间复杂度 O(1)，不浪费内存
4. ✅ 实现简单，性能优秀
5. ✅ 适用于所有编程语言和环境

在实际应用中，除非有特殊需求，否则都应该使用 Fisher-Yates 洗牌算法。
