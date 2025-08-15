import { 
    kadaneBasic, 
    kadaneWithIndices, 
    kadaneDetailed, 
    generateTestCases 
} from './kadane-algorithm';

/**
 * 测试Kadane算法的各种实现
 */
function testKadaneAlgorithm() {
    console.log('🚀 开始测试Kadane算法\n');

    const testCases = generateTestCases();

    // 测试基础版本
    console.log('📊 基础版本测试结果:');
    console.log('='.repeat(50));
    
    testCases.forEach((testCase, index) => {
        console.log(`\n${index + 1}. ${testCase.name}: [${testCase.data.join(', ')}]`);
        try {
            const result = kadaneBasic(testCase.data);
            console.log(`   最大子数组和: ${result}`);
        } catch (error) {
            console.log(`   错误: ${error}`);
        }
    });

    // 测试进阶版本（带索引）
    console.log('\n\n🎯 进阶版本测试结果（包含子数组位置）:');
    console.log('='.repeat(50));
    
    testCases.forEach((testCase, index) => {
        console.log(`\n${index + 1}. ${testCase.name}: [${testCase.data.join(', ')}]`);
        try {
            const result = kadaneWithIndices(testCase.data);
            console.log(`   最大子数组和: ${result.maxSum}`);
            console.log(`   子数组位置: [${result.startIndex}, ${result.endIndex}]`);
            console.log(`   子数组内容: [${result.subArray.join(', ')}]`);
        } catch (error) {
            console.log(`   错误: ${error}`);
        }
    });

    // 详细演示一个例子
    console.log('\n\n🔍 详细执行过程演示:');
    console.log('='.repeat(50));
    
    const demoArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    console.log('使用经典例子来演示算法的每一步执行过程:');
    kadaneDetailed(demoArray);

    // 性能测试
    console.log('\n\n⚡ 性能测试:');
    console.log('='.repeat(50));
    
    const largeArray = Array.from({length: 100000}, () => Math.floor(Math.random() * 201) - 100);
    
    console.log(`测试大数组性能 (长度: ${largeArray.length})`);
    
    const startTime = performance.now();
    const result = kadaneBasic(largeArray);
    const endTime = performance.now();
    
    console.log(`最大子数组和: ${result}`);
    console.log(`执行时间: ${(endTime - startTime).toFixed(2)} 毫秒`);
    console.log(`时间复杂度: O(n) - 线性时间`);
}

/**
 * 比较不同算法的性能
 */
function compareAlgorithms() {
    console.log('\n\n🏁 算法复杂度对比:');
    console.log('='.repeat(50));
    
    const testArray = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    
    console.log('1. 暴力解法 O(n²):');
    console.log('   检查所有可能的子数组组合');
    console.log('   适用于小数组，但大数组会很慢');
    
    console.log('\n2. Kadane算法 O(n):');
    console.log('   只需要遍历数组一次');
    console.log('   空间复杂度 O(1)');
    console.log('   是解决最大子数组问题的最优算法');
    
    // 实现暴力解法用于对比
    function bruteForce(nums: number[]): number {
        let maxSum = nums[0];
        
        for (let i = 0; i < nums.length; i++) {
            let currentSum = 0;
            for (let j = i; j < nums.length; j++) {
                currentSum += nums[j];
                maxSum = Math.max(maxSum, currentSum);
            }
        }
        
        return maxSum;
    }
    
    console.log(`\n测试数组: [${testArray.join(', ')}]`);
    
    // 暴力解法
    const bruteStart = performance.now();
    const bruteResult = bruteForce(testArray);
    const bruteEnd = performance.now();
    
    // Kadane算法
    const kadaneStart = performance.now();
    const kadaneResult = kadaneBasic(testArray);
    const kadaneEnd = performance.now();
    
    console.log(`\n暴力解法结果: ${bruteResult}, 时间: ${(bruteEnd - bruteStart).toFixed(4)} ms`);
    console.log(`Kadane算法结果: ${kadaneResult}, 时间: ${(kadaneEnd - kadaneStart).toFixed(4)} ms`);
    console.log(`结果一致: ${bruteResult === kadaneResult ? '✅' : '❌'}`);
}

// 运行所有测试
function runAllTests() {
    testKadaneAlgorithm();
    compareAlgorithms();
    
    console.log('\n\n🎉 所有测试完成！');
    console.log('\n💡 总结:');
    console.log('- Kadane算法是解决最大子数组问题的最优解');
    console.log('- 时间复杂度: O(n)，空间复杂度: O(1)');
    console.log('- 核心思想: 动态规划 + 贪心选择');
    console.log('- 关键决策: 负数累积时果断重新开始');
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
    runAllTests();
}

export { testKadaneAlgorithm, compareAlgorithms, runAllTests };