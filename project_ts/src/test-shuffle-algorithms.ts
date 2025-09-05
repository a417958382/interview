import {
  fisherYatesShuffle,
  fisherYatesShuffleInPlace,
  knuthShuffle,
  naiveShuffle,
  sortShuffle,
  randomSwapShuffle,
  validateShuffleCorrectness,
  analyzePermutationDistribution,
  performanceTestShuffle,
  evaluateShuffleQuality,
  generateRandomArray,
  generateSortedArray,
  isShuffled,
  calculateArrayEntropy,
  demonstrateShuffle
} from './shuffle-algorithms.js';

/**
 * 测试所有洗牌算法
 */
function testShuffleAlgorithms() {
  console.log('🎰 洗牌算法测试\n');

  // 测试数据
  const testArrays = [
    [1, 2, 3, 4, 5],
    generateSortedArray(10),
    generateRandomArray(8, 1, 20),
    ['A', 'B', 'C', 'D', 'E', 'F']
  ];

  const shuffleAlgorithms = [
    { name: 'Fisher-Yates 洗牌', func: fisherYatesShuffle },
    { name: 'Fisher-Yates 就地洗牌', func: fisherYatesShuffleInPlace },
    { name: 'Knuth 洗牌', func: knuthShuffle },
    { name: '朴素洗牌', func: naiveShuffle },
    { name: '排序洗牌', func: sortShuffle },
    { name: '随机交换洗牌', func: (arr: any[]) => randomSwapShuffle(arr) }
  ];

  // 基本功能测试
  console.log('=== 基本功能测试 ===\n');

  testArrays.forEach((arr, index) => {
    console.log(`测试数组 ${index + 1}: [${arr.join(', ')}]`);

    shuffleAlgorithms.forEach(algorithm => {
      try {
        const demo = demonstrateShuffle(arr, algorithm.func);
        console.log(`${algorithm.name}:`);
        console.log(`  结果: [${demo.shuffled.join(', ')}]`);
        console.log(`  是否洗牌: ${demo.isDifferent}`);
        console.log(`  熵值: ${demo.entropy.toFixed(4)}`);
      } catch (error) {
        console.log(`${algorithm.name}: ❌ 错误 - ${error}`);
      }
    });

    console.log('');
  });

  // 正确性验证测试
  console.log('=== 正确性验证测试 ===\n');

  const testArray = generateSortedArray(6); // 小数组便于验证
  console.log(`验证数组: [${testArray.join(', ')}]`);

  shuffleAlgorithms.forEach(algorithm => {
    try {
      const validation = validateShuffleCorrectness(algorithm.func, testArray, 1000);
      console.log(`${algorithm.name}:`);
      console.log(`  是否均匀分布: ${validation.isUniform ? '✅' : '❌'}`);

      // 显示前3个位置的分布
      console.log('  位置分布示例:');
      for (let pos = 0; pos < Math.min(3, testArray.length); pos++) {
        const posMap = validation.positionDistributions.get(pos)!;
        const distribution = Array.from(posMap.entries())
          .map(([elem, count]) => `${elem}:${count}`)
          .join(', ');
        console.log(`    位置 ${pos}: {${distribution}}`);
      }
    } catch (error) {
      console.log(`${algorithm.name}: ❌ 验证失败 - ${error}`);
    }
    console.log('');
  });

  // 性能测试
  console.log('=== 性能测试 ===\n');

  const largeArray = generateSortedArray(1000);
  console.log(`大数组测试 (大小: ${largeArray.length})`);

  shuffleAlgorithms.forEach(algorithm => {
    try {
      const performance = performanceTestShuffle(algorithm.func, largeArray, 100);
      console.log(`${algorithm.name}:`);
      console.log(`  平均时间: ${performance.averageTime.toFixed(4)}ms`);
      console.log(`  最快时间: ${performance.minTime.toFixed(4)}ms`);
      console.log(`  最慢时间: ${performance.maxTime.toFixed(4)}ms`);
    } catch (error) {
      console.log(`${algorithm.name}: ❌ 性能测试失败 - ${error}`);
    }
  });

  console.log('');

  // 质量评估
  console.log('=== 算法质量评估 ===\n');

  const evalArray = generateSortedArray(8);
  console.log(`评估数组: [${evalArray.join(', ')}]`);

  shuffleAlgorithms.forEach(algorithm => {
    try {
      const evaluation = evaluateShuffleQuality(algorithm.func, evalArray, 1000);
      console.log(`${algorithm.name}:`);
      console.log(`  正确性: ${evaluation.correctness ? '✅' : '❌'}`);
      console.log(`  均匀性得分: ${(evaluation.uniformityScore * 100).toFixed(1)}%`);
      console.log(`  性能: ${evaluation.performance.averageTime.toFixed(4)}ms (平均)`);
    } catch (error) {
      console.log(`${algorithm.name}: ❌ 评估失败 - ${error}`);
    }
    console.log('');
  });

  // 排列分布分析
  console.log('=== 排列分布分析 ===\n');

  const smallArray = [1, 2, 3];
  console.log(`小数组分析: [${smallArray.join(', ')}]`);
  console.log(`理论排列数: ${6} (3! = 6)`);

  const fisherYatesDist = analyzePermutationDistribution(fisherYatesShuffle, smallArray, 6000);
  const naiveDist = analyzePermutationDistribution(naiveShuffle, smallArray, 6000);

  console.log('\nFisher-Yates 洗牌分布:');
  for (const [perm, count] of fisherYatesDist) {
    console.log(`  [${perm}]: ${count} 次 (${(count / 6000 * 100).toFixed(1)}%)`);
  }

  console.log('\n朴素洗牌分布:');
  for (const [perm, count] of naiveDist) {
    console.log(`  [${perm}]: ${count} 次 (${(count / 6000 * 100).toFixed(1)}%)`);
  }

  // 边界情况测试
  console.log('=== 边界情况测试 ===\n');

  const edgeCases = [
    { name: '空数组', array: [] },
    { name: '单元素数组', array: [42] },
    { name: '两元素数组', array: [1, 2] },
    { name: '重复元素数组', array: [1, 1, 2, 2, 3, 3] }
  ];

  edgeCases.forEach(testCase => {
    console.log(`${testCase.name}: [${testCase.array.join(', ')}]`);
    try {
      const result = fisherYatesShuffle(testCase.array);
      console.log(`  Fisher-Yates 结果: [${result.join(', ')}]`);
      console.log(`  是否洗牌: ${isShuffled(testCase.array, result)}`);
    } catch (error) {
      console.log(`  ❌ 错误: ${error}`);
    }
    console.log('');
  });

  console.log('✅ 洗牌算法测试完成！');
}

// 运行测试
testShuffleAlgorithms();
