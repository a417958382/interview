/**
 * 游戏地图DFS测试用例
 * 模拟真实游戏场景的面试题
 */

import { GameMap, CellType } from './game-map-dfs';

// 创建测试地图
function createTestMap(): number[][] {
    return [
        [0, 0, 1, 0, 2],  // . . # . $
        [0, 1, 1, 0, 0],  // . # # . .
        [0, 0, 0, 0, 1],  // . . . . #
        [1, 0, 3, 0, 0],  // # . E . .
        [0, 0, 1, 0, 2]   // . . # . $
    ];
}

export function runGameMapDFSTests(): void {
    console.log('🎮 游戏地图DFS测试开始');
    console.log('地图图例：');
    console.log('  . = 空地 (可通行)');
    console.log('  # = 墙壁 (不可通行)');
    console.log('  $ = 宝藏');
    console.log('  E = 敌人');
    console.log('  ✓ = 已访问');
    console.log('  [P] = 玩家当前位置');

    const gameMap = new GameMap(createTestMap());

    // 测试1：区域探索
    console.log('\n' + '='.repeat(60));
    console.log('测试1：DFS区域探索 - 从左上角开始探索整个连通区域');
    console.log('='.repeat(60));
    
    const exploreResult = gameMap.exploreAreaDFS(0, 0);
    console.log('\n📊 探索结果统计：');
    console.log(`- 访问的格子数量: ${exploreResult.visitedCells.length}`);
    console.log(`- 发现的宝藏数量: ${exploreResult.treasuresFound.length}`);
    console.log(`- 遭遇的敌人数量: ${exploreResult.enemiesEncountered.length}`);
    
    if (exploreResult.treasuresFound.length > 0) {
        console.log('💰 宝藏位置:');
        exploreResult.treasuresFound.forEach((treasure, index) => {
            console.log(`  宝藏${index + 1}: (${treasure.x}, ${treasure.y})`);
        });
    }
    
    if (exploreResult.enemiesEncountered.length > 0) {
        console.log('⚔️ 敌人位置:');
        exploreResult.enemiesEncountered.forEach((enemy, index) => {
            console.log(`  敌人${index + 1}: (${enemy.x}, ${enemy.y})`);
        });
    }

    // // 测试2：路径查找
    // console.log('\n' + '='.repeat(60));
    // console.log('测试2：DFS寻路 - 从起点寻找到宝藏的路径');
    // console.log('='.repeat(60));
    
    // const path = gameMap.findPathDFS(0, 0, 0, 4); // 寻找到右上角宝藏的路径
    // if (path) {
    //     console.log('\n🎉 成功找到路径！');
    //     console.log('📍 完整路径:');
    //     path.forEach((point, index) => {
    //         console.log(`  步骤${index + 1}: (${point.x}, ${point.y})`);
    //     });
    //     console.log(`🚶 总步数: ${path.length}`);
    // } else {
    //     console.log('\n❌ 未找到可行路径');
    // }

    // // 测试3：连通分量分析
    // console.log('\n' + '='.repeat(60));
    // console.log('测试3：DFS连通分量分析 - 分析地图中的所有连通区域');
    // console.log('='.repeat(60));
    
    // const components = gameMap.findConnectedComponents();
    // console.log(`\n🗺️ 地图连通性分析结果:`);
    // console.log(`- 连通区域数量: ${components.length}`);
    
    // components.forEach((component, index) => {
    //     console.log(`\n🏝️ 连通区域 ${index + 1}:`);
    //     console.log(`  - 大小: ${component.length} 个格子`);
    //     console.log(`  - 包含位置: ${component.map(p => `(${p.x},${p.y})`).join(', ')}`);
    // });

    // // 测试4：迭代DFS对比
    // console.log('\n' + '='.repeat(60));
    // console.log('测试4：迭代DFS vs 递归DFS - 性能和结果对比');
    // console.log('='.repeat(60));
    
    // console.log('\n🔄 使用迭代DFS探索:');
    // const iterativeResult = gameMap.exploreAreaIterativeDFS(0, 0);
    // console.log(`迭代DFS访问格子数: ${iterativeResult.length}`);
    
    // console.log('\n🔁 使用递归DFS探索:');
    // const recursiveResult = gameMap.exploreAreaDFS(0, 0);
    // console.log(`递归DFS访问格子数: ${recursiveResult.visitedCells.length}`);
    
    // console.log('\n📈 对比结果:');
    // console.log(`- 两种方法访问的格子数量${iterativeResult.length === recursiveResult.visitedCells.length ? '相同' : '不同'}`);
    // console.log('- 迭代DFS优势: 避免栈溢出，内存使用更可控');
    // console.log('- 递归DFS优势: 代码更简洁，逻辑更清晰');

    // // 测试5：实际游戏场景模拟
    // console.log('\n' + '='.repeat(60));
    // console.log('测试5：实际游戏场景 - 玩家探索任务');
    // console.log('='.repeat(60));
    
    // console.log('\n🎯 任务: 玩家需要收集所有宝藏并避开敌人');
    
    // // 创建更复杂的地图
    // const complexMap = [
    //     [0, 2, 1, 0, 0, 2],  // . $ # . . $
    //     [0, 0, 1, 0, 3, 0],  // . . # . E .
    //     [0, 1, 1, 0, 0, 0],  // . # # . . .
    //     [0, 0, 0, 0, 1, 2],  // . . . . # $
    //     [3, 0, 0, 1, 1, 0],  // E . . # # .
    //     [0, 0, 0, 0, 0, 2]   // . . . . . $
    // ];
    
    // const complexGameMap = new GameMap(complexMap);
    // console.log('\n🗺️ 复杂地图探索:');
    // const complexResult = complexGameMap.exploreAreaDFS(0, 0);
    
    // console.log('\n🎮 任务完成报告:');
    // console.log(`- 探索区域大小: ${complexResult.visitedCells.length} 格`);
    // console.log(`- 收集宝藏数量: ${complexResult.treasuresFound.length} 个`);
    // console.log(`- 遭遇敌人数量: ${complexResult.enemiesEncountered.length} 个`);
    
    // // 计算探索效率
    // const totalAccessibleCells = complexMap.flat().filter(cell => cell !== 1).length;
    // const explorationRate = (complexResult.visitedCells.length / totalAccessibleCells * 100).toFixed(1);
    // console.log(`- 探索完成度: ${explorationRate}%`);
    
    // if (complexResult.treasuresFound.length > 0) {
    //     console.log('\n💎 宝藏收集详情:');
    //     complexResult.treasuresFound.forEach((treasure, index) => {
    //         console.log(`  💰 宝藏${index + 1}: 位置(${treasure.x}, ${treasure.y})`);
    //     });
    // }
}

// 面试常见问题演示
function demonstrateInterviewQuestions(): void {
    console.log('\n' + '🎓'.repeat(20));
    console.log('面试常见问题演示');
    console.log('🎓'.repeat(20));
    
    console.log('\n❓ 面试官可能问的问题:');
    console.log('1. DFS的时间复杂度是多少？');
    console.log('   答: O(V + E)，其中V是顶点数，E是边数');
    console.log('   在网格图中是O(m*n)，m和n是网格的行数和列数');
    
    console.log('\n2. DFS和BFS的区别是什么？');
    console.log('   答: DFS使用栈(递归或显式)，深度优先；BFS使用队列，广度优先');
    console.log('   DFS空间复杂度O(h)，BFS空间复杂度O(w)，h是深度，w是宽度');
    
    console.log('\n3. 什么时候用DFS，什么时候用BFS？');
    console.log('   答: DFS适合路径存在性检测、拓扑排序、强连通分量');
    console.log('   BFS适合最短路径、层次遍历、最小步数问题');
    
    console.log('\n4. 如何避免DFS栈溢出？');
    console.log('   答: 使用迭代实现替代递归，或增加栈大小限制');
    
    console.log('\n5. 在游戏中DFS有哪些应用？');
    console.log('   答: 地图探索、连通性检测、AI寻路、技能树遍历、区域填充');
}

// 运行所有测试
console.log('🚀 开始游戏地图DFS完整测试');
runGameMapDFSTests();
demonstrateInterviewQuestions();
console.log('\n✅ 所有测试完成！');