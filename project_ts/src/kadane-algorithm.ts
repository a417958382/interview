/**
 * Kadane算法 - 最大子数组和问题
 * 
 * 核心思想：动态规划
 * - 遍历数组时，对于每个位置决定是"继续之前的子数组"还是"从当前位置重新开始"
 * - 如果之前的累积和是负数，就丢弃它，从当前元素重新开始
 */

/**
 * 基础版本：只返回最大和
 */

// 地牢网格:
// [
//   [1,  3,  1,  5],
//   [2,  2, -1,  3],
//   [5, -3,  3,  2],
//   [1,  4,  2,  1]
// ]

export function kadaneBasic(nums: number[]): number {
    if (nums.length === 0) {
        throw new Error('数组不能为空');
    }

    let maxSum = nums[0];      // 全局最大值
    let currentSum = nums[0];  // 当前子数组和

    console.log(`初始化: maxSum = ${maxSum}, currentSum = ${currentSum}`);

    for (let i = 1; i < nums.length; i++) {
        // 关键决策：继续还是重新开始？
        // 如果 currentSum < 0，说明之前的累积是负贡献，丢弃它
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        
        // 更新全局最大值
        maxSum = Math.max(maxSum, currentSum);

        console.log(`位置 ${i}: 元素 ${nums[i]}, currentSum = ${currentSum}, maxSum = ${maxSum}`);
    }

    return maxSum;
}

/**
 * 进阶版本：返回最大和以及对应的子数组位置
 */
export function kadaneWithIndices(nums: number[]): {
    maxSum: number;
    startIndex: number;
    endIndex: number;
    subArray: number[];
} {
    if (nums.length === 0) {
        throw new Error('数组不能为空');
    }

    let maxSum = nums[0];
    let currentSum = nums[0];
    let startIndex = 0;      // 最大子数组的起始位置
    let endIndex = 0;        // 最大子数组的结束位置
    let tempStart = 0;       // 临时起始位置

    for (let i = 1; i < nums.length; i++) {
        // 如果当前累积和 + 新元素 < 新元素本身
        // 说明应该从新元素重新开始
        if (currentSum + nums[i] < nums[i]) {
            currentSum = nums[i];
            tempStart = i;  // 更新临时起始位置
        } else {
            currentSum = currentSum + nums[i];
        }

        // 如果当前和超过了全局最大值，更新结果
        if (currentSum > maxSum) {
            maxSum = currentSum;
            startIndex = tempStart;
            endIndex = i;
        }
    }

    return {
        maxSum,
        startIndex,
        endIndex,
        subArray: nums.slice(startIndex, endIndex + 1)
    };
}

/**
 * 详细版本：显示每一步的计算过程
 */
export function kadaneDetailed(nums: number[]): number {
    if (nums.length === 0) {
        throw new Error('数组不能为空');
    }

    console.log('\n=== Kadane算法详细执行过程 ===');
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log('');

    let maxSum = nums[0];
    let currentSum = nums[0];

    console.log(`步骤 0: 元素 ${nums[0]}`);
    console.log(`  当前和 = ${currentSum}`);
    console.log(`  最大和 = ${maxSum}`);
    console.log('');

    for (let i = 1; i < nums.length; i++) {
        const prevSum = currentSum;
        const continueSum = currentSum + nums[i];
        const restartSum = nums[i];

        console.log(`步骤 ${i}: 元素 ${nums[i]}`);
        console.log(`  选择1: 继续之前的子数组 = ${prevSum} + ${nums[i]} = ${continueSum}`);
        console.log(`  选择2: 从当前元素重新开始 = ${restartSum}`);

        if (continueSum >= restartSum) {
            currentSum = continueSum;
            console.log(`  决策: 继续之前的子数组 (${continueSum} >= ${restartSum})`);
        } else {
            currentSum = restartSum;
            console.log(`  决策: 重新开始 (${restartSum} > ${continueSum})`);
        }

        const prevMaxSum = maxSum;
        maxSum = Math.max(maxSum, currentSum);

        console.log(`  当前和 = ${currentSum}`);
        console.log(`  最大和 = ${maxSum} ${maxSum > prevMaxSum ? '(更新!)' : ''}`);
        console.log('');
    }

    console.log(`=== 最终结果: ${maxSum} ===`);
    return maxSum;
}

/**
 * 工具函数：生成测试数据
 */
export function generateTestCases(): Array<{name: string, data: number[]}> {
    return [
        {
            name: '经典例子',
            data: [-2, 1, -3, 4, -1, 2, 1, -5, 4]
        },
        {
            name: '全正数',
            data: [1, 2, 3, 4, 5]
        },
        {
            name: '全负数',
            data: [-5, -2, -8, -1, -4]
        },
        {
            name: '单个元素',
            data: [42]
        },
        {
            name: '混合数组',
            data: [5, -3, 2, -1, 4, -2, 1]
        },
        {
            name: '零和负数',
            data: [0, -1, 0, -2, 0]
        }
    ];
}