/**
 * 洗牌算法集合
 * 洗牌算法用于随机打乱数组中的元素顺序
 */

// =============== Fisher-Yates 洗牌算法 ===============

/**
 * Fisher-Yates 洗牌算法 (现代版本)
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 * 正确性: 保证每个排列出现的概率相等
 */
export function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr]; // 创建副本，避免修改原数组

  for (let i = result.length - 1; i > 0; i--) {
    // 生成 [0, i] 范围内的随机索引
    const j = Math.floor(Math.random() * (i + 1));

    // 交换元素
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Fisher-Yates 洗牌算法 (就地版本)
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 * 注意: 会修改原数组
 */
export function fisherYatesShuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Knuth 洗牌算法 (Fisher-Yates 的别名)
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function knuthShuffle<T>(arr: T[]): T[] {
  return fisherYatesShuffle(arr);
}

// =============== 其他洗牌算法变体 ===============

/**
 * 简单随机洗牌 (朴素实现)
 * 时间复杂度: O(n²) - 效率较低，不推荐用于大数组
 * 空间复杂度: O(n)
 * 问题: 不能保证每个排列概率相等
 */
export function naiveShuffle<T>(arr: T[]): T[] {
  const result: T[] = [];
  const temp = [...arr];

  while (temp.length > 0) {
    const randomIndex = Math.floor(Math.random() * temp.length);
    result.push(temp[randomIndex]);
    temp.splice(randomIndex, 1);
  }

  return result;
}

/**
 * 内部洗牌算法 (使用 Array.sort)
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n)
 * 注意: 这不是真正的随机洗牌，依赖于排序算法的实现
 */
export function sortShuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * 多次随机交换洗牌
 * 时间复杂度: O(k * n) 其中 k 是交换次数
 * 空间复杂度: O(1)
 * 参数: iterations - 交换次数，默认 n 次
 */
export function randomSwapShuffle<T>(arr: T[], iterations?: number): T[] {
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

// =============== 洗牌算法验证与测试 ===============

/**
 * 验证洗牌算法的正确性
 * 检查每个位置的元素分布是否均匀
 */
export function validateShuffleCorrectness<T>(
  shuffleFn: (arr: T[]) => T[],
  original: T[],
  trials: number = 1000
): {
  positionDistributions: Map<number, Map<T, number>>,
  isUniform: boolean
} {
  const n = original.length;
  const positionDistributions = new Map<number, Map<T, number>>();

  // 初始化统计
  for (let pos = 0; pos < n; pos++) {
    positionDistributions.set(pos, new Map<T, number>());
  }

  // 运行多次试验
  for (let trial = 0; trial < trials; trial++) {
    const shuffled = shuffleFn([...original]);

    // 统计每个位置的元素分布
    for (let pos = 0; pos < n; pos++) {
      const element = shuffled[pos];
      const posMap = positionDistributions.get(pos)!;
      posMap.set(element, (posMap.get(element) || 0) + 1);
    }
  }

  // 检查分布是否均匀（理想情况下每个元素在每个位置出现的次数接近 trials/n）
  const expectedCount = trials / n;
  const tolerance = expectedCount * 0.2; // 允许 20% 的误差
  let isUniform = true;

  for (const [pos, elementMap] of positionDistributions) {
    for (const [element, count] of elementMap) {
      if (Math.abs(count - expectedCount) > tolerance) {
        isUniform = false;
        break;
      }
    }
    if (!isUniform) break;
  }

  return { positionDistributions, isUniform };
}

/**
 * 计算排列的概率分布
 */
export function analyzePermutationDistribution<T>(
  shuffleFn: (arr: T[]) => T[],
  arr: T[],
  trials: number = 10000
): Map<string, number> {
  const distribution = new Map<string, number>();

  for (let i = 0; i < trials; i++) {
    const shuffled = shuffleFn([...arr]);
    const key = shuffled.join(',');
    distribution.set(key, (distribution.get(key) || 0) + 1);
  }

  return distribution;
}

/**
 * 性能测试洗牌算法
 */
export function performanceTestShuffle<T>(
  shuffleFn: (arr: T[]) => T[],
  arr: T[],
  iterations: number = 1000
): {
  averageTime: number,
  minTime: number,
  maxTime: number,
  times: number[]
} {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    shuffleFn([...arr]);
    const end = performance.now();
    times.push(end - start);
  }

  return {
    averageTime: times.reduce((a, b) => a + b, 0) / times.length,
    minTime: times.reduce((a, b) => Math.min(a, b)),
    maxTime: times.reduce((a, b) => Math.max(a, b)),
    times
  };
}

/**
 * 洗牌算法的质量评估
 */
export function evaluateShuffleQuality<T>(
  shuffleFn: (arr: T[]) => T[],
  arr: T[],
  trials: number = 1000
): {
  correctness: boolean,
  uniformityScore: number,
  performance: {
    averageTime: number,
    minTime: number,
    maxTime: number
  }
} {
  const validation = validateShuffleCorrectness(shuffleFn, arr, trials);
  const performance = performanceTestShuffle(shuffleFn, arr, 100);

  // 计算均匀性得分 (0-1, 1 表示完全均匀)
  let totalVariance = 0;
  let positionCount = 0;

  for (const [pos, elementMap] of validation.positionDistributions) {
    const expected = trials / arr.length;
    for (const [element, count] of elementMap) {
      totalVariance += Math.pow(count - expected, 2);
      positionCount++;
    }
  }

  const uniformityScore = 1 - (totalVariance / positionCount) / (trials * trials);

  return {
    correctness: validation.isUniform,
    uniformityScore: Math.max(0, uniformityScore),
    performance: {
      averageTime: performance.averageTime,
      minTime: performance.minTime,
      maxTime: performance.maxTime
    }
  };
}

// =============== 实用工具函数 ===============

/**
 * 生成指定长度的随机数组
 */
export function generateRandomArray(size: number, min: number = 0, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * 生成有序数组
 */
export function generateSortedArray(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i + 1);
}

/**
 * 检查数组是否被正确洗牌（与原数组不同）
 */
export function isShuffled<T>(original: T[], shuffled: T[]): boolean {
  if (original.length !== shuffled.length) return false;

  // 检查是否有元素不同
  return !original.every((val, index) => val === shuffled[index]);
}

/**
 * 计算数组的熵（衡量随机性）
 */
export function calculateArrayEntropy<T>(arr: T[]): number {
  const frequency = new Map<T, number>();

  // 计算频率
  for (const item of arr) {
    frequency.set(item, (frequency.get(item) || 0) + 1);
  }

  // 计算熵
  let entropy = 0;
  const n = arr.length;

  for (const count of frequency.values()) {
    const p = count / n;
    entropy -= p * Math.log2(p);
  }

  return entropy;
}

/**
 * 洗牌算法演示
 */
export function demonstrateShuffle<T>(arr: T[], shuffleFn: (arr: T[]) => T[]): {
  original: T[],
  shuffled: T[],
  isDifferent: boolean,
  entropy: number
} {
  const original = [...arr];
  const shuffled = shuffleFn([...arr]);
  const isDifferent = isShuffled(original, shuffled);
  const entropy = calculateArrayEntropy(shuffled);

  return {
    original,
    shuffled,
    isDifferent,
    entropy
  };
}
