# 路径查找算法快速参考

## 🚀 快速选择指南

| 需求 | 推荐算法 | 原因 |
|------|----------|------|
| **默认选择** | A* | 平衡效率与质量，适用性广 |
| **需要最短路径** | Dijkstra | 保证最优解 |
| **大型网格** | JPS | 效率最高 |
| **简单可靠** | BFS | 实现简单，保证最短路径 |
| **速度优先** | GBFS | 执行最快 |
| **内存受限** | DFS | 内存占用最少 |
| **大型地图** | 双向搜索 | 减少搜索空间 |

## 📊 算法特性对比

| 算法 | 最优性 | 速度 | 内存 | 实现难度 | 适用场景 |
|------|--------|------|------|----------|----------|
| **Dijkstra** | ✅ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 需要最短路径 |
| **A*** | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 大多数场景 |
| **JPS** | ✅ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 大型网格 |
| **BFS** | ✅ | ⭐⭐⭐ | ⭐⭐ | ⭐ | 等权重图 |
| **DFS** | ❌ | ⭐⭐⭐ | ⭐ | ⭐ | 任意路径 |
| **GBFS** | ❌ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | 快速搜索 |
| **双向搜索** | ✅ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 大型地图 |

## 🎯 使用场景速查

### 游戏开发
- **RPG角色移动**: A*
- **RTS单位寻路**: JPS
- **迷宫游戏**: BFS
- **开放世界**: JPS
- **实时战斗**: GBFS

### 机器人导航
- **室内导航**: A*
- **室外导航**: Dijkstra
- **紧急避障**: GBFS
- **路径优化**: A*

### 网络应用
- **路由算法**: Dijkstra
- **社交网络**: 双向搜索
- **网页爬虫**: BFS
- **图分析**: DFS

## 💡 选择决策树

```
需要最短路径？
├─ 是 → 等权重图？
│   ├─ 是 → BFS 或 双向搜索
│   └─ 否 → Dijkstra
└─ 否 → 需要最快速度？
    ├─ 是 → 大网格？
    │   ├─ 是 → JPS
    │   └─ 否 → GBFS
    └─ 否 → A*
```

## 🔧 代码示例

```typescript
// 游戏角色寻路
const path = findPathHeap(grid, start, goal, { allowDiagonal: true });

// 大型网格寻路
const path = findPathJPS(grid, start, goal, { allowDiagonal: true });

// 简单可靠寻路
const path = findPathBFS(grid, start, goal, { allowDiagonal: false });

// 快速寻路
const path = findPathGBFS(grid, start, goal, { allowDiagonal: true });

// 最短路径
const path = findPathDijkstra(grid, start, goal, { allowDiagonal: false });
```

## ⚡ 性能特点

### 时间复杂度
- **最快**: BFS, DFS, GBFS
- **中等**: A*, 双向搜索
- **较慢**: Dijkstra, JPS

### 空间复杂度
- **最少**: DFS, GBFS
- **中等**: BFS, A*, 双向搜索
- **较多**: Dijkstra, JPS

### 路径质量
- **最优**: Dijkstra, A*, JPS, BFS, 双向搜索
- **一般**: GBFS
- **较差**: DFS

## 🎮 实际应用建议

1. **游戏开发**: 优先考虑A*，大型地图使用JPS
2. **机器人导航**: 室内用A*，室外用Dijkstra
3. **网络应用**: 路由用Dijkstra，社交网络用双向搜索
4. **实时系统**: 优先考虑GBFS或A*
5. **内存受限**: 使用DFS或GBFS
