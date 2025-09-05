import {
  GameGrid,
  MatchDetector,
  EliminationSystem,
  ScoreCalculator,
  HintSystem,
  LevelGenerator,
  AnimationSystem,
  GemType
} from './match3-game-algorithms.js';

/**
 * 测试消除类游戏算法
 */
function testMatch3GameAlgorithms() {
  console.log('🎮 消除类游戏算法测试\n');

  // 创建游戏网格
  const grid = new GameGrid(8, 8);

  // 初始化测试网格
  initializeTestGrid(grid);

  console.log('=== 初始游戏网格 ===');
  printGrid(grid);

  // 测试匹配检测
  console.log('\n=== 匹配检测测试 ===');
  const matches = MatchDetector.findAllMatches(grid);
  console.log(`找到 ${matches.length} 个匹配:`);
  matches.forEach((match, index) => {
    console.log(`  匹配 ${index + 1}: 位置(${match.row}, ${match.col}), 长度${match.length}, 类型${match.type}`);
  });

  // 测试消除系统
  console.log('\n=== 消除和重力测试 ===');
  const eliminatedGems = EliminationSystem.eliminateMatches(grid, matches);
  console.log(`消除了 ${eliminatedGems.length} 个宝石`);

  console.log('消除后的网格:');
  printGrid(grid);

  // 应用重力
  const gravityMoves = EliminationSystem.applyGravity(grid);
  console.log(`重力移动了 ${gravityMoves.length} 个宝石`);

  console.log('重力后的网格:');
  printGrid(grid);

  // 生成新宝石
  const emptyCells = countEmptyCells(grid);
  if (emptyCells > 0) {
    const newGems = EliminationSystem.generateNewGems(grid, emptyCells);
    console.log(`生成了 ${newGems.length} 个新宝石`);
  }

  console.log('最终网格:');
  printGrid(grid);

  // 测试分数计算
  console.log('\n=== 分数计算测试 ===');
  const baseScore = ScoreCalculator.calculateBaseScore(4, GemType.RED, 1.5, 2.0);
  console.log(`4个红色宝石匹配分数: ${baseScore}`);

  const comboBonus = ScoreCalculator.calculateComboBonus(5);
  console.log(`5连击奖励倍率: ${comboBonus.toFixed(2)}x`);

  const chainBonus = ScoreCalculator.calculateChainBonus(3);
  console.log(`3级连锁奖励倍率: ${chainBonus.toFixed(2)}x`);

  const specialScore = ScoreCalculator.calculateSpecialEffectScore(GemType.SPECIAL_BOMB, 9, 2.0);
  console.log(`炸弹特效分数 (影响9个): ${specialScore}`);

  // 测试AI提示系统
  console.log('\n=== AI提示系统测试 ===');
  const hintGrid = createHintTestGrid();
  const possibleMoves = HintSystem.findPossibleMoves(hintGrid);

  console.log(`找到 ${possibleMoves.length} 个可能的移动:`);
  possibleMoves.slice(0, 3).forEach((move, index) => {
    console.log(`  移动 ${index + 1}: (${move.fromRow}, ${move.fromCol}) → (${move.toRow}, ${move.toCol}), 分数: ${move.score}`);
  });

  const bestHint = HintSystem.getBestHint(hintGrid);
  if (bestHint) {
    console.log(`最佳提示: (${bestHint.fromRow}, ${bestHint.fromCol}) → (${bestHint.toRow}, ${bestHint.toCol})`);
  }

  // 测试关卡生成
  console.log('\n=== 关卡生成测试 ===');
  const easyLevel = LevelGenerator.generateValidLevel(6, 6, 'easy');
  console.log('简单关卡生成结果:');
  printGrid(easyLevel);

  const objectives = LevelGenerator.generateObjectives('medium');
  console.log('\n中等难度关卡目标:');
  console.log(`  目标分数: ${objectives.targetScore}`);
  console.log(`  移动次数限制: ${objectives.movesLimit}`);
  console.log(`  时间限制: ${objectives.timeLimit}秒`);
  console.log('  特殊目标:');
  objectives.specialObjectives.forEach(obj => {
    console.log(`    ${obj.type}: ${obj.count}`);
  });

  // 测试动画系统
  console.log('\n=== 动画系统测试 ===');
  const testEliminated = [
    { row: 0, col: 0, type: GemType.RED },
    { row: 0, col: 1, type: GemType.RED },
    { row: 0, col: 2, type: GemType.RED }
  ];

  const eliminationAnimations = AnimationSystem.calculateEliminationAnimation(testEliminated, 0.5);
  console.log('消除动画序列:');
  eliminationAnimations.forEach((anim, index) => {
    console.log(`  动画 ${index + 1}: ${anim.animationType} 类型, ${anim.startTime.toFixed(2)}s - ${anim.endTime.toFixed(2)}s`);
  });

  const chainEffect = AnimationSystem.calculateChainEffect(3, { row: 2, col: 2 });
  console.log('\n3级连锁特效:');
  console.log(`  粒子数量: ${chainEffect.particleCount}`);
  console.log(`  扩散半径: ${chainEffect.spreadRadius}`);
  console.log(`  持续时间: ${chainEffect.duration}秒`);

  // 测试连锁反应
  console.log('\n=== 连锁反应测试 ===');
  const chainGrid = createChainTestGrid();
  console.log('连锁测试网格:');
  printGrid(chainGrid);

  const chainResult = EliminationSystem.processChainReactions(chainGrid);
  console.log('\n连锁反应结果:');
  console.log(`  总消除数量: ${chainResult.totalEliminated}`);
  console.log(`  连锁次数: ${chainResult.chainCount}`);
  console.log(`  最大连锁长度: ${chainResult.maxChainLength}`);

  console.log('\n最终连锁网格:');
  printGrid(chainGrid);

  // 测试边界情况
  console.log('\n=== 边界情况测试 ===');

  // 空网格
  const emptyGrid = new GameGrid(3, 3);
  console.log('空网格测试:');
  const emptyMatches = MatchDetector.findAllMatches(emptyGrid);
  console.log(`  匹配数量: ${emptyMatches.length}`);

  // 单色网格
  const uniformGrid = new GameGrid(3, 3);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      uniformGrid.set(row, col, GemType.RED);
    }
  }
  console.log('单色网格测试:');
  const uniformMatches = MatchDetector.findAllMatches(uniformGrid);
  console.log(`  匹配数量: ${uniformMatches.length}`);

  // 特殊元素网格
  const specialGrid = new GameGrid(3, 3);
  specialGrid.set(0, 0, GemType.SPECIAL_BOMB);
  specialGrid.set(0, 1, GemType.SPECIAL_LINE);
  specialGrid.set(0, 2, GemType.SPECIAL_COLOR);
  console.log('特殊元素网格:');
  printGrid(specialGrid);

  console.log('\n✅ 消除类游戏算法测试完成！');

  // 总结
  console.log('\n📊 算法性能总结:');
  console.log('• 匹配检测: O(rows × cols) - 快速扫描');
  console.log('• 消除处理: O(matched_cells) - 线性操作');
  console.log('• 重力系统: O(rows × cols) - 网格遍历');
  console.log('• AI提示: O(rows × cols × 2) - 枚举可能移动');
  console.log('• 动画计算: O(animations) - 实时计算');
  console.log('• 分数计算: O(1) - 常数时间');
}

// 辅助函数
function initializeTestGrid(grid: GameGrid): void {
  // 创建一个有明确匹配的测试网格
  const testLayout = [
    [GemType.RED, GemType.RED, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE],
    [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN],
    [GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE],
    [GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW],
    [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
    [GemType.BLUE, GemType.GREEN, GemType.BLUE, GemType.BLUE, GemType.BLUE, GemType.RED, GemType.BLUE, GemType.GREEN],
    [GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE],
    [GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW]
  ];

  for (let row = 0; row < testLayout.length; row++) {
    for (let col = 0; col < testLayout[row].length; col++) {
      grid.set(row, col, testLayout[row][col]);
    }
  }
}

function createHintTestGrid(): GameGrid {
  const grid = new GameGrid(5, 5);
  // 创建一个有潜在匹配的网格
  const layout = [
    [GemType.RED, GemType.BLUE, GemType.RED, GemType.GREEN, GemType.YELLOW],
    [GemType.BLUE, GemType.RED, GemType.BLUE, GemType.YELLOW, GemType.PURPLE],
    [GemType.RED, GemType.GREEN, GemType.RED, GemType.BLUE, GemType.ORANGE],
    [GemType.YELLOW, GemType.PURPLE, GemType.GREEN, GemType.RED, GemType.BLUE],
    [GemType.PURPLE, GemType.ORANGE, GemType.YELLOW, GemType.GREEN, GemType.RED]
  ];

  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      grid.set(row, col, layout[row][col]);
    }
  }

  return grid;
}

function createChainTestGrid(): GameGrid {
  const grid = new GameGrid(6, 6);
  // 创建一个会产生连锁反应的网格
  const layout = [
    [GemType.RED, GemType.RED, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW],
    [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED],
    [GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN],
    [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE],
    [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED],
    [GemType.RED, GemType.RED, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW]
  ];

  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      grid.set(row, col, layout[row][col]);
    }
  }

  return grid;
}

function printGrid(grid: GameGrid): void {
  console.log('┌' + '───┬'.repeat(grid['cols'] - 1) + '───┐');

  for (let row = 0; row < grid['rows']; row++) {
    let rowStr = '│';
    for (let col = 0; col < grid['cols']; col++) {
      const gem = grid.get(row, col);
      const symbol = getGemSymbol(gem);
      rowStr += ` ${symbol} │`;
    }
    console.log(rowStr);

    if (row < grid['rows'] - 1) {
      console.log('├' + '───┼'.repeat(grid['cols'] - 1) + '───┤');
    }
  }

  console.log('└' + '───┴'.repeat(grid['cols'] - 1) + '───┘');
}

function getGemSymbol(gem: GemType): string {
  const symbols = {
    [GemType.RED]: '🔴',
    [GemType.BLUE]: '🔵',
    [GemType.GREEN]: '🟢',
    [GemType.YELLOW]: '🟡',
    [GemType.PURPLE]: '🟣',
    [GemType.ORANGE]: '🟠',
    [GemType.SPECIAL_BOMB]: '💣',
    [GemType.SPECIAL_LINE]: '📏',
    [GemType.SPECIAL_COLOR]: '🌈',
    [GemType.EMPTY]: '⬜'
  };

  return symbols[gem] || '❓';
}

function countEmptyCells(grid: GameGrid): number {
  let count = 0;
  for (let row = 0; row < grid['rows']; row++) {
    for (let col = 0; col < grid['cols']; col++) {
      if (grid.get(row, col) === GemType.EMPTY) {
        count++;
      }
    }
  }
  return count;
}

// 运行测试
testMatch3GameAlgorithms();
