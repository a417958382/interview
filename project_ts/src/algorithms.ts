/**
 * 排序和查找算法集合
 */

// =============== 排序算法 ===============

/**
 * 冒泡排序 (Bubble Sort)
 * 时间复杂度: O(n²)
 * 空间复杂度: O(1)
 * 
 * 算法思想:
 * 通过重复遍历数组，比较相邻元素并交换位置，将较大的元素逐渐"冒泡"到数组末尾。
 * 每一轮遍历后，最大的元素会"冒泡"到正确位置，下一轮只需要处理剩余元素。
 * 
 * 实现思路:
 * 1. 外层循环控制遍历轮数，每轮减少一个元素
 * 2. 内层循环比较相邻元素，如果前一个大于后一个则交换
 * 3. 如果某一轮没有发生交换，说明数组已经有序，可以提前结束
 * 4. 优化：每轮后最大的元素已就位，内层循环范围可以缩小
 * 
 * 优势:
 * - 实现简单，易于理解
 * - 空间复杂度低 O(1)
 * - 稳定排序算法
 * - 可以检测数组是否已经有序
 * 
 * 劣势:
 * - 时间复杂度高 O(n²)
 * - 性能差，不适合大数据集
 * - 交换次数多
 * 
 * 使用场景:
 * - 教学演示
 * - 小数据集（< 50个元素）
 * - 对稳定性有要求且数据量很小的场景
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
 * 
 * 算法思想:
 * 将数组分为已排序和未排序两部分，每次从未排序部分选择最小元素，
 * 与未排序部分的第一个元素交换位置，逐步构建有序序列。
 * 
 * 实现思路:
 * 1. 外层循环遍历数组，每次确定一个位置的最小值
 * 2. 内层循环在未排序部分找到最小元素的索引
 * 3. 将找到的最小元素与当前位置的元素交换
 * 4. 重复直到所有元素都排好序
 * 
 * 优势:
 * - 实现简单
 * - 空间复杂度低 O(1)
 * - 交换次数少（最多 n-1 次）
 * - 不依赖输入数据的初始状态
 * 
 * 劣势:
 * - 时间复杂度高 O(n²)
 * - 不稳定排序
 * - 比较次数固定，无法利用已排序的数据
 * 
 * 使用场景:
 * - 内存受限的环境
 * - 交换成本很高的场景（如交换大对象）
 * - 小数据集且对稳定性无要求
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
 * 
 * 算法思想:
 * 将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的正确位置。
 * 类似于整理扑克牌，每次取一张牌插入到手中已排序牌的正确位置。
 * 
 * 实现思路:
 * 1. 从第二个元素开始，将其作为待插入元素
 * 2. 在已排序部分从右向左查找插入位置
 * 3. 将大于待插入元素的元素向右移动一位
 * 4. 将待插入元素插入到正确位置
 * 5. 重复直到所有元素都插入到正确位置
 * 
 * 优势:
 * - 实现简单
 * - 空间复杂度低 O(1)
 * - 稳定排序
 * - 对部分有序的数据效率很高 O(n)
 * - 在线算法（可以边接收数据边排序）
 * 
 * 劣势:
 * - 平均时间复杂度 O(n²)
 * - 需要大量移动操作
 * 
 * 使用场景:
 * - 小数据集（< 50个元素）
 * - 数据基本有序的情况
 * - 混合排序算法的一部分（如 Timsort）
 * - 实时数据处理
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
 * 
 * 算法思想:
 * 采用分治法，选择一个基准元素，将数组分为小于基准和大于基准的两部分，
 * 然后递归地对两部分进行排序。基准元素的选择和分割策略是关键。
 * 
 * 实现思路:
 * 1. 选择基准元素（通常选择最后一个元素）
 * 2. 分割数组：将小于基准的元素放在左边，大于基准的元素放在右边
 * 3. 基准元素放在正确位置（分割点）
 * 4. 递归地对左右两部分进行快速排序
 * 5. 合并结果（原地排序，无需合并步骤）
 * 
 * 优势:
 * - 平均时间复杂度优秀 O(n log n)
 * - 原地排序，空间复杂度 O(log n)
 * - 实际应用中性能很好
 * - 缓存友好
 * 
 * 劣势:
 * - 最坏情况 O(n²)
 * - 不稳定排序
 * - 实现相对复杂
 * - 对已排序数据性能差
 * 
 * 使用场景:
 * - 通用排序算法
 * - 大数据集排序
 * - 对稳定性无要求的场景
 * - 系统库中的默认排序算法
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
 * 
 * 算法思想:
 * 采用分治法，将数组递归地分成两半，分别排序后再合并。
 * 分治过程：分解 -> 解决 -> 合并，确保每次合并后都是有序的。
 * 
 * 实现思路:
 * 1. 分解：将数组递归地分成两半，直到每个子数组只有一个元素
 * 2. 解决：对每个子数组进行排序（单元素数组天然有序）
 * 3. 合并：将两个有序子数组合并成一个有序数组
 * 4. 合并策略：比较两个子数组的首元素，取较小者放入结果数组
 * 5. 重复合并过程直到所有子数组都合并完成
 * 
 * 优势:
 * - 时间复杂度稳定 O(n log n)
 * - 稳定排序
 * - 性能可预测
 * - 适合并行化
 * 
 * 劣势:
 * - 空间复杂度高 O(n)
 * - 需要额外内存空间
 * - 实现相对复杂
 * 
 * 使用场景:
 * - 需要稳定排序的场景
 * - 外部排序
 * - 并行计算环境
 * - 对性能稳定性要求高的场景
 */
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) {
    return [...arr];
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid, arr.length));

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
 * 
 * 算法思想:
 * 从数组的第一个元素开始，逐个检查每个元素，直到找到目标值或遍历完整个数组。
 * 这是最直观的查找方法，适用于任何数据结构。
 * 
 * 实现思路:
 * 1. 从数组的第一个元素开始遍历
 * 2. 逐个比较当前元素与目标值
 * 3. 如果找到匹配的元素，返回其索引
 * 4. 如果遍历完整个数组都没找到，返回 -1
 * 5. 可以使用 for 循环或 while 循环实现
 * 
 * 优势:
 * - 实现简单
 * - 适用于任何数据结构
 * - 不需要数据有序
 * - 空间复杂度 O(1)
 * 
 * 劣势:
 * - 时间复杂度 O(n)
 * - 效率低
 * 
 * 使用场景:
 * - 小数据集
 * - 无序数据
 * - 链表等线性结构
 * - 数据很少且查找不频繁
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
 * 
 * 算法思想:
 * 在有序数组中，通过比较中间元素与目标值来缩小搜索范围。
 * 每次比较后，可以排除一半的搜索空间，大大提高了查找效率。
 * 
 * 实现思路:
 * 1. 计算中间位置 mid = (low + high) / 2
 * 2. 比较中间元素与目标值
 * 3. 如果相等，返回中间位置
 * 4. 如果目标值小于中间元素，在左半部分递归查找
 * 5. 如果目标值大于中间元素，在右半部分递归查找
 * 6. 如果搜索范围无效（low > high），返回 -1
 * 
 * 优势:
 * - 时间复杂度优秀 O(log n)
 * - 实现相对简单
 * - 经典算法，应用广泛
 * 
 * 劣势:
 * - 要求数据有序
 * - 只适用于随机访问的数据结构
 * - 递归版本空间复杂度较高
 * 
 * 使用场景:
 * - 有序数组查找
 * - 数据库索引
 * - 游戏中的数值查找
 * - 算法竞赛
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
 * 
 * 算法思想:
 * 与递归版本相同，通过比较中间元素与目标值来缩小搜索范围。
 * 使用循环代替递归，避免了函数调用的开销和栈空间的使用。
 * 
 * 实现思路:
 * 1. 初始化搜索范围 low = 0, high = n-1
 * 2. 循环直到 low > high
 * 3. 计算中间位置 mid = (low + high) / 2
 * 4. 比较中间元素与目标值
 * 5. 如果相等，返回中间位置
 * 6. 如果目标值小于中间元素，更新 high = mid - 1
 * 7. 如果目标值大于中间元素，更新 low = mid + 1
 * 8. 循环结束后返回 -1（未找到）
 * 
 * 优势:
 * - 时间复杂度优秀 O(log n)
 * - 空间复杂度低 O(1)
 * - 实现相对简单
 * - 经典算法，应用广泛
 * 
 * 劣势:
 * - 要求数据有序
 * - 只适用于随机访问的数据结构
 * 
 * 使用场景:
 * - 有序数组查找
 * - 数据库索引
 * - 游戏中的数值查找
 * - 算法竞赛
 * - 内存受限环境（相比递归版本）
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
 * 
 * 算法思想:
 * 基于二分查找的改进，不是简单地选择中间位置，而是根据目标值在数组中的位置进行插值计算，
 * 预测目标值可能的位置，适用于均匀分布的数据。
 * 
 * 实现思路:
 * 1. 使用插值公式计算预测位置：pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
 * 2. 检查边界条件：确保 pos 在有效范围内
 * 3. 比较预测位置的元素与目标值
 * 4. 如果相等，返回位置
 * 5. 如果目标值小于预测元素，在左半部分继续查找
 * 6. 如果目标值大于预测元素，在右半部分继续查找
 * 7. 重复直到找到或搜索范围无效
 * 
 * 优势:
 * - 平均时间复杂度 O(log log n)
 * - 对均匀分布数据效率很高
 * - 空间复杂度 O(1)
 * 
 * 劣势:
 * - 要求数据有序且均匀分布
 * - 最坏情况 O(n)
 * - 实现复杂
 * 
 * 使用场景:
 * - 均匀分布的有序数据
 * - 电话号码查找
 * - 字典查找
 * - 数值范围查询
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
 * 
 * 算法思想:
 * 结合线性查找和二分查找的优点，先通过指数增长的方式找到可能包含目标值的范围，
 * 然后在该范围内进行二分查找。特别适用于未知大小的数组。
 * 
 * 实现思路:
 * 1. 如果第一个元素就是目标值，直接返回
 * 2. 指数增长阶段：从位置1开始，每次将索引乘以2，直到找到大于目标值的元素
 * 3. 确定搜索范围：前一个位置到当前位置之间
 * 4. 在确定的范围内进行二分查找
 * 5. 返回二分查找的结果（需要加上起始偏移量）
 * 
 * 优势:
 * - 时间复杂度 O(log n)
 * - 适用于未知大小的数组
 * - 结合了线性查找和二分查找的优点
 * 
 * 劣势:
 * - 要求数据有序
 * - 实现相对复杂
 * 
 * 使用场景:
 * - 无限或未知大小的有序数组
 * - 流式数据处理
 * - 动态数组查找
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
 * 
 * 算法思想:
 * 通过固定步长跳跃搜索，找到可能包含目标值的块，然后在该块内进行线性搜索。
 * 步长通常选择 √n，这样可以在跳跃和线性搜索之间取得平衡。
 * 
 * 实现思路:
 * 1. 计算最优步长：step = √n
 * 2. 跳跃阶段：从位置0开始，每次跳跃step个位置，直到找到大于目标值的元素
 * 3. 确定搜索块：前一个跳跃位置到当前位置之间
 * 4. 线性搜索阶段：在确定的块内进行线性搜索
 * 5. 如果找到目标值，返回位置；否则返回 -1
 * 
 * 优势:
 * - 时间复杂度 O(√n)
 * - 空间复杂度 O(1)
 * - 比线性查找快
 * - 实现简单
 * 
 * 劣势:
 * - 要求数据有序
 * - 不如二分查找快
 * - 需要计算最优步长
 * 
 * 使用场景:
 * - 有序数组查找
 * - 内存受限环境
 * - 链表等不支持随机访问的结构
 * - 中等大小的数据集
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
 * 
 * 算法思想:
 * 将搜索区间分成三部分，通过比较两个分界点的值来确定目标值所在的区间。
 * 适用于具有单峰性质（先增后减或先减后增）的函数或数组。
 * 
 * 实现思路:
 * 1. 计算两个分界点：mid1 = low + (high-low)/3, mid2 = high - (high-low)/3
 * 2. 比较两个分界点的值与目标值
 * 3. 如果目标值等于任一分界点，返回对应位置
 * 4. 如果目标值小于 mid1，在左半部分递归查找
 * 5. 如果目标值大于 mid2，在右半部分递归查找
 * 6. 否则在中间部分递归查找
 * 7. 重复直到找到或搜索范围无效
 * 
 * 优势:
 * - 时间复杂度 O(log₃ n)
 * - 适用于单峰函数
 * - 空间复杂度 O(log n)
 * 
 * 劣势:
 * - 只适用于特定类型的问题
 * - 实现复杂
 * - 应用场景有限
 * 
 * 使用场景:
 * - 单峰函数优化
 * - 数学计算
 * - 算法竞赛中的特定问题
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
 * 
 * 算法思想:
 * 使用斐波那契数列来分割搜索区间，而不是简单的二分。
 * 通过斐波那契数列的特性，在某些情况下可以比二分查找更高效。
 * 
 * 实现思路:
 * 1. 生成斐波那契数列，找到大于等于数组长度的最小斐波那契数
 * 2. 使用斐波那契数列来分割搜索区间
 * 3. 比较分割点元素与目标值
 * 4. 根据比较结果调整搜索范围
 * 5. 更新斐波那契数列的索引
 * 6. 重复直到找到目标值或搜索范围无效
 * 
 * 优势:
 * - 时间复杂度 O(log n)
 * - 在某些情况下比二分查找更高效
 * - 使用斐波那契数列分割
 * 
 * 劣势:
 * - 要求数据有序
 * - 实现复杂
 * - 优势不明显
 * 
 * 使用场景:
 * - 理论研究和教学
 * - 特定优化场景
 * - 算法竞赛
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
