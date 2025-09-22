/**
 * 路径查找算法测试文件
 * 测试 Dijkstra、A*、JPS、BFS、DFS、GBFS 和双向搜索算法
 */

import { findPathDijkstra, dijkstraAll } from './dijkstra';
import { findPathHeap } from './astar_heap';
import { findPathJPS } from './astar_jps';
import { findPathBFS, bfsAll } from './bfs';
import { findPathDFS, findPathDFSRecursive, dfsAll } from './dfs';
import { findPathGBFS, gbfsAll } from './gbfs';
import { findPathBidirectional, bidirectionalAll } from './bidirectional-search';

type Point = { x: number; y: number };
type Grid = number[][];

// 测试用的网格地图
const testGrids = {
  // 简单网格
  simple: [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ] as Grid,

  // 复杂网格
  complex: [
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ] as Grid,

  // 迷宫网格
  maze: [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ] as Grid,
};

// 测试用例
const testCases = [
  {
    name: '简单路径',
    grid: testGrids.simple,
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 4 },
    allowDiagonal: false,
  },
  {
    name: '对角线路径',
    grid: testGrids.simple,
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 4 },
    allowDiagonal: true,
  },
  {
    name: '复杂路径',
    grid: testGrids.complex,
    start: { x: 0, y: 0 },
    goal: { x: 7, y: 6 },
    allowDiagonal: false,
  },
  {
    name: '迷宫路径',
    grid: testGrids.maze,
    start: { x: 0, y: 0 },
    goal: { x: 9, y: 6 },
    allowDiagonal: false,
  },
];

// 算法列表
const algorithms = [
  { name: 'Dijkstra', fn: findPathDijkstra },
  { name: 'A*', fn: findPathHeap },
  { name: 'JPS', fn: findPathJPS },
  { name: 'BFS', fn: findPathBFS },
  { name: 'DFS', fn: findPathDFS },
  { name: 'DFS-Recursive', fn: findPathDFSRecursive },
  { name: 'GBFS', fn: findPathGBFS },
  { name: 'Bidirectional', fn: findPathBidirectional },
];

// 计算路径长度
function calculatePathLength(path: Point[], allowDiagonal: boolean = false): number {
  if (path.length <= 1) return 0;
  
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const dx = Math.abs(curr.x - prev.x);
    const dy = Math.abs(curr.y - prev.y);
    
    if (allowDiagonal && dx === 1 && dy === 1) {
      length += Math.SQRT2;
    } else {
      length += dx + dy;
    }
  }
  
  return length;
}

// 测试单个算法
function testAlgorithm(
  algorithm: { name: string; fn: Function },
  testCase: typeof testCases[0]
): { success: boolean; pathLength: number; executionTime: number; path: Point[] | null } {
  const startTime = Date.now();
  
  try {
    const path = algorithm.fn(testCase.grid, testCase.start, testCase.goal, {
      allowDiagonal: testCase.allowDiagonal,
    });
    
    const executionTime = Date.now() - startTime;
    const pathLength = path ? calculatePathLength(path, testCase.allowDiagonal) : 0;
    
    return {
      success: path !== null,
      pathLength,
      executionTime,
      path,
    };
  } catch (error) {
    console.error(`算法 ${algorithm.name} 执行出错:`, error);
    return {
      success: false,
      pathLength: 0,
      executionTime: Date.now() - startTime,
      path: null,
    };
  }
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始路径查找算法测试\n');
  
  for (const testCase of testCases) {
    console.log(`📋 测试用例: ${testCase.name}`);
    console.log(`   起点: (${testCase.start.x}, ${testCase.start.y})`);
    console.log(`   终点: (${testCase.goal.x}, ${testCase.goal.y})`);
    console.log(`   对角线: ${testCase.allowDiagonal ? '允许' : '禁止'}`);
    console.log('   ' + '='.repeat(50));
    
    const results: Array<{
      algorithm: string;
      success: boolean;
      pathLength: number;
      executionTime: number;
    }> = [];
    
    for (const algorithm of algorithms) {
      const result = testAlgorithm(algorithm, testCase);
      results.push({
        algorithm: algorithm.name,
        success: result.success,
        pathLength: result.pathLength,
        executionTime: result.executionTime,
      });
      
      const status = result.success ? '✅' : '❌';
      const pathInfo = result.success 
        ? `路径长度: ${result.pathLength.toFixed(2)}, 步数: ${result.path?.length || 0}`
        : '未找到路径';
      
      console.log(`   ${status} ${algorithm.name.padEnd(15)} | ${pathInfo.padEnd(25)} | 时间: ${result.executionTime}ms`);
    }
    
    // 找出最优结果
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length > 0) {
      const shortestPath = successfulResults.reduce((min, curr) => 
        curr.pathLength < min.pathLength ? curr : min
      );
      const fastestTime = successfulResults.reduce((min, curr) => 
        curr.executionTime < min.executionTime ? curr : min
      );
      
      console.log(`\n   🏆 最短路径: ${shortestPath.algorithm} (${shortestPath.pathLength.toFixed(2)})`);
      console.log(`   ⚡ 最快执行: ${fastestTime.algorithm} (${fastestTime.executionTime}ms)`);
    }
    
    console.log('\n');
  }
}

// 测试全图搜索功能
function testAllGraphSearch() {
  console.log('🔍 测试全图搜索功能\n');
  
  const testGrid = testGrids.complex;
  const start = { x: 0, y: 0 };
  
  console.log('📊 Dijkstra 全图搜索:');
  const dijkstraResult = dijkstraAll(testGrid, start, { allowDiagonal: false });
  console.log(`   可达点数量: ${dijkstraResult.dist.flat().filter(d => d !== Number.POSITIVE_INFINITY).length}`);
  
  console.log('\n📊 BFS 全图搜索:');
  const bfsResult = bfsAll(testGrid, start, { allowDiagonal: false });
  console.log(`   可达点数量: ${bfsResult.dist.flat().filter(d => d !== -1).length}`);
  
  console.log('\n📊 DFS 全图搜索:');
  const dfsResult = dfsAll(testGrid, start, { allowDiagonal: false });
  console.log(`   可达点数量: ${dfsResult.length}`);
  
  console.log('\n📊 GBFS 全图搜索:');
  const gbfsResult = gbfsAll(testGrid, start, { x: 7, y: 6 }, { allowDiagonal: false });
  console.log(`   可达点数量: ${gbfsResult.length}`);
  
  console.log('\n📊 双向搜索全图:');
  const bidirectionalResult = bidirectionalAll(testGrid, start, { x: 7, y: 6 }, { allowDiagonal: false });
  console.log(`   可达点数量: ${bidirectionalResult.dist.flat().filter(d => d !== -1).length}`);
}

// 性能基准测试
function performanceBenchmark() {
  console.log('⚡ 性能基准测试\n');
  
  // 创建大型网格
  const largeGrid: Grid = Array.from({ length: 50 }, () => 
    Array.from({ length: 50 }, () => Math.random() < 0.3 ? 1 : 0)
  );
  
  const start = { x: 0, y: 0 };
  const goal = { x: 49, y: 49 };
  
  console.log('📏 大型网格 (50x50) 性能测试:');
  console.log('   ' + '='.repeat(60));
  
  const performanceResults: Array<{
    algorithm: string;
    executionTime: number;
    success: boolean;
  }> = [];
  
  for (const algorithm of algorithms) {
    const startTime = Date.now();
    const path = algorithm.fn(largeGrid, start, goal, { allowDiagonal: true });
    const executionTime = Date.now() - startTime;
    
    performanceResults.push({
      algorithm: algorithm.name,
      executionTime,
      success: path !== null,
    });
    
    const status = path !== null ? '✅' : '❌';
    console.log(`   ${status} ${algorithm.name.padEnd(15)} | 时间: ${executionTime}ms`);
  }
  
  const successfulResults = performanceResults.filter(r => r.success);
  if (successfulResults.length > 0) {
    const fastest = successfulResults.reduce((min, curr) => 
      curr.executionTime < min.executionTime ? curr : min
    );
    console.log(`\n   🏆 最快算法: ${fastest.algorithm} (${fastest.executionTime}ms)`);
  }
}

// 主函数
function main() {
  try {
    runAllTests();
    testAllGraphSearch();
    performanceBenchmark();
    
    console.log('🎉 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  main();
}

export {
  runAllTests,
  testAllGraphSearch,
  performanceBenchmark,
  testAlgorithm,
  calculatePathLength,
};
