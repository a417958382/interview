import {
  GameMap,
  AStarPathfinder,
  FiniteStateMachine,
  BehaviorTree,
  SequenceNode,
  SelectorNode,
  ActionNode,
  ConditionNode,
  ResourceOptimizer,
  CombatCalculator,
  MarketAlgorithm,
  TerrainType,
  UnitType,
  BuildingType
} from './slg-game-algorithms.js';

/**
 * 测试SLG游戏算法
 */
function testSLGGameAlgorithms() {
  console.log('🏰 SLG游戏算法测试\n');

  // 测试地图和路径寻找
  console.log('=== 地图和路径寻找测试 ===');
  const gameMap = new GameMap(10, 10);

  // 设置一些地形
  gameMap.setTerrain(2, 2, TerrainType.MOUNTAIN);
  gameMap.setTerrain(3, 3, TerrainType.WATER);
  gameMap.setTerrain(4, 4, TerrainType.FOREST);
  gameMap.setTerrain(1, 1, TerrainType.ROAD);

  console.log('地图创建完成，包含山地、水域、森林和道路');

  // 测试移动成本
  const infantryCost = gameMap.getMovementCost(2, 2, UnitType.INFANTRY);
  const cavalryCost = gameMap.getMovementCost(2, 2, UnitType.CAVALRY);
  console.log(`步兵经过山地成本: ${infantryCost}, 骑兵: ${cavalryCost}`);

  // 测试A*路径寻找
  const path = AStarPathfinder.findPath(gameMap, 0, 0, 7, 7, UnitType.INFANTRY);
  if (path) {
    console.log(`找到路径，长度: ${path.length} 步`);
    console.log(`路径点: ${path.slice(0, 5).map(p => `(${p.x},${p.y})`).join(' → ')}...`);
  } else {
    console.log('未找到路径');
  }

  // 测试有限状态机
  console.log('\n=== AI状态机测试 ===');
  const fsm = new FiniteStateMachine('idle');

  // 添加状态
  fsm.addState('idle', {
    enter: () => console.log('进入空闲状态'),
    update: (deltaTime) => {
      // 模拟状态更新
    },
    exit: () => console.log('退出空闲状态')
  });

  fsm.addState('moving', {
    enter: () => console.log('进入移动状态'),
    update: (deltaTime) => {
      // 模拟移动逻辑
    }
  });

  fsm.addState('attacking', {
    enter: () => console.log('进入攻击状态')
  });

  // 添加状态转换
  let moveTimer = 0;
  fsm.addTransition('idle', 'moving', () => {
    moveTimer++;
    return moveTimer > 2; // 2秒后开始移动
  });

  fsm.addTransition('moving', 'attacking', () => {
    return Math.random() < 0.1; // 10%概率开始攻击
  });

  // 模拟状态机运行
  console.log('状态机初始状态:', fsm.getCurrentState());
  for (let i = 0; i < 5; i++) {
    fsm.update(1); // 1秒更新
    console.log(`第${i + 1}秒后状态:`, fsm.getCurrentState());
  }

  // 测试行为树
  console.log('\n=== 行为树测试 ===');
  const root = new SequenceNode();

  // 创建条件节点
  const hasTarget = new ConditionNode(() => {
    console.log('  检查是否有目标');
    return Math.random() > 0.5;
  });

  const isHealthy = new ConditionNode(() => {
    console.log('  检查是否健康');
    return Math.random() > 0.3;
  });

  // 创建动作节点
  const moveToTarget = new ActionNode(() => {
    console.log('  执行移动到目标');
    return Math.random() > 0.2 ?
      require('./slg-game-algorithms.js').BehaviorStatus.SUCCESS :
      require('./slg-game-algorithms.js').BehaviorStatus.RUNNING;
  });

  const attackTarget = new ActionNode(() => {
    console.log('  执行攻击目标');
    return require('./slg-game-algorithms.js').BehaviorStatus.SUCCESS;
  });

  const retreat = new ActionNode(() => {
    console.log('  执行撤退');
    return require('./slg-game-algorithms.js').BehaviorStatus.SUCCESS;
  });

  // 构建行为树
  root.addChild(hasTarget);
  root.addChild(isHealthy);
  root.addChild(moveToTarget);
  root.addChild(attackTarget);

  // 备选行为
  const alternative = new SequenceNode();
  alternative.addChild(retreat);

  const selector = new SelectorNode();
  selector.addChild(root);
  selector.addChild(alternative);

  const behaviorTree = new BehaviorTree(selector);

  console.log('执行行为树:');
  const result = behaviorTree.execute();
  console.log(`行为树执行结果: ${result}`);

  // 测试资源优化
  console.log('\n=== 资源优化测试 ===');

  const resources = { food: 100, wood: 50, stone: 30, iron: 20 };
  const requirements = [
    { resource: 'food', amount: 30, priority: 10, minAllocation: 10 },
    { resource: 'wood', amount: 40, priority: 8, minAllocation: 15 },
    { resource: 'stone', amount: 25, priority: 6, minAllocation: 5 },
    { resource: 'iron', amount: 15, priority: 9, minAllocation: 8 }
  ];

  const allocation = ResourceOptimizer.optimizeResourceAllocation(resources, requirements);
  console.log('资源分配结果:');
  Object.entries(allocation).forEach(([resource, amount]) => {
    console.log(`  ${resource}: ${amount}`);
  });

  // 测试背包优化
  const items = [
    { name: 'sword', value: 60, weight: 10, quantity: 3 },
    { name: 'shield', value: 100, weight: 20, quantity: 2 },
    { name: 'helmet', value: 120, weight: 30, quantity: 1 },
    { name: 'boots', value: 80, weight: 15, quantity: 2 }
  ];

  const knapsackResult = ResourceOptimizer.knapsackOptimization(items, 50);
  console.log('\n背包优化结果 (容量50):');
  knapsackResult.forEach(item => {
    console.log(`  ${item.name}: ${item.quantity}个, 总价值${item.totalValue}`);
  });

  // 测试战斗系统
  console.log('\n=== 战斗系统测试 ===');

  const attacker = {
    attack: 50,
    level: 3,
    type: UnitType.INFANTRY,
    terrainBonus: 0.1
  };

  const defender = {
    defense: 30,
    level: 2,
    type: UnitType.ARCHER,
    terrainBonus: 0.2
  };

  const damage = CombatCalculator.calculateBaseDamage(attacker, defender, {
    criticalHit: true,
    flanking: true,
    weather: 1.1,
    morale: 0.9
  });

  console.log(`战斗伤害计算: ${damage} (步兵vs弓箭手，暴击+侧翼攻击)`);

  // 测试经济系统
  console.log('\n=== 经济系统测试 ===');

  // 测试供需平衡价格
  const equilibriumPrice = MarketAlgorithm.calculateEquilibriumPrice(
    100,  // 供给
    80,   // 需求
    10,   // 基础价格
    0.5   // 弹性系数
  );
  console.log(`供需平衡价格: ${equilibriumPrice.toFixed(2)} (供给100, 需求80, 基础价格10)`);

  // 测试贸易优化
  const startCity = {
    resources: { food: 50, wood: 30, stone: 20 },
    prices: { food: 2, wood: 3, stone: 4 }
  };

  const endCity = {
    resources: { food: 20, wood: 60, stone: 40 },
    prices: { food: 3, wood: 2, stone: 5 }
  };

  const tradeResult = MarketAlgorithm.calculateTradeProfit(
    startCity,
    endCity,
    25,  // 运输容量
    5    // 运输成本
  );

  console.log('\n贸易路线优化结果:');
  tradeResult.profitableTrades.forEach(trade => {
    console.log(`  贸易${trade.resource}: ${trade.quantity}单位, 利润${trade.profit.toFixed(1)}, 利润率${(trade.profitMargin * 100).toFixed(1)}%`);
  });
  console.log(`  总利润: ${tradeResult.totalProfit.toFixed(1)}`);

  // 测试建筑优化
  console.log('\n=== 建筑优化测试 ===');

  const buildings: Array<{
    type: BuildingType,
    level: number,
    production: Record<string, number>,
    cost: Record<string, number>
  }> = [
    {
      type: BuildingType.FARM,
      level: 1,
      production: { food: 10 },
      cost: { wood: 20, stone: 10 }
    },
    {
      type: BuildingType.MINE,
      level: 1,
      production: { stone: 8, iron: 2 },
      cost: { wood: 15, food: 10 }
    },
    {
      type: BuildingType.BARRACKS,
      level: 1,
      production: { soldiers: 5 },
      cost: { wood: 30, stone: 20, iron: 5 }
    }
  ];

  const availableResources = { wood: 50, stone: 30, food: 40, iron: 10 };

  const buildResult = MarketAlgorithm.optimizeResourceProduction(
    buildings,
    availableResources,
    30  // 30天时间跨度
  );

  console.log('建筑优化结果 (30天):');
  console.log(`  建造顺序: ${buildResult.buildOrder.join(' → ')}`);
  console.log('  总生产:');
  Object.entries(buildResult.totalProduction).forEach(([resource, amount]) => {
    console.log(`    ${resource}: ${amount}`);
  });
  console.log(`  净利润: ${buildResult.netProfit.toFixed(1)}`);

  // 测试边界情况
  console.log('\n=== 边界情况测试 ===');

  // 测试地图边界
  const boundaryTest = AStarPathfinder.findPath(gameMap, 0, 0, 9, 9, UnitType.INFANTRY);
  console.log(`地图边界路径: ${boundaryTest ? '找到' : '未找到'}`);

  // 测试不可通行地形
  console.log('正在测试水域阻挡路径...');
  const blockedPath = AStarPathfinder.findPath(gameMap, 0, 0, 3, 3, UnitType.INFANTRY);
  console.log(`水域阻挡路径: ${blockedPath ? '找到' : '未找到'}`);

  // 测试空资源分配
  const emptyAllocation = ResourceOptimizer.optimizeResourceAllocation({}, []);
  console.log(`空资源分配: ${Object.keys(emptyAllocation).length === 0 ? '正常' : '异常'}`);

  console.log('\n✅ SLG游戏算法测试完成！');

  // 总结
  console.log('\n📊 算法性能总结:');
  console.log('• A*路径寻找: 高效处理复杂地形');
  console.log('• 状态机: O(1)时间复杂度的AI决策');
  console.log('• 行为树: 灵活的AI行为组织');
  console.log('• 资源优化: 贪心算法的实用平衡');
  console.log('• 战斗计算: 实时伤害和战术评估');
  console.log('• 经济模拟: 动态价格和贸易优化');
}

// 运行测试
testSLGGameAlgorithms();
