import {
  Vector2D,
  CollisionDetector,
  TrajectoryCalculator,
  FishAI,
  DropRateCalculator,
  ScoreCalculator,
  ItemEffectCalculator,
  NetworkSynchronization,
  ParticleSystem
} from './fishing-game-algorithms.js';

/**
 * 测试捕鱼游戏算法
 */
function testFishingGameAlgorithms() {
  console.log('🎮 捕鱼游戏算法测试\n');

  // 测试向量运算
  console.log('=== 向量运算测试 ===');
  const v1 = new Vector2D(3, 4);
  const v2 = new Vector2D(1, 2);

  console.log(`向量 v1: (${v1.x}, ${v1.y})`);
  console.log(`向量 v2: (${v2.x}, ${v2.y})`);
  console.log(`v1 + v2: ${v1.add(v2).x}, ${v1.add(v2).y}`);
  console.log(`v1 长度: ${v1.magnitude()}`);
  console.log(`v1 标准化: ${v1.normalize().x.toFixed(3)}, ${v1.normalize().y.toFixed(3)}`);
  console.log(`两点距离: ${Vector2D.distance(v1, v2).toFixed(3)}`);

  // 测试碰撞检测
  console.log('\n=== 碰撞检测测试 ===');
  const pos1 = new Vector2D(0, 0);
  const pos2 = new Vector2D(3, 4);

  console.log(`圆形碰撞 (半径1): ${CollisionDetector.circleCollision(pos1, 1, pos2, 1)}`);
  console.log(`圆形碰撞 (半径2): ${CollisionDetector.circleCollision(pos1, 2, pos2, 2)}`);
  console.log(`矩形碰撞: ${CollisionDetector.rectangleCollision(pos1, 2, 2, pos2, 2, 2)}`);

  // 测试弹道轨迹
  console.log('\n=== 弹道轨迹测试 ===');
  const startPos = new Vector2D(0, 0);
  const initialVelocity = new Vector2D(10, 5);
  const gravity = 9.8;

  console.log('抛物线轨迹 (t=0.5s):');
  const parabolicPoint = TrajectoryCalculator.calculateParabolicPoint(startPos, initialVelocity, gravity, 0.5);
  console.log(`位置: (${parabolicPoint.x.toFixed(2)}, ${parabolicPoint.y.toFixed(2)})`);

  console.log('直线轨迹 (t=1.0s):');
  const linearPoint = TrajectoryCalculator.calculateLinearPoint(startPos, initialVelocity.normalize(), 10, 1.0);
  console.log(`位置: (${linearPoint.x.toFixed(2)}, ${linearPoint.y.toFixed(2)})`);

  // 测试鱼AI
  console.log('\n=== 鱼AI测试 ===');
  const fishPos = new Vector2D(0, 0);
  const targetPos = new Vector2D(10, 10);

  console.log('直线移动:');
  const linearMove = FishAI.calculateLinearPath(fishPos, targetPos, 5, 0.1);
  console.log(`移动向量: (${linearMove.x.toFixed(2)}, ${linearMove.y.toFixed(2)})`);

  console.log('随机游走:');
  const randomWalk = FishAI.calculateRandomWalk(fishPos, new Vector2D(1, 0), 5, Math.PI/4, 0.1);
  console.log(`新位置: (${randomWalk.position.x.toFixed(2)}, ${randomWalk.position.y.toFixed(2)})`);

  // 测试概率系统
  console.log('\n=== 概率系统测试 ===');

  // 暴击测试
  const criticalHits = [];
  for (let i = 0; i < 10; i++) {
    criticalHits.push(DropRateCalculator.calculateCriticalHit(0.2, 1.5, i * 0.1));
  }
  console.log(`暴击测试 (10次): ${criticalHits.filter(Boolean).length} 次暴击`);
  console.log(`暴击序列: ${criticalHits.map(h => h ? '✓' : '✗').join('')}`);

  // 掉落测试
  const dropTable = [
    { item: '金币', probability: 0.5, quantity: 10 },
    { item: '珍珠', probability: 0.3, quantity: 1 },
    { item: '钻石', probability: 0.2, quantity: 1 }
  ];
  const drops = DropRateCalculator.calculateMultipleDrops(dropTable, 5);
  console.log('多重掉落测试 (5次):');
  drops.forEach(drop => console.log(`  ${drop.item}: ${drop.quantity}`));

  // 测试分数计算
  console.log('\n=== 分数计算测试 ===');
  const baseScore = ScoreCalculator.calculateBaseScore(100, 2, 200, true, 1.5);
  console.log(`基础分数计算: ${baseScore} (鱼值:100, 子弹威力:2, 距离:200, 暴击:是, 连击:1.5x)`);

  const experience = ScoreCalculator.calculateExperience(1000, 5, 1.2);
  console.log(`经验值计算: ${experience} (分数:1000, 等级:5, 难度:1.2)`);

  const levelUpExp = ScoreCalculator.calculateLevelUpExperience(10);
  console.log(`10级升级所需经验: ${levelUpExp}`);

  // 测试道具效果
  console.log('\n=== 道具效果测试 ===');
  const weaponPower = ItemEffectCalculator.calculateWeaponMultiplier(100, 5, 'epic');
  console.log(`武器倍率: ${weaponPower.toFixed(1)} (基础:100, 等级:5, 稀有度:史诗)`);

  const buffEffect = ItemEffectCalculator.calculateBuffEffect(100, 'damage', 3, 10, 3);
  console.log(`Buff效果: ${buffEffect.toFixed(1)} (基础:100, 类型:伤害, 等级:3, 持续:10s, 已过:3s)`);

  // 测试网络同步
  console.log('\n=== 网络同步测试 ===');
  const currentPos = new Vector2D(100, 100);
  const velocity = new Vector2D(10, 5);

  const predictedPos = NetworkSynchronization.calculatePredictedPosition(
    currentPos, velocity, Date.now() - 100, Date.now(), 50
  );
  console.log(`预测位置: (${predictedPos.x.toFixed(1)}, ${predictedPos.y.toFixed(1)})`);

  // 插值测试
  const interpolatedPos = NetworkSynchronization.interpolatePosition(
    new Vector2D(0, 0), new Vector2D(100, 100), 0, 1000, 500, 'smooth'
  );
  console.log(`插值位置: (${interpolatedPos.x.toFixed(1)}, ${interpolatedPos.y.toFixed(1)})`);

  // 测试粒子系统
  console.log('\n=== 粒子系统测试 ===');
  const center = new Vector2D(50, 50);
  const particles = ParticleSystem.generateExplosionParticles(center, 8, 20, { min: 5, max: 15 });

  console.log(`爆炸粒子数量: ${particles.length}`);
  console.log('前3个粒子速度:');
  particles.slice(0, 3).forEach((p, i) => {
    console.log(`  粒子${i+1}: (${p.velocity.x.toFixed(1)}, ${p.velocity.y.toFixed(1)})`);
  });

  const particlePos = ParticleSystem.calculateParticlePosition(
    new Vector2D(0, 0), new Vector2D(10, 5), 9.8, 1.0, 3.0
  );
  console.log(`粒子位置 (t=1.0s): (${particlePos.x.toFixed(1)}, ${particlePos.y.toFixed(1)})`);

  // 测试鱼群行为
  console.log('\n=== 鱼群行为测试 ===');
  const fishPosition = new Vector2D(50, 50);
  const neighbors = [
    new Vector2D(45, 45),
    new Vector2D(55, 55),
    new Vector2D(60, 40)
  ];

  const schoolingForce = FishAI.calculateSchoolingBehavior(
    fishPosition,
    neighbors,
    10, 20, 30,
    { separation: 1.0, alignment: 0.5, cohesion: 0.3 }
  );

  console.log(`鱼群行为力: (${schoolingForce.x.toFixed(3)}, ${schoolingForce.y.toFixed(3)})`);

  // 测试贝塞尔曲线轨迹
  console.log('\n=== 贝塞尔曲线轨迹测试 ===');
  const p0 = new Vector2D(0, 0);
  const p1 = new Vector2D(50, 100);
  const p2 = new Vector2D(100, 0);

  console.log('贝塞尔曲线轨迹点:');
  for (let t = 0; t <= 1; t += 0.25) {
    const point = TrajectoryCalculator.calculateBezierPoint(t, p0, p1, p2);
    console.log(`  t=${t.toFixed(2)}: (${point.x.toFixed(1)}, ${point.y.toFixed(1)})`);
  }

  // 测试追踪弹道
  console.log('\n=== 追踪弹道测试 ===');
  const currentPos2 = new Vector2D(0, 0);
  const targetPos2 = new Vector2D(100, 100);
  const currentVelocity = new Vector2D(10, 0);
  const maxTurnRate = Math.PI / 4; // 45度每秒
  const projectileSpeed = 15;

  const homingVelocity = TrajectoryCalculator.calculateHomingTrajectory(
    currentPos2, targetPos2, currentVelocity, maxTurnRate, projectileSpeed, 0.1
  );

  console.log(`追踪速度: (${homingVelocity.x.toFixed(1)}, ${homingVelocity.y.toFixed(1)})`);
  console.log(`速度大小: ${homingVelocity.magnitude().toFixed(1)}`);

  // 测试连击奖励
  console.log('\n=== 连击奖励测试 ===');
  for (let combo = 1; combo <= 10; combo += 2) {
    const bonus = DropRateCalculator.calculateComboBonus(combo, 1.0, 0.1);
    console.log(`连击 ${combo}: ${bonus.toFixed(2)}x 倍率`);
  }

  // 测试时间奖励
  console.log('\n=== 时间奖励测试 ===');
  const timeBonuses = [3600, 7200, 14400, 86400]; // 1小时到24小时
  timeBonuses.forEach(seconds => {
    const bonus = DropRateCalculator.calculateTimeBonus(seconds, 100, 86400, 0.8);
    const hours = seconds / 3600;
    console.log(`${hours}小时离线奖励: ${Math.floor(bonus)} (基础率:100)`);
  });

  console.log('\n✅ 捕鱼游戏算法测试完成！');

  // 性能总结
  console.log('\n📊 算法性能总结:');
  console.log('• 向量运算: O(1) - 实时计算');
  console.log('• 碰撞检测: O(1) - 每帧检测');
  console.log('• 轨迹计算: O(1) - 流畅动画');
  console.log('• AI行为: O(n) - 鱼群规模相关');
  console.log('• 概率计算: O(1) - 快速响应');
  console.log('• 分数计算: O(1) - 即时反馈');
  console.log('• 网络同步: O(1) - 低延迟');
  console.log('• 粒子效果: O(m) - 特效复杂度相关');
}

// 运行测试
testFishingGameAlgorithms();
