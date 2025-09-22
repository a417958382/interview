/**
 * 迪克斯特拉算法日志测试
 * 用于演示详细的执行过程日志
 */

import { findPathDijkstra, dijkstraAll, Grid, Point } from './dijkstra';

// 创建一个简单的测试网格
function createTestGrid(): Grid {
  return [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0]
  ];
}

// 打印网格
function printGrid(grid: Grid, path: Point[] = []): void {
  const pathSet = new Set(path.map(p => `${p.x},${p.y}`));
  
  console.log('\n🗺️  网格地图:');
  console.log('  0 1 2 3 4');
  for (let y = 0; y < grid.length; y++) {
    let row = `${y} `;
    for (let x = 0; x < grid[y].length; x++) {
      if (pathSet.has(`${x},${y}`)) {
        row += '*';  // 路径
      } else if (grid[y][x] === 1) {
        row += '█';  // 障碍物
      } else {
        row += '·';  // 空地
      }
      row += ' ';
    }
    console.log(row);
  }
  console.log('图例: · = 空地, █ = 障碍物, * = 路径\n');
}

// 测试单点寻路
function testSinglePathfinding(): void {
  console.log('='.repeat(60));
  console.log('🧪 测试1: 单点寻路 (findPathDijkstra)');
  console.log('='.repeat(60));
  
  const grid = createTestGrid();
  const start: Point = { x: 0, y: 0 };
  const goal: Point = { x: 4, y: 4 };
  
  printGrid(grid);
  
  const path = findPathDijkstra(grid, start, goal, { allowDiagonal: false });
  
  if (path) {
    printGrid(grid, path);
  } else {
    console.log('❌ 未找到路径');
  }
}

// 测试计算到所有点的距离
function testAllDistances(): void {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 测试2: 计算到所有点的最短距离 (dijkstraAll)');
  console.log('='.repeat(60));
  
  const grid = createTestGrid();
  const start: Point = { x: 0, y: 0 };
  
  printGrid(grid);
  
  const { dist, parent } = dijkstraAll(grid, start, { allowDiagonal: false });
  
  // 打印距离矩阵
  console.log('\n📊 距离矩阵 (从起点到各点的最短距离):');
  console.log('  0   1   2   3   4');
  for (let y = 0; y < dist.length; y++) {
    let row = `${y} `;
    for (let x = 0; x < dist[y].length; x++) {
      if (dist[y][x] === Number.POSITIVE_INFINITY) {
        row += '∞  ';
      } else {
        row += `${dist[y][x].toFixed(1)} `;
      }
    }
    console.log(row);
  }
  
  // 演示如何查询到特定点的距离
  console.log('\n🔍 距离查询示例:');
  const testPoints = [
    { x: 2, y: 2 },
    { x: 4, y: 4 },
    { x: 1, y: 1 }, // 障碍物
    { x: 3, y: 3 }  // 障碍物
  ];
  
  testPoints.forEach(point => {
    const distance = dist[point.y][point.x];
    if (distance === Number.POSITIVE_INFINITY) {
      console.log(`  到点 (${point.x}, ${point.y}) 的距离: 不可达`);
    } else {
      console.log(`  到点 (${point.x}, ${point.y}) 的距离: ${distance.toFixed(2)}`);
    }
  });
}

// 测试对角线移动
function testDiagonalMovement(): void {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 测试3: 对角线移动寻路');
  console.log('='.repeat(60));
  
  const grid = createTestGrid();
  const start: Point = { x: 0, y: 0 };
  const goal: Point = { x: 4, y: 4 };
  
  printGrid(grid);
  
  const path = findPathDijkstra(grid, start, goal, { allowDiagonal: true });
  
  if (path) {
    printGrid(grid, path);
  } else {
    console.log('❌ 未找到路径');
  }
}

// 主测试函数
function runTests(): void {
  console.log('🚀 开始迪克斯特拉算法日志测试\n');
  
  testSinglePathfinding();
  testAllDistances();
  testDiagonalMovement();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ 所有测试完成！');
  console.log('='.repeat(60));
}

// 运行测试
if (require.main === module) {
  runTests();
}

export { runTests, testSinglePathfinding, testAllDistances, testDiagonalMovement };
