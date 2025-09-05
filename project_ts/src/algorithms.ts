/**
 * 排序和查找算法集合
 */

// =============== 排序算法 ===============

/**
 * 冒泡排序 (Bubble Sort)
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        // 交换元素
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }

    // 如果这一轮没有发生交换，说明已经有序
    if (!swapped) {
      break;
    }
  }

  return result;
}

/**
 * 选择排序 (Selection Sort)
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function selectionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // 在未排序部分找到最小元素的索引
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }

    // 如果找到更小的元素，交换
    if (minIndex !== i) {
      [result[i], result[minIndex]] = [result[minIndex], result[i]];
    }
  }

  return result;
}

/**
 * 插入排序 (Insertion Sort)
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 */
export function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  const n = result.length;

  for (let i = 1; i < n; i++) {
    const key = result[i];
    let j = i - 1;

    // 将大于key的元素向后移动
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }

    // 插入key到正确位置
    result[j + 1] = key;
  }

  return result;
}

/**
 * 快速排序 (Quick Sort)
 * 时间复杂度: 平均O(n log n)，最坏O(n²)
 * 空间复杂度: O(log n)
 */
export function quickSort(arr: number[]): number[] {
  const result = [...arr];

  function partition(low: number, high: number): number {
    const pivot = result[high]; // 选择最后一个元素作为基准
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (result[j] < pivot) {
        i++;
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    [result[i + 1], result[high]] = [result[high], result[i + 1]];
    return i + 1;
  }

  function sort(low: number, high: number): void {
    if (low < high) {
      const pi = partition(low, high);

      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, result.length - 1);
  return result;
}

/**
 * 归并排序 (Merge Sort)
 * 时间复杂度: O(n log n)
 * 空间复杂度: O(n)
 */
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return [...arr];
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid, mid + arr.length));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  // 合并两个有序数组
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 添加剩余元素
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// =============== 查找算法 ===============

/**
 * 线性查找 (Linear Search)
 * 时间复杂度: O(n)
 * 空间复杂度: O(1)
 */
export function linearSearch(arr: number[], target: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1; // 未找到
}

/**
 * 二分查找 (Binary Search) - 递归版本
 * 前提: 数组必须是有序的
 * 时间复杂度: O(log n)
 * 空间复杂度: O(log n)
 */
export function binarySearchRecursive(arr: number[], target: number): number {
  function search(low: number, high: number): number {
    if (low > high) {
      return -1;
    }

    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      return search(low, mid - 1);
    } else {
      return search(mid + 1, high);
    }
  }

  return search(0, arr.length - 1);
}

/**
 * 二分查找 (Binary Search) - 迭代版本
 * 前提: 数组必须是有序的
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 */
export function binarySearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return -1;
}

/**
 * 插值查找 (Interpolation Search)
 * 前提: 数组必须是有序且均匀分布
 * 时间复杂度: 平均O(log log n)，最坏O(n)
 * 空间复杂度: O(1)
 */
export function interpolationSearch(arr: number[], target: number): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      if (arr[low] === target) {
        return low;
      }
      return -1;
    }

    // 插值公式: pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));

    if (arr[pos] === target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  return -1;
}

/**
 * 指数查找 (Exponential Search)
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 * 适用于: 有序数组，未知数组大小或需要查找位置时
 */
export function exponentialSearch(arr: number[], target: number): number {
  const n = arr.length;

  // 如果第一个元素就是目标
  if (arr[0] === target) {
    return 0;
  }

  // 找到搜索范围的边界
  let i = 1;
  while (i < n && arr[i] <= target) {
    i *= 2;
  }

  // 在找到的范围内进行二分查找
  const start = Math.floor(i / 2);
  const end = Math.min(i, n);
  const subArray = arr.slice(start, end);
  const result = binarySearch(subArray, target);

  return result === -1 ? -1 : result + start;
}

/**
 * 跳跃查找 (Jump Search)
 * 时间复杂度: O(√n)
 * 空间复杂度: O(1)
 * 适用于: 有序数组，元素分布均匀
 */
export function jumpSearch(arr: number[], target: number): number {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));

  // 找到可能包含目标元素的块
  let prev = 0;
  while (prev < n && arr[Math.min(prev + step, n) - 1] < target) {
    prev += step;
    if (prev >= n) {
      return -1;
    }
  }

  // 在找到的块中进行线性查找
  let current = prev;
  while (current < Math.min(prev + step, n) && arr[current] <= target) {
    if (arr[current] === target) {
      return current;
    }
    current++;
  }

  return -1;
}

/**
 * 三分查找 (Ternary Search) - 递归版本
 * 时间复杂度: O(log₃ n)
 * 空间复杂度: O(log n)
 * 适用于: 具有单峰性质的函数或数组
 */
export function ternarySearch(arr: number[], target: number): number {
  function search(low: number, high: number): number {
    if (low > high) {
      return -1;
    }

    const mid1 = low + Math.floor((high - low) / 3);
    const mid2 = high - Math.floor((high - low) / 3);

    if (arr[mid1] === target) {
      return mid1;
    }
    if (arr[mid2] === target) {
      return mid2;
    }

    if (target < arr[mid1]) {
      return search(low, mid1 - 1);
    } else if (target > arr[mid2]) {
      return search(mid2 + 1, high);
    } else {
      return search(mid1 + 1, mid2 - 1);
    }
  }

  return search(0, arr.length - 1);
}

/**
 * 斐波那契查找 (Fibonacci Search)
 * 时间复杂度: O(log n)
 * 空间复杂度: O(1)
 * 优点: 使用斐波那契数列进行分割，比二分查找更高效
 */
export function fibonacciSearch(arr: number[], target: number): number {
  const n = arr.length;

  // 生成斐波那契数列
  function generateFibonacci(max: number): number[] {
    const fib: number[] = [0, 1];
    while (fib[fib.length - 1] < max) {
      fib.push(fib[fib.length - 1] + fib[fib.length - 2]);
    }
    return fib;
  }

  const fib = generateFibonacci(n);

  let fibMMinus2 = 0; // (m-2)'th Fibonacci number
  let fibMMinus1 = 1; // (m-1)'th Fibonacci number
  let fibM = fibMMinus1 + fibMMinus2; // m'th Fibonacci number

  // 找到最小的斐波那契数大于或等于n
  while (fibM < n) {
    fibMMinus2 = fibMMinus1;
    fibMMinus1 = fibM;
    fibM = fibMMinus1 + fibMMinus2;
  }

  // 标记删除的范围
  let offset = -1;

  while (fibM > 1) {
    // 检查有效范围
    const i = Math.min(offset + fibMMinus2, n - 1);

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
      return i;
    }
  }

  if (fibMMinus1 === 1 && arr[offset + 1] === target) {
    return offset + 1;
  }

  return -1;
}

// =============== 工具函数 ===============

/**
 * 生成随机数组
 */
export function generateRandomArray(size: number, min: number = 0, max: number = 100): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

/**
 * 验证数组是否有序
 */
export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      return false;
    }
  }
  return true;
}

/**
 * 性能测试函数
 */
export function performanceTest(sortFn: (arr: number[]) => number[], arr: number[]): {
  result: number[],
  time: number,
  sorted: boolean
} {
  const start = performance.now();
  const result = sortFn(arr);
  const time = performance.now() - start;

  return {
    result,
    time,
    sorted: isSorted(result)
  };
}
