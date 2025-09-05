# 消除类游戏算法完全指南

## 🎮 什么是消除类游戏？

消除类游戏（Match-3 Games）如《Candy Crush》、《开心消消乐》等，通过交换相邻元素形成3个或更多相同元素的直线或L形来消除元素。游戏涉及复杂的算法来处理匹配检测、消除逻辑、重力下落、分数计算等。

## 🧩 核心算法系统

### 1. 游戏网格系统 (GameGrid)

```typescript
import { GameGrid, GemType } from './match3-game-algorithms.js';

// 创建8x8的游戏网格
const grid = new GameGrid(8, 8);

// 设置宝石
grid.set(0, 0, GemType.RED);
grid.set(0, 1, GemType.RED);
grid.set(0, 2, GemType.RED);

// 交换元素
grid.swap(0, 0, 0, 1);

// 获取元素
const gem = grid.get(0, 0);
```

### 2. 匹配检测算法 (MatchDetector)

#### 水平匹配检测
```typescript
import { MatchDetector } from './match3-game-algorithms.js';

// 检测所有水平匹配
const horizontalMatches = MatchDetector.findHorizontalMatches(grid);
console.log(`找到 ${horizontalMatches.length} 个水平匹配`);
```

#### 垂直匹配检测
```typescript
const verticalMatches = MatchDetector.findVerticalMatches(grid);
console.log(`找到 ${verticalMatches.length} 个垂直匹配`);
```

#### 完整匹配检测
```typescript
const allMatches = MatchDetector.findAllMatches(grid);
allMatches.forEach((match, index) => {
  console.log(`匹配 ${index + 1}: 位置(${match.row}, ${match.col}), 长度${match.length}, 类型${match.type}`);
});
```

#### 检查是否有可用的移动
```typescript
const hasMoves = MatchDetector.hasPossibleMoves(grid);
if (!hasMoves) {
  console.log('游戏陷入僵局，需要重新洗牌');
}
```

### 3. 消除和重力系统 (EliminationSystem)

#### 执行消除
```typescript
import { EliminationSystem } from './match3-game-algorithms.js';

// 消除匹配的元素
const eliminatedGems = EliminationSystem.eliminateMatches(grid, allMatches);
console.log(`消除了 ${eliminatedGems.length} 个宝石`);
```

#### 应用重力
```typescript
const gravityMoves = EliminationSystem.applyGravity(grid);
console.log(`重力移动了 ${gravityMoves.length} 个宝石`);
```

#### 生成新元素
```typescript
const emptyCount = countEmptyCells(grid);
if (emptyCount > 0) {
  const newGems = EliminationSystem.generateNewGems(grid, emptyCount);
  console.log(`生成了 ${newGems.length} 个新宝石`);
}
```

#### 处理连锁反应
```typescript
const chainResult = EliminationSystem.processChainReactions(grid);
console.log(`连锁反应结果:`);
console.log(`  总消除数量: ${chainResult.totalEliminated}`);
console.log(`  连锁次数: ${chainResult.chainCount}`);
console.log(`  最大连锁长度: ${chainResult.maxChainLength}`);
```

### 4. 分数计算系统 (ScoreCalculator)

#### 基础分数计算
```typescript
import { ScoreCalculator } from './match3-game-algorithms.js';

const score = ScoreCalculator.calculateBaseScore(
  4,              // 匹配长度
  GemType.RED,    // 宝石类型
  1.5,            // 连锁倍率
  2.0             // 连击倍率
);
console.log(`获得分数: ${score}`);
```

#### 连击奖励
```typescript
const comboBonus = ScoreCalculator.calculateComboBonus(5);
console.log(`5连击奖励: ${comboBonus.toFixed(2)}x`);
```

#### 连锁奖励
```typescript
const chainBonus = ScoreCalculator.calculateChainBonus(3);
console.log(`3级连锁奖励: ${chainBonus.toFixed(2)}x`);
```

#### 特殊效果分数
```typescript
const specialScore = ScoreCalculator.calculateSpecialEffectScore(
  GemType.SPECIAL_BOMB,  // 特殊效果类型
  9,                     // 影响的单元格数量
  2.0                    // 连锁倍率
);
console.log(`炸弹特效分数: ${specialScore}`);
```

#### 关卡进度计算
```typescript
const progress = ScoreCalculator.calculateProgress(
  15000,    // 当前分数
  25000,    // 目标分数
  15,       // 剩余移动次数
  120       // 剩余时间(秒)
);

console.log(`进度: ${(progress.progress * 100).toFixed(1)}%`);
console.log(`还需要: ${progress.scoreNeeded} 分`);
console.log(`预计还需要: ${progress.estimatedMoves} 步`);
```

### 5. AI提示系统 (HintSystem)

#### 寻找可能的移动
```typescript
import { HintSystem } from './match3-game-algorithms.js';

const possibleMoves = HintSystem.findPossibleMoves(grid);
console.log(`找到 ${possibleMoves.length} 个可能的移动`);

possibleMoves.slice(0, 3).forEach((move, index) => {
  console.log(`移动 ${index + 1}: (${move.fromRow}, ${move.fromCol}) → (${move.toRow}, ${move.toCol}), 分数: ${move.score}`);
});
```

#### 获取最佳提示
```typescript
const bestHint = HintSystem.getBestHint(grid);
if (bestHint) {
  console.log(`最佳移动: (${bestHint.fromRow}, ${bestHint.fromCol}) → (${bestHint.toRow}, ${bestHint.toCol})`);
} else {
  console.log('没有可用的移动');
}
```

#### 检查僵局
```typescript
const isStuck = HintSystem.isStuck(grid);
if (isStuck) {
  console.log('游戏陷入僵局，建议重新洗牌');
}
```

### 6. 关卡生成器 (LevelGenerator)

#### 生成有效关卡
```typescript
import { LevelGenerator } from './match3-game-algorithms.js';

const easyLevel = LevelGenerator.generateValidLevel(8, 8, 'easy');
console.log('简单关卡已生成');
```

#### 生成目标配置
```typescript
const objectives = LevelGenerator.generateObjectives('medium');
console.log('中等难度目标:');
console.log(`- 目标分数: ${objectives.targetScore}`);
console.log(`- 移动限制: ${objectives.movesLimit}`);
console.log(`- 时间限制: ${objectives.timeLimit}秒`);

console.log('特殊目标:');
objectives.specialObjectives.forEach(obj => {
  console.log(`- ${obj.type}: ${obj.count}`);
});
```

### 7. 动画系统 (AnimationSystem)

#### 消除动画
```typescript
import { AnimationSystem } from './match3-game-algorithms.js';

const eliminatedGems = [
  { row: 0, col: 0, type: GemType.RED },
  { row: 0, col: 1, type: GemType.RED },
  { row: 0, col: 2, type: GemType.RED }
];

const eliminationAnimations = AnimationSystem.calculateEliminationAnimation(
  eliminatedGems,
  0.5  // 动画持续时间
);

eliminationAnimations.forEach((anim, index) => {
  console.log(`动画 ${index + 1}: ${anim.animationType} 类型`);
  console.log(`  时间: ${anim.startTime.toFixed(2)}s - ${anim.endTime.toFixed(2)}s`);
});
```

#### 下落动画
```typescript
const gravityMoves = [
  { fromRow: 1, fromCol: 2, toRow: 3, toCol: 2 },
  { fromRow: 2, fromCol: 2, toRow: 4, toCol: 2 }
];

const fallAnimations = AnimationSystem.calculateFallAnimation(
  gravityMoves,
  5  // 下落速度
);

fallAnimations.forEach((anim, index) => {
  console.log(`下落动画 ${index + 1}:`);
  console.log(`  从 (${anim.fromRow}, ${anim.fromCol}) 到 (${anim.toRow}, ${anim.toCol})`);
  console.log(`  持续时间: ${anim.duration.toFixed(2)}s, 延迟: ${anim.delay.toFixed(2)}s`);
});
```

#### 连锁特效
```typescript
const chainEffect = AnimationSystem.calculateChainEffect(3, { row: 2, col: 2 });
console.log(`${3}级连锁特效:`);
console.log(`- 粒子数量: ${chainEffect.particleCount}`);
console.log(`- 扩散半径: ${chainEffect.spreadRadius}`);
console.log(`- 持续时间: ${chainEffect.duration}秒`);
```

## 🎯 完整游戏流程

```typescript
import {
  GameGrid,
  MatchDetector,
  EliminationSystem,
  ScoreCalculator,
  HintSystem,
  GemType
} from './match3-game-algorithms.js';

class Match3Game {
  private grid: GameGrid;
  private score: number = 0;
  private combo: number = 0;
  private chain: number = 0;

  constructor(rows: number, cols: number) {
    this.grid = new GameGrid(rows, cols);
    this.initializeGrid();
  }

  private initializeGrid(): void {
    // 生成随机宝石，确保没有初始匹配
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        let gem: GemType;
        do {
          gem = this.getRandomGem();
        } while (this.wouldCreateMatch(row, col, gem));

        this.grid.set(row, col, gem);
      }
    }
  }

  private getRandomGem(): GemType {
    const gems = [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE];
    return gems[Math.floor(Math.random() * gems.length)];
  }

  private wouldCreateMatch(row: number, col: number, gem: GemType): boolean {
    // 临时设置宝石
    this.grid.set(row, col, gem);

    // 检查是否会创建匹配
    const matches = MatchDetector.findAllMatches(this.grid);
    const hasMatch = matches.some(match =>
      (match.row === row && Math.abs(match.col - col) < match.length) ||
      (match.col === col && Math.abs(match.row - row) < match.length)
    );

    // 恢复为空
    this.grid.set(row, col, GemType.EMPTY);

    return hasMatch;
  }

  // 处理玩家移动
  processMove(fromRow: number, fromCol: number, toRow: number, toCol: number): {
    success: boolean,
    score: number,
    eliminated: number
  } {
    // 验证移动是否有效
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) {
      return { success: false, score: 0, eliminated: 0 };
    }

    // 执行交换
    this.grid.swap(fromRow, fromCol, toRow, toCol);

    // 检查是否有匹配
    const matches = MatchDetector.findAllMatches(this.grid);
    if (matches.length === 0) {
      // 没有匹配，撤销交换
      this.grid.swap(fromRow, fromCol, toRow, toCol);
      return { success: false, score: 0, eliminated: 0 };
    }

    // 处理连锁反应
    const chainResult = EliminationSystem.processChainReactions(this.grid);

    // 计算分数
    let moveScore = 0;
    matches.forEach(match => {
      const baseScore = ScoreCalculator.calculateBaseScore(
        match.length,
        match.type,
        ScoreCalculator.calculateChainBonus(this.chain + 1),
        ScoreCalculator.calculateComboBonus(this.combo + 1)
      );
      moveScore += baseScore;
    });

    // 更新游戏状态
    this.score += moveScore;
    this.combo += matches.length;
    this.chain = Math.max(this.chain, chainResult.chainCount);

    return {
      success: true,
      score: moveScore,
      eliminated: chainResult.totalEliminated
    };
  }

  private isValidMove(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    // 检查是否相邻
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  // 获取AI提示
  getHint(): { fromRow: number, fromCol: number, toRow: number, toCol: number } | null {
    return HintSystem.getBestHint(this.grid);
  }

  // 检查游戏状态
  checkGameState(): { isStuck: boolean, hasMoves: boolean } {
    const hasMoves = MatchDetector.hasPossibleMoves(this.grid);
    return {
      isStuck: !hasMoves,
      hasMoves
    };
  }

  // 获取当前分数
  getScore(): number {
    return this.score;
  }

  // 获取网格状态
  getGrid(): GemType[][] {
    return this.grid.getGrid();
  }
}

// 使用示例
const game = new Match3Game(8, 8);

// 获取AI提示
const hint = game.getHint();
if (hint) {
  console.log(`AI提示: (${hint.fromRow}, ${hint.fromCol}) → (${hint.toRow}, ${hint.toCol})`);
}

// 执行移动
const result = game.processMove(0, 0, 0, 1);
if (result.success) {
  console.log(`移动成功! 分数: ${result.score}, 消除: ${result.eliminated}`);
} else {
  console.log('无效移动');
}

// 检查游戏状态
const gameState = game.checkGameState();
console.log(`游戏状态: ${gameState.isStuck ? '僵局' : '正常'}, ${gameState.hasMoves ? '有可用移动' : '无可用移动'}`);
```

## 📊 算法复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 说明 |
|------|-----------|-----------|------|
| 匹配检测 | O(rows × cols) | O(1) | 扫描整个网格 |
| 消除处理 | O(matched_cells) | O(1) | 移除匹配元素 |
| 重力下落 | O(rows × cols) | O(1) | 遍历网格应用重力 |
| AI提示 | O(rows × cols × 2) | O(1) | 枚举所有可能移动 |
| 分数计算 | O(1) | O(1) | 常数时间计算 |
| 动画计算 | O(animations) | O(1) | 实时动画参数 |

## 🎮 测试命令

```bash
# 运行消除类游戏算法测试
npm run test-match3
```

## 🎯 核心特性总结

✅ **完整的匹配检测系统** - 支持水平、垂直、L形匹配
✅ **智能消除和重力系统** - 处理连锁反应和重力下落
✅ **精确的分数计算** - 支持连击、连锁、特殊效果
✅ **AI提示系统** - 提供最佳移动建议
✅ **关卡生成器** - 生成平衡的游戏布局
✅ **动画系统** - 支持消除、下落、特效动画
✅ **边界情况处理** - 处理僵局、空网格等特殊情况

这个消除类游戏算法集合提供了构建完整Match-3游戏所需的所有核心功能，可以直接用于实际游戏开发！🎮✨
