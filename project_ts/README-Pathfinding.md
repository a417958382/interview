# 路径查找算法集合

这个项目包含了7种主要的路径查找算法的TypeScript实现，适用于游戏开发、机器人导航、地图应用等场景。

## 🎯 支持的算法

### 1. Dijkstra算法 (`dijkstra.ts`)
- **特点**：保证找到最短路径，适用于非负权重图
- **时间复杂度**：O((V+E)logV)
- **适用场景**：需要绝对最短路径的场景
- **函数**：
  - `findPathDijkstra()` - 单源最短路径
  - `dijkstraAll()` - 全图最短路径

### 2. A*算法 (`astar_heap.ts`)
- **特点**：使用启发式函数，平衡效率和路径质量
- **时间复杂度**：O(b^d)
- **适用场景**：大多数路径查找场景的最佳选择
- **函数**：
  - `findPathHeap()` - A*路径查找

### 3. Jump Point Search (JPS) (`astar_jps.ts`)
- **特点**：在A*基础上跳过不必要节点，效率最高
- **时间复杂度**：O(b^d)
- **适用场景**：大型网格或需要高性能的场景
- **函数**：
  - `findPathJPS()` - JPS路径查找

### 4. 广度优先搜索 (BFS) (`bfs.ts`)
- **特点**：逐层扩展，保证最短路径
- **时间复杂度**：O(V+E)
- **适用场景**：等权重网格，需要最短路径的场景
- **函数**：
  - `findPathBFS()` - BFS路径查找
  - `bfsAll()` - BFS全图搜索

### 5. 深度优先搜索 (DFS) (`dfs.ts`)
- **特点**：优先探索深层节点，内存占用少
- **时间复杂度**：O(V+E)
- **适用场景**：寻找任意路径，迷宫探索
- **函数**：
  - `findPathDFS()` - 迭代版DFS
  - `findPathDFSRecursive()` - 递归版DFS
  - `dfsAll()` - DFS全图搜索

### 6. 贪婪最佳优先搜索 (GBFS) (`gbfs.ts`)
- **特点**：只使用启发式函数，速度很快
- **时间复杂度**：O(b^m)
- **适用场景**：对路径质量要求不高的快速搜索
- **函数**：
  - `findPathGBFS()` - GBFS路径查找
  - `gbfsAll()` - GBFS全图搜索

### 7. 双向搜索 (`bidirectional-search.ts`)
- **特点**：从起点和终点同时搜索，减少搜索空间
- **时间复杂度**：O(b^(d/2))
- **适用场景**：大型地图的路径查找
- **函数**：
  - `findPathBidirectional()` - 双向路径查找
  - `bidirectionalAll()` - 双向全图搜索

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行测试
```bash
# 运行所有路径查找算法测试
npm run test-pathfinding

# 运行算法演示
npm run demo-pathfinding

# 运行单个算法测试
npm run test-dijkstra
npm run test-astar
npm run test-jps
npm run test-bfs
npm run test-dfs
npm run test-gbfs
npm run test-bidirectional
```

### 基本使用示例

```typescript
import { findPathAStar } from './src/astar_heap';
import { findPathBFS } from './src/bfs';

// 创建网格地图 (0=可走, 1=障碍)
const grid = [
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0],
];

// 设置起点和终点
const start = { x: 0, y: 0 };
const goal = { x: 4, y: 2 };

// 使用A*算法查找路径
const path = findPathAStar(grid, start, goal, { allowDiagonal: false });

if (path) {
  console.log('找到路径:', path);
} else {
  console.log('未找到路径');
}
```

## 📊 算法性能对比

| 算法 | 最优性 | 完整性 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|--------|--------|------------|------------|----------|
| Dijkstra | ✅ | ✅ | O((V+E)logV) | O(V) | 需要最短路径 |
| A* | ✅* | ✅ | O(b^d) | O(b^d) | 大多数场景 |
| JPS | ✅* | ✅ | O(b^d) | O(b^d) | 大型网格 |
| BFS | ✅ | ✅ | O(V+E) | O(V) | 等权重图 |
| DFS | ❌ | ✅ | O(V+E) | O(V) | 任意路径 |
| GBFS | ❌ | ❌ | O(b^m) | O(b^m) | 快速搜索 |
| 双向搜索 | ✅ | ✅ | O(b^(d/2)) | O(b^(d/2)) | 大型地图 |

*注：A*和JPS在启发式函数满足一致性条件时保证最优性*

## 🎮 游戏开发应用

### 1. 角色移动
```typescript
// 游戏角色寻路
const playerPath = findPathAStar(gameMap, playerPosition, targetPosition, {
  allowDiagonal: true
});
```

### 2. AI寻路
```typescript
// NPC寻路
const npcPath = findPathJPS(gameMap, npcPosition, playerPosition, {
  allowDiagonal: false
});
```

### 3. 地图探索
```typescript
// 探索所有可达区域
const reachableAreas = bfsAll(gameMap, startPosition, {
  allowDiagonal: true
});
```

## 🔧 配置选项

所有算法都支持以下配置选项：

```typescript
interface AlgorithmOptions {
  allowDiagonal?: boolean; // 是否允许对角线移动，默认false
  maxDepth?: number;       // 最大搜索深度（仅DFS支持）
}
```

## 📈 性能优化建议

1. **小地图**：使用BFS或A*
2. **大地图**：使用JPS或双向搜索
3. **实时应用**：使用GBFS或A*
4. **需要最优解**：使用Dijkstra或A*
5. **内存受限**：使用DFS

## 🧪 测试和验证

项目包含完整的测试套件：

- **单元测试**：每个算法的基本功能测试
- **性能测试**：不同规模网格的性能对比
- **正确性测试**：路径最优性验证
- **边界测试**：异常情况处理

## 📚 算法原理

### Dijkstra算法
基于贪心策略，每次选择距离起点最近的未访问节点进行扩展。

### A*算法
结合了Dijkstra的最优性和贪心搜索的效率，使用f(n) = g(n) + h(n)作为评估函数。

### JPS算法
在A*基础上，通过跳点搜索跳过不必要的中间节点，大幅减少搜索空间。

### BFS算法
使用队列进行广度优先搜索，保证找到最短路径。

### DFS算法
使用栈进行深度优先搜索，内存占用少但不保证最优解。

### GBFS算法
只使用启发式函数h(n)进行搜索，速度快但可能陷入局部最优。

### 双向搜索
从起点和终点同时开始搜索，在中间相遇时停止，减少搜索空间。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这些算法实现！

## 📄 许可证

ISC License
