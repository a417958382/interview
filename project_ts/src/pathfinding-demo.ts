/**
 * 路径查找算法演示文件
 * 展示不同算法在相同问题上的表现差异
 */

import { findPathDijkstra } from './dijkstra';
import { findPathHeap } from './astar_heap';
import { findPathJPS } from './astar_jps';
import { findPathBFS } from './bfs';
import { findPathDFS } from './dfs';
import { findPathGBFS } from './gbfs';
import { findPathBidirectional } from './bidirectional-search';

type Point = { x: number; y: number };
type Grid = number[][];

// 创建演示网格
function createDemoGrid(): Grid {
  return [
    [0, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
  ];
}

// 打印网格
function printGrid(grid: Grid, path: Point[] | null = null, start?: Point, goal?: Point): void {
  const pathSet = new Set(path?.map(p => `${p.x},${p.y}`) || []);
  
  console.log('网格地图 (0=可走, 1=障碍, S=起点, E=终点, *=路径):');
  console.log('   ' + ' '.repeat(2) + Array.from({ length: grid[0].length }, (_, i) => i.toString().padStart(2)).join(''));
  
  for (let y = 0; y < grid.length; y++) {
    let row = `${y.toString().padStart(2)} `;
    for (let x = 0; x < grid[y].length; x++) {
      if (start && x === start.x && y === start.y) {
        row += ' S';
      } else if (goal && x === goal.x && y === goal.y) {
        row += ' E';
      } else if (pathSet.has(`${x},${y}`)) {
        row += ' *';
      } else if (grid[y][x] === 1) {
        row += ' █';
      } else {
        row += ' ·';
      }
    }
    console.log(row);
  }
  console.log();
}

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

// 算法演示
function demonstrateAlgorithm(
  name: string,
  algorithm: Function,
  grid: Grid,
  start: Point,
  goal: Point,
  allowDiagonal: boolean = false
): void {
  console.log(`🔍 ${name} 算法演示`);
  console.log('='.repeat(50));
  
  const startTime = Date.now();
  const path = algorithm(grid, start, goal, { allowDiagonal });
  const executionTime = Date.now() - startTime;
  
  if (path) {
    const pathLength = calculatePathLength(path, allowDiagonal);
    console.log(`✅ 找到路径！`);
    console.log(`   路径长度: ${pathLength.toFixed(2)}`);
    console.log(`   步数: ${path.length}`);
    console.log(`   执行时间: ${executionTime}ms`);
    console.log(`   路径: ${path.map((p: Point) => `(${p.x},${p.y})`).join(' → ')}`);
    
    // 显示路径可视化
    printGrid(grid, path, start, goal);
  } else {
    console.log(`❌ 未找到路径`);
    console.log(`   执行时间: ${executionTime}ms`);
    printGrid(grid, null, start, goal);
  }
  
  console.log();
}

// 算法比较
function compareAlgorithms(
  grid: Grid,
  start: Point,
  goal: Point,
  allowDiagonal: boolean = false
): void {
  console.log('📊 算法性能比较');
  console.log('='.repeat(80));
  console.log(`起点: (${start.x}, ${start.y}) | 终点: (${goal.x}, ${goal.y}) | 对角线: ${allowDiagonal ? '允许' : '禁止'}`);
  console.log();
  
  const algorithms = [
    { name: 'Dijkstra', fn: findPathDijkstra },
    { name: 'A*', fn: findPathHeap },
    // { name: 'JPS', fn: findPathJPS },
    // { name: 'BFS', fn: findPathBFS },
    // { name: 'DFS', fn: findPathDFS },
    // { name: 'GBFS', fn: findPathGBFS },
    // { name: 'Bidirectional', fn: findPathBidirectional },
  ];
  
  const results: Array<{
    name: string;
    success: boolean;
    pathLength: number;
    stepCount: number;
    executionTime: number;
  }> = [];
  
  for (const algorithm of algorithms) {
    const startTime = Date.now();
    const path = algorithm.fn(grid, start, goal, { allowDiagonal });
    const executionTime = Date.now() - startTime;
    
    const result = {
      name: algorithm.name,
      success: path !== null,
      pathLength: path ? calculatePathLength(path, allowDiagonal) : 0,
      stepCount: path ? path.length : 0,
      executionTime,
    };
    
    results.push(result);
    
    const status = result.success ? '✅' : '❌';
    const pathInfo = result.success 
      ? `长度: ${result.pathLength.toFixed(2)} | 步数: ${result.stepCount}`
      : '未找到路径';
    
    console.log(`${status} ${result.name.padEnd(12)} | ${pathInfo.padEnd(20)} | 时间: ${result.executionTime}ms`);
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
    const leastSteps = successfulResults.reduce((min, curr) => 
      curr.stepCount < min.stepCount ? curr : min
    );
    
    console.log();
    console.log('🏆 最优结果:');
    console.log(`   最短路径: ${shortestPath.name} (${shortestPath.pathLength.toFixed(2)})`);
    console.log(`   最快执行: ${fastestTime.name} (${fastestTime.executionTime}ms)`);
    console.log(`   最少步数: ${leastSteps.name} (${leastSteps.stepCount}步)`);
  }
  
  console.log();
}

// 主演示函数
function main() {
  console.log('🎯 路径查找算法演示');
  console.log('='.repeat(60));
  console.log();
  
  const grid = createDemoGrid();
  const start = { x: 0, y: 0 };
  const goal = { x: 3, y: 3 };
  
  // 显示原始网格
  console.log('🗺️  原始网格:');
  printGrid(grid, null, start, goal);
  
  // 算法比较（4邻接）
  compareAlgorithms(grid, start, goal, false);
  
  // 算法比较（8邻接）
  // compareAlgorithms(grid, start, goal, true);
  
  // 详细演示几个主要算法
  // console.log('🔍 详细算法演示 (8邻接):');
  // console.log();
  
  // demonstrateAlgorithm('A*', findPathHeap, grid, start, goal, true);
  // demonstrateAlgorithm('JPS', findPathJPS, grid, start, goal, true);
  // demonstrateAlgorithm('BFS', findPathBFS, grid, start, goal, true);
  // demonstrateAlgorithm('GBFS', findPathGBFS, grid, start, goal, true);
  
  console.log('🎉 演示完成！');
}

// 运行演示
if (require.main === module) {
  main();
}

export {
  createDemoGrid,
  printGrid,
  calculatePathLength,
  demonstrateAlgorithm,
  compareAlgorithms,
  main,
};
