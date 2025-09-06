// 空间索引策略测试文件
// Spatial Index Strategies Test File

import {
  RealTimeCombatManager,
  SpatialIndexStrategy,
  ExampleUnit,
  Faction,
  UnitType,
  Position
} from './realtime-combat-system';

function generateTestUnits(count: number, mapSize: number = 10000): ExampleUnit[] {
  const units: ExampleUnit[] = [];

  for (let i = 0; i < count; i++) {
    const position: Position = {
      x: Math.random() * mapSize,
      y: Math.random() * mapSize
    };

    const faction = i % 2 === 0 ? Faction.PLAYER : Faction.ENEMY;
    const unitType = i % 3 === 0 ? UnitType.INFANTRY :
                    i % 3 === 1 ? UnitType.ARCHER : UnitType.CAVALRY;

    const unit = new ExampleUnit(
      `unit_${i}`,
      `Unit ${i}`,
      position,
      faction,
      unitType,
      100, // health
      100, // maxHealth
      20,  // attack
      10,  // defense
      50,  // attackRange
      5    // movementSpeed
    );

    units.push(unit);
  }

  return units;
}

function testSpatialStrategy(strategy: SpatialIndexStrategy, unitCount: number): any {
  console.log(`\n🧪 测试 ${strategy} 策略 (${unitCount} 个单位)`);
  console.log('='.repeat(50));

  // 创建战斗管理器
  const combatManager = new RealTimeCombatManager(strategy);

  // 生成测试单位
  const testUnits = generateTestUnits(unitCount);

  // 添加单位到战斗系统
  const startTime = Date.now();
  for (const unit of testUnits) {
    combatManager.addUnit(unit);
  }
  const addTime = Date.now() - startTime;

  // 测试范围查询性能
  const queryPosition: Position = { x: 5000, y: 5000 };
  const queryRange = 1000;

  const queryStartTime = Date.now();
  const unitsInRange = combatManager.getUnitsInRange(queryPosition, queryRange);
  const queryTime = Date.now() - queryStartTime;

  // 测试战斗检测性能
  const combatStartTime = Date.now();
  const potentialCombats = combatManager.getPotentialCombats();
  const combatTime = Date.now() - combatStartTime;

  // 结果统计
  const stats = {
    strategy,
    unitCount,
    addTime,
    queryTime,
    combatTime,
    unitsInRange: unitsInRange.length,
    potentialCombats: potentialCombats.size
  };

  console.log(`✅ 添加单位耗时: ${addTime}ms`);
  console.log(`✅ 范围查询耗时: ${queryTime}ms (${unitsInRange.length} 个单位)`);
  console.log(`✅ 战斗检测耗时: ${combatTime}ms (${potentialCombats.size} 个潜在战斗)`);

  return stats;
}

function runPerformanceComparison(): void {
  console.log('🚀 空间索引策略性能对比测试');
  console.log('=====================================');

  const strategies = [
    SpatialIndexStrategy.UNIFORM_GRID,
    SpatialIndexStrategy.QUAD_TREE,
    SpatialIndexStrategy.HIERARCHICAL,
    SpatialIndexStrategy.ADAPTIVE
  ];

  const unitCounts = [100, 500, 1000, 2000];

  const results: any[] = [];

  for (const unitCount of unitCounts) {
    console.log(`\n📊 测试单位数量: ${unitCount}`);
    console.log('-'.repeat(30));

    for (const strategy of strategies) {
      try {
        const result = testSpatialStrategy(strategy, unitCount);
        results.push(result);
      } catch (error) {
        console.log(`❌ ${strategy} 策略测试失败: ${error}`);
      }
    }
  }

  // 打印性能对比总结
  printPerformanceSummary(results);
}

function printPerformanceSummary(results: any[]): void {
  console.log('\n📈 性能对比总结');
  console.log('==================');

  // 按策略分组统计
  const strategyStats: { [key: string]: any[] } = {};

  for (const result of results) {
    if (!strategyStats[result.strategy]) {
      strategyStats[result.strategy] = [];
    }
    strategyStats[result.strategy].push(result);
  }

  for (const [strategy, stats] of Object.entries(strategyStats)) {
    console.log(`\n🎯 ${strategy}:`);
    const avgAddTime = stats.reduce((sum, s) => sum + s.addTime, 0) / stats.length;
    const avgQueryTime = stats.reduce((sum, s) => sum + s.queryTime, 0) / stats.length;
    const avgCombatTime = stats.reduce((sum, s) => sum + s.combatTime, 0) / stats.length;

    console.log(`  平均添加时间: ${avgAddTime.toFixed(2)}ms`);
    console.log(`  平均查询时间: ${avgQueryTime.toFixed(2)}ms`);
    console.log(`  平均战斗检测时间: ${avgCombatTime.toFixed(2)}ms`);
  }
}

function testStrategySwitching(): void {
  console.log('\n🔄 测试策略切换功能');
  console.log('====================');

  const combatManager = new RealTimeCombatManager(SpatialIndexStrategy.UNIFORM_GRID);

  // 添加一些测试单位
  const testUnits = generateTestUnits(200);
  for (const unit of testUnits) {
    combatManager.addUnit(unit);
  }

  console.log(`初始策略: ${combatManager.getCurrentSpatialStrategy()}`);

  // 测试切换到四叉树
  console.log('切换到四叉树策略...');
  combatManager.switchSpatialStrategy(SpatialIndexStrategy.QUAD_TREE);
  console.log(`当前策略: ${combatManager.getCurrentSpatialStrategy()}`);

  // 测试范围查询
  const unitsInRange = combatManager.getUnitsInRange({ x: 5000, y: 5000 }, 1000);
  console.log(`范围查询结果: ${unitsInRange.length} 个单位`);

  // 测试切换到分层网格
  console.log('切换到分层网格策略...');
  combatManager.switchSpatialStrategy(SpatialIndexStrategy.HIERARCHICAL);
  console.log(`当前策略: ${combatManager.getCurrentSpatialStrategy()}`);

  // 测试切换到自适应网格
  console.log('切换到自适应网格策略...');
  combatManager.switchSpatialStrategy(SpatialIndexStrategy.ADAPTIVE);
  console.log(`当前策略: ${combatManager.getCurrentSpatialStrategy()}`);

  // 获取性能统计
  const stats = combatManager.getSpatialPerformanceStats();
  console.log('性能统计:', stats);
}

// 主测试函数
function runAllTests(): void {
  console.log('🎮 空间索引策略完整测试套件');
  console.log('==============================\n');

  // 运行性能对比测试
  runPerformanceComparison();

  // 运行策略切换测试
  testStrategySwitching();

  console.log('\n✅ 所有测试完成！');
}

// 导出测试函数
export { runAllTests, testSpatialStrategy, runPerformanceComparison, testStrategySwitching };

// 如果直接运行此文件，执行测试
if (require.main === module) {
  runAllTests();
}
