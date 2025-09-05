// 实时战斗系统测试文件
// Real-time Combat System Test File

import { createExampleCombatSystem, RealTimeCombatManager, CombatState } from './realtime-combat-system';

function testRealTimeCombatSystem(): void {
  console.log('🗡️ 实时战斗系统测试开始...\n');

  // 创建战斗系统
  const combatSystem = createExampleCombatSystem();

  // 获取单位
  const playerUnit1 = combatSystem.getUnit('player_1')!;
  const enemyUnit1 = combatSystem.getUnit('enemy_1')!;
  const playerUnit2 = combatSystem.getUnit('player_2')!;
  const enemyUnit2 = combatSystem.getUnit('enemy_2')!;

  console.log('📊 初始状态:');
  console.log(`玩家步兵: 生命 ${playerUnit1.health}/${playerUnit1.maxHealth}, 状态: ${playerUnit1.combatState}`);
  console.log(`敌方步兵: 生命 ${enemyUnit1.health}/${enemyUnit1.maxHealth}, 状态: ${enemyUnit1.combatState}`);
  console.log();

  // 模拟战斗过程
  let battleTime = 0;
  const maxTime = 5000; // 5秒战斗
  const updateInterval = 100; // 100ms更新

  console.log('⚔️ 开始战斗模拟...\n');

  while (battleTime < maxTime) {
    // 更新战斗系统
    combatSystem.update(updateInterval);
    battleTime += updateInterval;

    // 每秒输出状态
    if (battleTime % 1000 === 0) {
      console.log(`⏰ ${battleTime / 1000}秒后状态:`);
      console.log(`玩家步兵: 生命 ${playerUnit1.health}/${playerUnit1.maxHealth}, 状态: ${playerUnit1.combatState}`);
      console.log(`敌方步兵: 生命 ${enemyUnit1.health}/${enemyUnit1.maxHealth}, 状态: ${enemyUnit1.combatState}`);

      // 显示威胁值
      console.log('威胁表:');
      playerUnit1.threatTable.forEach((threat, targetId) => {
        console.log(`  玩家对 ${targetId}: ${threat}`);
      });
      enemyUnit1.threatTable.forEach((threat, targetId) => {
        console.log(`  敌人对 ${targetId}: ${threat}`);
      });

      console.log(`活跃战斗数量: ${combatSystem.getActiveCombats().length}`);
      console.log();
    }

    // 检查是否有单位死亡
    if (!playerUnit1.isAlive() || !enemyUnit1.isAlive()) {
      break;
    }
  }

  // 战斗结果
  console.log('🏁 战斗结束!');
  console.log(`玩家步兵: ${playerUnit1.isAlive() ? '存活' : '死亡'} (生命: ${playerUnit1.health})`);
  console.log(`敌方步兵: ${enemyUnit1.isAlive() ? '存活' : '死亡'} (生命: ${enemyUnit1.health})`);
  console.log();

  // 测试1对多战斗
  console.log('👥 测试1对多战斗...\n');

  console.log('初始位置和距离:');
  console.log(`玩家弓箭手位置: (${playerUnit2.position.x}, ${playerUnit2.position.y})`);
  console.log(`敌方骑兵位置: (${enemyUnit2.position.x}, ${enemyUnit2.position.y})`);
  console.log(`距离: ${playerUnit2.getDistanceTo(enemyUnit2).toFixed(2)}`);
  console.log(`弓箭手射程: ${playerUnit2.attackRange}`);
  console.log();

  // 移动单位到射程内
  enemyUnit2.position = { x: 130, y: 110 };
  console.log('移动敌方骑兵到射程内...');
  console.log(`新距离: ${playerUnit2.getDistanceTo(enemyUnit2).toFixed(2)}`);
  console.log();

  // 减少攻击间隔来加速战斗
  playerUnit2.attackCooldown = 500; // 0.5秒
  enemyUnit2.attackCooldown = 500; // 0.5秒

  // 继续战斗
  let multiBattleTime = 0;
  const multiMaxTime = 10000; // 10秒战斗

  console.log('⚔️ 加速战斗测试 (0.5秒攻击间隔)...\n');

  while (multiBattleTime < multiMaxTime) {
    combatSystem.update(updateInterval);
    multiBattleTime += updateInterval;

    if (multiBattleTime % 2000 === 0) { // 每2秒输出
      console.log(`⏰ ${multiBattleTime / 1000}秒后多单位状态:`);
      console.log(`玩家弓箭手: 生命 ${playerUnit2.health}/${playerUnit2.maxHealth}, 状态: ${playerUnit2.combatState}`);
      console.log(`敌方骑兵: 生命 ${enemyUnit2.health}/${enemyUnit2.maxHealth}, 状态: ${enemyUnit2.combatState}`);
      console.log(`玩家步兵: 生命 ${playerUnit1.health}/${playerUnit1.maxHealth}, 状态: ${playerUnit1.combatState}`);
      console.log(`敌方步兵: 生命 ${enemyUnit1.health}/${enemyUnit1.maxHealth}, 状态: ${enemyUnit1.combatState}`);
      console.log(`活跃战斗数量: ${combatSystem.getActiveCombats().length}`);
      console.log();
    }

    // 检查是否全部死亡
    if (!playerUnit1.isAlive() && !playerUnit2.isAlive()) {
      console.log('❌ 玩家部队全灭!');
      break;
    }
    if (!enemyUnit1.isAlive() && !enemyUnit2.isAlive()) {
      console.log('✅ 敌方部队全灭!');
      break;
    }
  }

  console.log('🎯 多单位战斗结束!');
  console.log(`玩家存活单位: ${[playerUnit1, playerUnit2].filter(u => u.isAlive()).length}/2`);
  console.log(`敌方存活单位: ${[enemyUnit1, enemyUnit2].filter(u => u.isAlive()).length}/2`);
}

// 运行测试
if (require.main === module) {
  testRealTimeCombatSystem();
}

export { testRealTimeCombatSystem };