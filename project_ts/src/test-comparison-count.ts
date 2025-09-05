import {
  binarySearch,
  linearSearch,
  interpolationSearch,
  exponentialSearch,
  jumpSearch,
  ternarySearch,
  fibonacciSearch
} from './algorithms.js';

/**
 * 更准确的比较计数器二分查找
 * 只统计元素比较次数，不包括中间值计算
 */
function binarySearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return { index: mid, comparisons: comparisons + 1 };
    } else if (arr[mid] > target) {
      high = mid - 1;
      comparisons++;
    } else {
      low = mid + 1;
      comparisons++;
    }
  }

  return { index: -1, comparisons };
}

/**
 * 更准确的比较计数器线性查找
 */
function linearSearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    if (arr[i] === target) {
      return { index: i, comparisons };
    }
  }

  return { index: -1, comparisons };
}

/**
 * 更准确的比较计数器插值查找
 */
function interpolationSearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  let low = 0;
  let high = arr.length - 1;
  let comparisons = 0;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      return arr[low] === target
        ? { index: low, comparisons: comparisons + 1 }
        : { index: -1, comparisons: comparisons + 1 };
    }

    // 插值公式计算位置
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

    if (arr[pos] === target) {
      return { index: pos, comparisons: comparisons + 1 };
    } else if (arr[pos] < target) {
      low = pos + 1;
      comparisons++;
    } else {
      high = pos - 1;
      comparisons++;
    }
  }

  return { index: -1, comparisons };
}

/**
 * 指数查找比较计数器
 */
function exponentialSearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  const n = arr.length;
  let comparisons = 0;

  // 如果第一个元素就是目标
  comparisons++;
  if (arr[0] === target) {
    return { index: 0, comparisons };
  }

  // 找到搜索范围的边界
  let i = 1;
  while (i < n) {
    comparisons++;
    if (arr[i] > target) {
      break;
    }
    i *= 2;
  }

  // 在找到的范围内进行二分查找
  const start = Math.floor(i / 2);
  const end = Math.min(i, n);
  const subArray = arr.slice(start, end);

  const binaryResult = binarySearchWithCount(subArray, target);
  return {
    index: binaryResult.index === -1 ? -1 : binaryResult.index + start,
    comparisons: comparisons + binaryResult.comparisons
  };
}

/**
 * 跳跃查找比较计数器
 */
function jumpSearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  const n = arr.length;
  let comparisons = 0;
  let step = Math.floor(Math.sqrt(n));

  // 找到可能包含目标元素的块
  let prev = 0;
  while (prev < n) {
    const checkIndex = Math.min(prev + step, n) - 1;
    comparisons++;
    if (arr[checkIndex] >= target) {
      break;
    }
    prev += step;
    if (prev >= n) {
      return { index: -1, comparisons };
    }
  }

  // 在找到的块中进行线性查找
  let current = prev;
  const end = Math.min(prev + step, n);
  while (current < end) {
    comparisons++;
    if (arr[current] === target) {
      return { index: current, comparisons };
    }
    if (arr[current] > target) {
      break;
    }
    current++;
  }

  return { index: -1, comparisons };
}

/**
 * 三分查找比较计数器
 */
function ternarySearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  function search(low: number, high: number): { index: number, comparisons: number } {
    if (low > high) {
      return { index: -1, comparisons: 0 };
    }

    const mid1 = low + Math.floor((high - low) / 3);
    const mid2 = high - Math.floor((high - low) / 3);

    let comparisons = 2; // 比较两个中间值

    if (arr[mid1] === target) {
      return { index: mid1, comparisons };
    }
    if (arr[mid2] === target) {
      return { index: mid2, comparisons };
    }

    if (target < arr[mid1]) {
      const result = search(low, mid1 - 1);
      return { index: result.index, comparisons: comparisons + result.comparisons };
    } else if (target > arr[mid2]) {
      const result = search(mid2 + 1, high);
      return { index: result.index, comparisons: comparisons + result.comparisons };
    } else {
      const result = search(mid1 + 1, mid2 - 1);
      return { index: result.index, comparisons: comparisons + result.comparisons };
    }
  }

  return search(0, arr.length - 1);
}

/**
 * 斐波那契查找比较计数器
 */
function fibonacciSearchWithCount(arr: number[], target: number): { index: number, comparisons: number } {
  const n = arr.length;
  let comparisons = 0;

  // 生成斐波那契数列
  function generateFibonacci(max: number): number[] {
    const fib: number[] = [0, 1];
    while (fib[fib.length - 1] < max) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
  }

  const fib = generateFibonacci(n);

  let fibMMinus2 = 0;
  let fibMMinus1 = 1;
  let fibM = fibMMinus1 + fibMMinus2;

  while (fibM < n) {
    fibMMinus2 = fibMMinus1;
    fibMMinus1 = fibM;
    fibM = fibMMinus1 + fibMMinus2;
  }

  let offset = -1;

  while (fibM > 1) {
    const i = Math.min(offset + fibMMinus2, n - 1);
    comparisons++;

    if (arr[i] < target) {
      fibM = fibMMinus1;
      fibMMinus1 = fibMMinus2;
      fibMMinus2 = fibM - fibMMinus1;
      offset = i;
    } else if (arr[i] > target) {
      fibM = fibMMinus2;
      fibMMinus1 = fibMMinus1 - fibMMinus2;
      fibMMinus2 = fibM - fibMMinus1;
    } else {
      return { index: i, comparisons };
    }
  }

  if (fibMMinus1 === 1 && arr[offset + 1] === target) {
    return { index: offset + 1, comparisons: comparisons + 1 };
  }

  return { index: -1, comparisons };
}

/**
 * 计算理论上的最少比较次数
 */
function calculateTheoreticalMinComparisons(n: number): number {
  // 对于大小为n的有序数组，最少比较次数是 floor(log2(n)) + 1
  return Math.floor(Math.log2(n)) + 1;
}

/**
 * 演示二分查找的比较过程
 */
function demonstrateBinarySearchProcess(arr: number[], target: number) {
  console.log(`\n🔍 二分查找过程演示 - 查找 ${target} 在 [${arr.join(', ')}] 中的位置`);

  let low = 0;
  let high = arr.length - 1;
  let step = 1;
  let comparisons = 0;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    console.log(`步骤 ${step}: low=${low}, high=${high}, mid=${mid}, arr[${mid}]=${arr[mid]}`);

    if (arr[mid] === target) {
      console.log(`✅ 找到目标! 位置=${mid}, 总比较次数=${comparisons + 1}`);
      return { index: mid, comparisons: comparisons + 1 };
    } else if (arr[mid] > target) {
      high = mid - 1;
      console.log(`   arr[${mid}](${arr[mid]}) > ${target}, 缩小范围到 [${low}, ${high}]`);
      comparisons++;
    } else {
      low = mid + 1;
      console.log(`   arr[${mid}](${arr[mid]}) < ${target}, 缩小范围到 [${low}, ${high}]`);
      comparisons++;
    }

    step++;
    if (step > 10) break; // 防止无限循环
  }

  console.log(`❌ 未找到目标, 总比较次数=${comparisons}`);
  return { index: -1, comparisons };
}

/**
 * 测试不同查找算法的比较次数
 */
function testComparisonCounts() {
  console.log('🔍 有序数组查找算法比较次数分析\n');

  // 测试不同大小的数组
  const testSizes = [8, 16, 32, 64, 128, 256, 512];

  console.log('数组大小 | 理论最小 | 二分查找 | 线性查找 | 插值查找 | 指数查找 | 跳跃查找 | 三分查找 | 斐波那契');
  console.log('----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|----------');

  testSizes.forEach(size => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    const worstCaseTarget = size + 1; // 查找不存在的元素

    const binaryResult = binarySearchWithCount(arr, worstCaseTarget);
    const linearResult = linearSearchWithCount(arr, worstCaseTarget);
    const interpolationResult = interpolationSearchWithCount(arr, worstCaseTarget);
    const exponentialResult = exponentialSearchWithCount(arr, worstCaseTarget);
    const jumpResult = jumpSearchWithCount(arr, worstCaseTarget);
    const ternaryResult = ternarySearchWithCount(arr, worstCaseTarget);
    const fibonacciResult = fibonacciSearchWithCount(arr, worstCaseTarget);
    const theoreticalMin = calculateTheoreticalMinComparisons(size);

    console.log(
      `${size.toString().padStart(9)} | ${theoreticalMin.toString().padStart(9)} | ${binaryResult.comparisons.toString().padStart(9)} | ${linearResult.comparisons.toString().padStart(9)} | ${interpolationResult.comparisons.toString().padStart(9)} | ${exponentialResult.comparisons.toString().padStart(9)} | ${jumpResult.comparisons.toString().padStart(9)} | ${ternaryResult.comparisons.toString().padStart(9)} | ${fibonacciResult.comparisons.toString().padStart(8)}`
    );
  });

  console.log('\n📊 详细测试用例分析：');

  // 演示二分查找过程
  const demoArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  demonstrateBinarySearchProcess(demoArray, 7);
  demonstrateBinarySearchProcess(demoArray, 17); // 不存在的元素

  // 对比不同算法
  console.log('\n⚖️  算法对比测试：');
  const testArray = Array.from({ length: 32 }, (_, i) => i + 1);
  const testTargets = [1, 16, 32, 33]; // 不同位置的元素

  console.log('\n目标 | 二分查找 | 线性查找 | 插值查找 | 指数查找 | 跳跃查找 | 三分查找 | 斐波那契');
  console.log('------|-----------|-----------|-----------|-----------|-----------|-----------|----------');

  testTargets.forEach(target => {
    const binary = binarySearchWithCount(testArray, target);
    const linear = linearSearchWithCount(testArray, target);
    const interpolation = interpolationSearchWithCount(testArray, target);
    const exponential = exponentialSearchWithCount(testArray, target);
    const jump = jumpSearchWithCount(testArray, target);
    const ternary = ternarySearchWithCount(testArray, target);
    const fibonacci = fibonacciSearchWithCount(testArray, target);

    console.log(
      `${target.toString().padStart(4)} | ${binary.comparisons.toString().padStart(9)} | ${linear.comparisons.toString().padStart(9)} | ${interpolation.comparisons.toString().padStart(9)} | ${exponential.comparisons.toString().padStart(9)} | ${jump.comparisons.toString().padStart(9)} | ${ternary.comparisons.toString().padStart(9)} | ${fibonacci.comparisons.toString().padStart(8)}`
    );
  });

  console.log('\n🎯 算法复杂度总结：');
  console.log('\n📊 复杂度对比表：');
  console.log('算法名称    | 最坏时间复杂度 | 空间复杂度 | 特点');
  console.log('------------|----------------|------------|------');
  console.log('二分查找    | O(log n)      | O(1)      | 理论最优，稳定可靠');
  console.log('线性查找    | O(n)          | O(1)      | 最简单，无序数组适用');
  console.log('插值查找    | O(n)          | O(1)      | 均匀分布时最快');
  console.log('指数查找    | O(log n)      | O(1)      | 适用于无限/未知大小数组');
  console.log('跳跃查找    | O(√n)         | O(1)      | 平衡查找效率');
  console.log('三分查找    | O(log₃ n)     | O(log n)  | 单峰函数优化');
  console.log('斐波那契查找| O(log n)      | O(1)      | 使用斐波那契数列分割');

  console.log('\n🏆 核心结论：');
  console.log('1. 二分查找提供理论最优的 O(log n) 最坏情况保证');
  console.log('2. 在有序数组中，二分查找是最少比较次数的算法');
  console.log('3. 其他 O(log n) 算法（如指数查找、斐波那契查找）在实践中可能更快');
  console.log('4. 但只有二分查找提供最稳定的最坏情况性能保证');
  console.log('5. 选择算法应根据具体场景：数据分布、内存限制、是否有序等');
}

// 运行测试
testComparisonCounts();
