import {
  exponentialSearch,
  jumpSearch,
  ternarySearch,
  fibonacciSearch,
  binarySearch,
  linearSearch,
  interpolationSearch
} from './algorithms.js';

/**
 * 测试新增的高级查找算法
 */
function testAdvancedSearchAlgorithms() {
  console.log('🔬 高级查找算法测试\n');

  // 测试数组
  const testArray = Array.from({ length: 20 }, (_, i) => i + 1);
  console.log(`测试数组: [${testArray.join(', ')}]`);

  // 测试目标值
  const testTargets = [1, 10, 15, 20, 25]; // 包含边界情况

  const algorithms = [
    { name: '二分查找', func: binarySearch },
    { name: '线性查找', func: linearSearch },
    { name: '插值查找', func: interpolationSearch },
    { name: '指数查找', func: exponentialSearch },
    { name: '跳跃查找', func: jumpSearch },
    { name: '三分查找', func: ternarySearch },
    { name: '斐波那契查找', func: fibonacciSearch }
  ];

  console.log('\n📊 查找结果对比：');
  console.log('目标 | 二分查找 | 线性查找 | 插值查找 | 指数查找 | 跳跃查找 | 三分查找 | 斐波那契');
  console.log('------|-----------|-----------|-----------|-----------|-----------|-----------|----------');

  testTargets.forEach(target => {
    const results = algorithms.map(alg => alg.func(testArray, target));
    console.log(
      `${target.toString().padStart(4)} | ${results[0].toString().padStart(9)} | ${results[1].toString().padStart(9)} | ${results[2].toString().padStart(9)} | ${results[3].toString().padStart(9)} | ${results[4].toString().padStart(9)} | ${results[5].toString().padStart(9)} | ${results[6].toString().padStart(8)}`
    );
  });

  console.log('\n🔍 详细测试用例：');

  // 测试各种边界情况
  const edgeCases = [
    { name: '第一个元素', target: 1 },
    { name: '中间元素', target: 10 },
    { name: '最后一个元素', target: 20 },
    { name: '不存在的小元素', target: 0 },
    { name: '不存在的大元素', target: 25 },
    { name: '不存在的中间元素', target: 13 }
  ];

  edgeCases.forEach(testCase => {
    console.log(`\n🎯 测试: ${testCase.name} (目标: ${testCase.target})`);

    algorithms.forEach(algorithm => {
      const start = performance.now();
      const result = algorithm.func(testArray, testCase.target);
      const time = performance.now() - start;

      console.log(`${algorithm.name.padEnd(12)}: 索引=${result.toString().padStart(2)}, 时间=${time.toFixed(4)}ms`);
    });
  });

  console.log('\n📈 性能分析：');

  // 大数组性能测试
  const largeArray = Array.from({ length: 10000 }, (_, i) => i + 1);
  const testTarget = 5000; // 中间元素

  console.log(`大数组测试 (大小: ${largeArray.length}, 查找目标: ${testTarget})`);

  algorithms.forEach(algorithm => {
    const start = performance.now();
    const result = algorithm.func(largeArray, testTarget);
    const time = performance.now() - start;

    console.log(`${algorithm.name.padEnd(12)}: 结果=${result}, 时间=${time.toFixed(4)}ms`);
  });

  console.log('\n✅ 所有高级查找算法测试完成！');

  // 总结
  console.log('\n📚 算法特点总结：');
  console.log('• 二分查找: 最稳定，理论最优复杂度');
  console.log('• 线性查找: 最简单，但效率最低');
  console.log('• 插值查找: 数据均匀分布时效率最高');
  console.log('• 指数查找: 适用于未知大小的有序序列');
  console.log('• 跳跃查找: 在某些场景下比二分查找更快');
  console.log('• 三分查找: 适用于单峰函数的搜索');
  console.log('• 斐波那契查找: 使用黄金比例分割，理论上比二分查找更高效');
}

// 运行测试
testAdvancedSearchAlgorithms();
