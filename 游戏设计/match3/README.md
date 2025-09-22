# 消除类游戏核心系统

这是一个完整的消除类游戏核心系统实现，包含了匹配检测、消除执行、重力下落和连锁反应等核心功能。

## 🏗️ 系统架构

### 核心组件

- **EliminationSystem**: 核心消除引擎，协调各个子系统
- **MatchDetector**: 匹配检测器，负责检测网格中的匹配组合
- **GravitySystem**: 重力系统，处理元素下落和位置调整
- **FillSystem**: 填充系统，生成新元素填充空位

### 支持的功能

- ✅ 基础匹配检测（水平、垂直）
- ✅ 特殊形状匹配（L形、T形）
- ✅ 消除执行和分数计算
- ✅ 特殊元素生成
- ✅ 重力下落系统
- ✅ 新元素填充
- ✅ 连锁反应处理
- ✅ 移动验证
- ✅ 配置化参数

## 📦 使用方法

### 基础使用

```typescript
import { EliminationSystem, GameGrid, GemType } from './match3';

// 创建消除系统
const eliminationSystem = new EliminationSystem();

// 创建游戏网格
const grid: GameGrid = {
  rows: 8,
  cols: 8,
  cells: [] // 初始化网格数据
};

// 检测匹配
const matches = eliminationSystem.findMatches(grid);

// 执行消除
if (matches.length > 0) {
  const result = await eliminationSystem.executeElimination(grid, matches);
  console.log(`消除了 ${result.eliminatedGems.length} 个宝石，得分: ${result.score}`);
}

// 处理连锁反应
const cascadeResult = await eliminationSystem.processCascade(grid);
console.log(`连锁反应: ${cascadeResult.chainCount} 次，总得分: ${cascadeResult.totalScore}`);
```

### 高级配置

```typescript
import { EliminationSystem, DEFAULT_ELIMINATION_CONFIG } from './match3';

// 自定义配置
const customConfig = {
  ...DEFAULT_ELIMINATION_CONFIG,
  baseScorePerGem: 20,
  maxComboMultiplier: 10.0,
  chainReactionMultiplier: 1.5
};

const eliminationSystem = new EliminationSystem(customConfig);
```

## 🎮 核心功能详解

### 1. 匹配检测

系统支持多种匹配模式：

- **基础匹配**: 3个或以上相同宝石的直线匹配
- **特殊形状**: L形和T形匹配
- **重叠匹配**: 自动处理重叠的匹配组合

### 2. 特殊元素生成

根据匹配长度自动生成特殊元素：

- **3个匹配**: 普通消除
- **4个匹配**: 生成直线消除元素
- **5个或以上**: 生成同色消除元素
- **特殊形状**: 生成炸弹元素

### 3. 连锁反应

系统会自动处理连锁反应：

1. 执行初始消除
2. 应用重力下落
3. 填充新元素
4. 检测新匹配
5. 重复直到无新匹配

### 4. 移动验证

在玩家操作前验证移动的有效性：

```typescript
const isValid = eliminationSystem.isValidMove(grid, fromPosition, toPosition);
if (isValid) {
  // 执行移动
  const result = await eliminationSystem.executeFullElimination(grid, matches);
}
```

## ⚙️ 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `baseScorePerGem` | 10 | 每个宝石的基础分数 |
| `matchLengthMultiplier` | 1.5 | 匹配长度倍率 |
| `specialGemMultiplier` | 2.0 | 特殊宝石倍率 |
| `comboTimeWindow` | 3.0 | 连击时间窗口（秒） |
| `maxComboMultiplier` | 5.0 | 最大连击倍率 |
| `comboDecayRate` | 0.1 | 连击衰减率 |
| `chainReactionMultiplier` | 1.2 | 连锁反应倍率 |
| `maxChainLength` | 10 | 最大连锁长度 |
| `chainBonusThreshold` | 3 | 连锁奖励阈值 |

## 🔧 扩展性

系统设计为高度可扩展：

- **自定义宝石类型**: 在 `GemType` 枚举中添加新类型
- **自定义特殊效果**: 扩展 `SpecialEffect` 接口
- **自定义匹配规则**: 重写 `MatchDetector` 的方法
- **自定义动画**: 扩展动画接口和实现

## 📊 性能优化

系统内置了多项性能优化：

- **批量处理**: 重力下落和填充使用批量操作
- **智能检测**: 避免重复检测已处理的匹配
- **内存管理**: 及时清理临时对象
- **异步处理**: 支持异步操作，避免阻塞主线程

## 🎯 最佳实践

1. **初始化**: 在游戏开始时创建一次 `EliminationSystem` 实例
2. **配置**: 根据游戏需求调整配置参数
3. **验证**: 在执行移动前始终验证移动的有效性
4. **错误处理**: 处理可能的异常情况
5. **性能监控**: 监控系统性能，必要时调整配置

## 🚀 未来扩展

计划中的功能扩展：

- [ ] AI提示系统
- [ ] 关卡编辑器支持
- [ ] 更多特殊元素类型
- [ ] 动画系统集成
- [ ] 音效系统集成
- [ ] 成就系统集成

---

*这个系统为消除类游戏提供了坚实的基础，可以在此基础上构建完整的游戏体验。*
