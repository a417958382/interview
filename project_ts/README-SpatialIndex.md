# 空间索引系统使用指南

## 📖 概述

本项目为实时战斗系统实现了多种空间索引策略，支持超大地图的高性能单位管理和碰撞检测。系统包含四种主要策略：均匀网格、四叉树、分层网格和自适应网格。

## 🎯 支持的策略

### 1. 均匀网格 (Uniform Grid)
- **适用场景**: 单位密度均匀分布的中小型地图
- **优点**: 实现简单，查询速度快
- **缺点**: 在密集区域效率较低

### 2. 四叉树 (Quad Tree)
- **适用场景**: 超大地图，单位密度不均匀
- **优点**: 自动适应密度变化，查询效率高
- **缺点**: 构建和维护成本较高

### 3. 分层网格 (Hierarchical Grid)
- **适用场景**: 大型地图，需要精细控制
- **优点**: 结合粗细网格的优点，性能均衡
- **缺点**: 实现相对复杂

### 4. 自适应网格 (Adaptive Grid)
- **适用场景**: 动态变化的单位密度
- **优点**: 自动调整网格大小，最优性能
- **缺点**: 内存使用较多

## 🚀 快速开始

```typescript
import { RealTimeCombatManager, SpatialIndexStrategy } from './realtime-combat-system';

// 创建战斗管理器（默认使用均匀网格）
const combatManager = new RealTimeCombatManager();

// 或指定初始策略
const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.QUAD_TREE);
```

## 🔧 API 参考

### RealTimeCombatManager

#### 构造函数
```typescript
constructor(initialStrategy?: SpatialIndexStrategy)
```

#### 主要方法

##### 添加/移除单位
```typescript
addUnit(unit: CombatUnit): void
removeUnit(unitId: string): void
```

##### 空间查询
```typescript
getUnitsInRange(position: Position, range: number): CombatUnit[]
getPotentialCombats(): Map<string, string[]>
```

##### 策略管理
```typescript
switchSpatialStrategy(strategy: SpatialIndexStrategy): void
getCurrentSpatialStrategy(): SpatialIndexStrategy
getSpatialPerformanceStats(): any
```

## 📊 性能对比

基于测试结果 (2000个单位)：

| 策略 | 添加时间 | 查询时间 | 战斗检测 | 适用场景 |
|------|----------|----------|----------|----------|
| 均匀网格 | 0.5ms | 0.25ms | 0.25ms | 小型地图 |
| 四叉树 | 3.0ms | 0.0ms | 0.25ms | 大型不均匀地图 |
| 分层网格 | 1.25ms | 0.75ms | 0.25ms | 中大型地图 |
| 自适应网格 | 4.0ms | 0.0ms | 0.0ms | 动态密度地图 |

## 🎮 使用示例

### 基本使用

```typescript
// 创建战斗管理器
const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.UNIFORM_GRID);

// 添加单位
const unit = new ExampleUnit('unit1', '战士', {x: 100, y: 100}, Faction.PLAYER, UnitType.INFANTRY, 100, 100, 20, 10, 50, 5);
combatManager.addUnit(unit);

// 查询范围内的单位
const nearbyUnits = combatManager.getUnitsInRange({x: 100, y: 100}, 200);
console.log(`附近有 ${nearbyUnits.length} 个单位`);
```

### 策略切换

```typescript
// 切换到四叉树策略（适合超大地图）
combatManager.switchSpatialStrategy(SpatialIndexStrategy.QUAD_TREE);

// 检查当前策略
const currentStrategy = combatManager.getCurrentSpatialStrategy();
console.log(`当前使用: ${currentStrategy}`);
```

### 性能监控

```typescript
// 获取性能统计
const stats = combatManager.getSpatialPerformanceStats();
console.log('性能统计:', stats);

// 根据需要切换策略
if (stats.unitCount > 1000) {
  combatManager.switchSpatialStrategy(SpatialIndexStrategy.QUAD_TREE);
}
```

## ⚙️ 配置选项

### 均匀网格配置
```typescript
// 默认配置
{
  gridSize: 50  // 网格单元大小
}
```

### 四叉树配置
```typescript
{
  bounds: { x: -10000, y: -10000, width: 20000, height: 20000 }, // 根节点边界
  maxUnitsPerNode: 8,  // 每个节点最大单位数
  maxDepth: 8          // 最大深度
}
```

### 分层网格配置
```typescript
{
  coarseGridSize: 100, // 粗网格大小
  fineGridSize: 25,    // 细网格大小
  coarseThreshold: 50  // 切换阈值
}
```

### 自适应网格配置
```typescript
{
  baseGridSize: 50,      // 基础网格大小
  maxGridSize: 400,      // 最大网格大小
  densityThreshold: 20   // 密度阈值
}
```

## 🧪 测试和验证

运行完整测试套件：

```bash
npm run build
npx ts-node src/test-spatial-strategies.ts
```

测试包含：
- ✅ 性能对比测试 (100-2000单位)
- ✅ 策略切换功能测试
- ✅ 内存使用监控
- ✅ 查询准确性验证

## 🎯 最佳实践

### 1. 选择合适的策略

#### 小型游戏 (≤1000单位)
```typescript
// 推荐使用均匀网格
const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.UNIFORM_GRID);
```

#### 大型游戏 (>1000单位)
```typescript
// 推荐使用四叉树
const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.QUAD_TREE);
```

#### 动态密度游戏
```typescript
// 推荐使用自适应网格
const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.ADAPTIVE);
```

### 2. 运行时策略切换

```typescript
// 监控单位数量并动态切换
function optimizeSpatialStrategy(combatManager: RealTimeCombatManager) {
  const stats = combatManager.getSpatialPerformanceStats();

  if (stats.unitCount < 500) {
    combatManager.switchSpatialStrategy(SpatialIndexStrategy.UNIFORM_GRID);
  } else if (stats.unitCount < 2000) {
    combatManager.switchSpatialStrategy(SpatialIndexStrategy.HIERARCHICAL);
  } else {
    combatManager.switchSpatialStrategy(SpatialIndexStrategy.QUAD_TREE);
  }
}
```

### 3. 内存管理

```typescript
// 定期清理和优化
setInterval(() => {
  // 检查内存使用情况
  const stats = combatManager.getSpatialPerformanceStats();

  // 如果单位数量变化很大，考虑重建索引
  if (Math.abs(stats.unitCount - previousUnitCount) > 100) {
    // 重建空间索引
    combatManager.switchSpatialStrategy(combatManager.getCurrentSpatialStrategy());
  }
}, 30000); // 每30秒检查一次
```

## 🔍 故障排除

### 常见问题

#### Q: 查询性能太慢
**A**: 检查单位密度，如果密度很高，考虑切换到四叉树或自适应网格。

#### Q: 内存使用过多
**A**: 自适应网格会使用更多内存，考虑切换到分层网格。

#### Q: 单位分布不均匀
**A**: 四叉树在处理不均匀分布时性能最好。

### 调试信息

```typescript
// 启用详细日志
console.log('当前策略:', combatManager.getCurrentSpatialStrategy());
console.log('性能统计:', combatManager.getSpatialPerformanceStats());
console.log('潜在战斗:', combatManager.getPotentialCombats().size);
```

## 📈 扩展开发

### 添加新策略

1. 实现 `ISpatialIndex` 接口
2. 在 `SpatialIndexStrategy` 枚举中添加新策略
3. 在 `SpatialIndexManager.createSpatialIndex()` 中添加创建逻辑
4. 更新配置选项

### 自定义配置

```typescript
// 为特定游戏定制配置
const customConfig = {
  [SpatialIndexStrategy.QUAD_TREE]: {
    bounds: { x: 0, y: 0, width: 50000, height: 50000 },
    maxUnitsPerNode: 16,
    maxDepth: 10
  }
};
```

## 📚 相关文档

- [实时战斗系统主文档](./README.md)
- [测试结果分析](./test-results.md)
- [性能优化指南](./performance-guide.md)

---

*本空间索引系统为超大地图游戏提供了高性能的单位管理和碰撞检测解决方案，支持动态策略切换以适应不同的游戏场景和性能需求。*
