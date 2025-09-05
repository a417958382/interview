import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  linearSearch,
  binarySearch,
  binarySearchRecursive,
  interpolationSearch,
  generateRandomArray,
  performanceTest
} from './algorithms.js';

/**
 * 测试所有排序和查找算法
 */
function testSortingAlgorithms() {
  console.log('=== 排序算法测试 ===');

  // 测试数据
  const testArrays = [
    [64, 34, 25, 12, 22, 11, 90],
    [1, 3, 5, 7, 9, 2, 4, 6, 8],
    [100, 20, 30, 40, 50, 10],
    generateRandomArray(10, 1, 100),
    generateRandomArray(15, 1, 50)
  ];

  const sortingAlgorithms = [
    { name: '冒泡排序', func: bubbleSort },
    { name: '选择排序', func: selectionSort },
    { name: '插入排序', func: insertionSort },
    { name: '快速排序', func: quickSort },
    { name: '归并排序', func: mergeSort }
  ];

  testArrays.forEach((arr, index) => {
    console.log(`\n测试数组 ${index + 1}: [${arr.join(', ')}]`);

    sortingAlgorithms.forEach(algorithm => {
      const test = performanceTest(algorithm.func, arr);
      console.log(`${algorithm.name}:`);
      console.log(`  结果: [${test.result.join(', ')}]`);
      console.log(`  时间: ${test.time.toFixed(4)}ms`);
      console.log(`  是否有序: ${test.sorted}`);
    });
  });
}

function testSearchAlgorithms() {
  console.log('\n=== 查找算法测试 ===');

  // 创建有序测试数组
  const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
  const testTargets = [1, 7, 15, 29, 30]; // 包含存在和不存在的元素

  console.log(`测试数组: [${sortedArray.join(', ')}]`);

  const searchAlgorithms = [
    { name: '线性查找', func: linearSearch },
    { name: '二分查找(迭代)', func: binarySearch },
    { name: '二分查找(递归)', func: binarySearchRecursive },
    { name: '插值查找', func: interpolationSearch }
  ];

  testTargets.forEach(target => {
    console.log(`\n查找目标: ${target}`);

    searchAlgorithms.forEach(algorithm => {
      const start = performance.now();
      const result = algorithm.func(sortedArray, target);
      const time = performance.now() - start;

      console.log(`${algorithm.name}:`);
      console.log(`  结果索引: ${result}`);
      console.log(`  找到元素: ${result !== -1 ? sortedArray[result] : '未找到'}`);
      console.log(`  时间: ${time.toFixed(4)}ms`);
    });
  });
}

function testPerformanceComparison() {
  console.log('\n=== 性能对比测试 ===');

  // 大数组性能测试
  const largeArray = generateRandomArray(10000, 1, 100000);
  const target = largeArray[Math.floor(Math.random() * largeArray.length)];

  console.log(`大数组测试 (大小: ${largeArray.length})`);
  console.log(`查找目标: ${target}`);

  // 排序性能测试
  const sortTests = [
    { name: '冒泡排序', func: bubbleSort },
    { name: '选择排序', func: selectionSort },
    { name: '插入排序', func: insertionSort },
    { name: '快速排序', func: quickSort },
    { name: '归并排序', func: mergeSort }
  ];

  console.log('\n排序算法性能:');
  sortTests.forEach(test => {
    const result = performanceTest(test.func, [...largeArray]);
    console.log(`${test.name}: ${result.time.toFixed(2)}ms`);
  });

  // 查找性能测试（先排序）
  const sortedLargeArray = quickSort([...largeArray]);

  const searchTests = [
    { name: '线性查找', func: linearSearch },
    { name: '二分查找', func: binarySearch },
    { name: '插值查找', func: interpolationSearch }
  ];

  console.log('\n查找算法性能:');
  searchTests.forEach(test => {
    const start = performance.now();
    const result = test.func(sortedLargeArray, target);
    const time = performance.now() - start;
    console.log(`${test.name}: ${time.toFixed(4)}ms (找到: ${result !== -1})`);
  });
}

function testEdgeCases() {
  console.log('\n=== 边界情况测试 ===');

  // 空数组
  console.log('空数组测试:');
  const emptyArray: number[] = [];
  console.log(`冒泡排序: [${bubbleSort(emptyArray).join(', ')}]`);
  console.log(`线性查找(目标5): ${linearSearch(emptyArray, 5)}`);

  // 单个元素
  console.log('\n单个元素测试:');
  const singleArray = [42];
  console.log(`快速排序: [${quickSort(singleArray).join(', ')}]`);
  console.log(`二分查找(目标42): ${binarySearch(singleArray, 42)}`);
  console.log(`二分查找(目标99): ${binarySearch(singleArray, 99)}`);

  // 已排序数组
  console.log('\n已排序数组测试:');
  const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  console.log(`原始数组: [${sortedArray.join(', ')}]`);
  console.log(`归并排序: [${mergeSort(sortedArray).join(', ')}]`);

  // 逆序数组
  console.log('\n逆序数组测试:');
  const reverseArray = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  console.log(`原始数组: [${reverseArray.join(', ')}]`);
  console.log(`插入排序: [${insertionSort(reverseArray).join(', ')}]`);

  // 重复元素
  console.log('\n重复元素测试:');
  const duplicateArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  console.log(`原始数组: [${duplicateArray.join(', ')}]`);
  console.log(`选择排序: [${selectionSort(duplicateArray).join(', ')}]`);
  console.log(`查找第一个5: ${linearSearch(duplicateArray, 5)}`);
}

// 主测试函数
function main() {
  console.log('🚀 排序和查找算法演示\n');

  try {
    testSortingAlgorithms();
    testSearchAlgorithms();
    testPerformanceComparison();
    testEdgeCases();

    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

// 运行测试
main();
