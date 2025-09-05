# 捕鱼类游戏算法完全指南

## 🎮 捕鱼游戏的核心算法

捕鱼类游戏（如《捕鱼达人》）涉及多个算法领域，从物理引擎到AI，从概率系统到网络同步。本指南涵盖了捕鱼游戏开发中最常用的算法实现。

## 📐 物理引擎算法

### 向量运算基础
```typescript
import { Vector2D } from './fishing-game-algorithms.js';

// 创建向量
const position = new Vector2D(100, 200);
const velocity = new Vector2D(10, 5);

// 向量运算
const newPosition = position.add(velocity);
const distance = Vector2D.distance(position, new Vector2D(150, 250));
const direction = Vector2D.direction(position, new Vector2D(150, 250));
```

### 碰撞检测系统
```typescript
import { CollisionDetector } from './fishing-game-algorithms.js';

// 圆形碰撞检测（鱼和子弹）
const fishPos = new Vector2D(100, 100);
const bulletPos = new Vector2D(105, 105);
const collision = CollisionDetector.circleCollision(
  fishPos, 20,  // 鱼位置和半径
  bulletPos, 5  // 子弹位置和半径
);

// 矩形碰撞检测（UI元素）
const buttonCollision = CollisionDetector.rectangleCollision(
  new Vector2D(0, 0), 100, 50,     // 按钮位置和尺寸
  new Vector2D(50, 25), 10, 10     // 鼠标位置和尺寸
);
```

## 🚀 弹道轨迹算法

### 抛物线弹道（重力效果）
```typescript
import { TrajectoryCalculator } from './fishing-game-algorithms.js';

const startPos = new Vector2D(0, 0);
const velocity = new Vector2D(20, 15);
const gravity = 9.8;

// 计算0.5秒后的位置
const position = TrajectoryCalculator.calculateParabolicPoint(
  startPos, velocity, gravity, 0.5
);
console.log(`位置: (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`);
```

### 追踪弹道（智能导弹）
```typescript
const currentPos = new Vector2D(0, 0);
const targetPos = new Vector2D(100, 100);
const currentVelocity = new Vector2D(10, 0);

// 计算追踪速度
const homingVelocity = TrajectoryCalculator.calculateHomingTrajectory(
  currentPos, targetPos, currentVelocity,
  Math.PI / 4,  // 最大转向角度
  15,           // 速度
  0.016         // 时间步长
);
```

### 贝塞尔曲线轨迹（流畅路径）
```typescript
// 定义控制点
const p0 = new Vector2D(0, 0);
const p1 = new Vector2D(50, 100);  // 控制点
const p2 = new Vector2D(100, 0);

// 计算曲线上的点
for (let t = 0; t <= 1; t += 0.1) {
  const point = TrajectoryCalculator.calculateBezierPoint(t, p0, p1, p2);
  console.log(`t=${t}: (${point.x}, ${point.y})`);
}
```

## 🐠 鱼类AI算法

### 鱼的移动模式
```typescript
import { FishAI } from './fishing-game-algorithms.js';

// 直线移动
const linearMove = FishAI.calculateLinearPath(
  new Vector2D(0, 0),     // 当前位置
  new Vector2D(100, 100), // 目标位置
  5,                      // 速度
  0.016                   // 时间步长
);

// 随机游走
const randomWalk = FishAI.calculateRandomWalk(
  new Vector2D(50, 50),   // 当前位置
  new Vector2D(1, 0),     // 当前方向
  3,                      // 速度
  Math.PI / 6,            // 最大转向角度
  0.016                   // 时间步长
);
```

### 鱼群行为（Boids算法简化版）
```typescript
const fishPos = new Vector2D(50, 50);
const neighbors = [
  new Vector2D(45, 45),
  new Vector2D(55, 55),
  new Vector2D(60, 40)
];

const schoolingForce = FishAI.calculateSchoolingBehavior(
  fishPos,
  neighbors,
  10, 20, 30,  // 分离、对齐、内聚距离
  {
    separation: 1.0,
    alignment: 0.5,
    cohesion: 0.3
  }
);
```

## 🎲 概率系统算法

### 暴击概率计算
```typescript
import { DropRateCalculator } from './fishing-game-algorithms.js';

// 基础暴击率20%，幸运加成50%，连击奖励
const isCritical = DropRateCalculator.calculateCriticalHit(
  0.2,  // 基础概率
  1.5,  // 幸运加成
  0.1   // 连击奖励
);
```

### 多重掉落系统
```typescript
const dropTable = [
  { item: '金币', probability: 0.5, quantity: 10 },
  { item: '珍珠', probability: 0.3, quantity: 1 },
  { item: '钻石', probability: 0.2, quantity: 1 }
];

const drops = DropRateCalculator.calculateMultipleDrops(dropTable, 3);
// 结果: [{item: '金币', quantity: 20}, {item: '珍珠', quantity: 1}]
```

### 连击奖励系统
```typescript
for (let combo = 1; combo <= 10; combo++) {
  const multiplier = DropRateCalculator.calculateComboBonus(
    combo,     // 当前连击数
    1.0,       // 基础倍率
    0.1        // 增长率
  );
  console.log(`连击 ${combo}: ${multiplier.toFixed(2)}x`);
}
// 输出: 连击 1: 1.10x, 连击 5: 1.61x, 连击 10: 2.59x
```

### 离线收益计算
```typescript
const offlineBonus = DropRateCalculator.calculateTimeBonus(
  7200,     // 离线2小时
  100,      // 基础收益率
  86400,    // 最大24小时
  0.8       // 衰减因子
);
console.log(`离线收益: ${offlineBonus}`);
```

## 🏆 分数和等级系统

### 分数计算
```typescript
import { ScoreCalculator } from './fishing-game-algorithms.js';

const score = ScoreCalculator.calculateBaseScore(
  100,      // 鱼的价值
  2,        // 子弹威力
  200,      // 射击距离
  true,     // 是否暴击
  1.5       // 连击倍率
);
console.log(`获得分数: ${score}`); // 480分
```

### 经验值计算
```typescript
const experience = ScoreCalculator.calculateExperience(
  1000,     // 基础分数
  5,        // 玩家等级
  1.2       // 难度倍率
);
console.log(`获得经验: ${experience}`); // 1800经验
```

### 升级经验需求
```typescript
const levelUpExp = ScoreCalculator.calculateLevelUpExperience(10);
console.log(`10级升级需要: ${levelUpExp} 经验`); // 3844经验
```

## ⚔️ 道具和Buff系统

### 武器倍率计算
```typescript
import { ItemEffectCalculator } from './fishing-game-algorithms.js';

const weaponPower = ItemEffectCalculator.calculateWeaponMultiplier(
  100,      // 基础威力
  5,        // 武器等级
  'epic'    // 稀有度
);
console.log(`武器威力: ${weaponPower}`); // 210.0
```

### Buff效果计算
```typescript
const buffEffect = ItemEffectCalculator.calculateBuffEffect(
  100,      // 基础值
  'damage', // Buff类型
  3,        // Buff等级
  10,       // 持续时间
  3         // 已过时间
);
console.log(`当前Buff效果: ${buffEffect.toFixed(1)}%`); // 117.5%
```

## 🌐 网络同步算法

### 预测性补偿
```typescript
import { NetworkSynchronization } from './fishing-game-algorithms.js';

const predictedPos = NetworkSynchronization.calculatePredictedPosition(
  new Vector2D(100, 100),  // 当前位置
  new Vector2D(10, 5),     // 速度
  Date.now() - 100,        // 最后更新时间
  Date.now(),              // 当前时间
  50                       // 网络延迟
);
```

### 平滑插值
```typescript
const interpolatedPos = NetworkSynchronization.interpolatePosition(
  new Vector2D(0, 0),      // 开始位置
  new Vector2D(100, 100),  // 结束位置
  0, 1000, 500,           // 时间参数
  'smooth'                 // 插值类型
);
```

### 数据压缩
```typescript
// 压缩位置数据用于网络传输
const compressed = NetworkSynchronization.compressPosition(
  new Vector2D(123.456, 789.012),
  0.01  // 精度
);

// 解压缩接收到的数据
const decompressed = NetworkSynchronization.decompressPosition(
  compressed,
  0.01
);
```

## ✨ 粒子效果系统

### 爆炸粒子生成
```typescript
import { ParticleSystem } from './fishing-game-algorithms.js';

const center = new Vector2D(50, 50);
const particles = ParticleSystem.generateExplosionParticles(
  center,
  12,       // 粒子数量
  30,       // 爆炸半径
  { min: 5, max: 20 }  // 速度范围
);
```

### 粒子生命周期管理
```typescript
const particlePos = ParticleSystem.calculateParticlePosition(
  new Vector2D(0, 0),    // 初始位置
  new Vector2D(10, 5),   // 初始速度
  9.8,                   // 重力
  1.0,                   // 当前时间
  3.0                    // 生命周期
);
```

### 粒子颜色渐变
```typescript
const particleColor = ParticleSystem.calculateParticleColor(
  { r: 255, g: 255, b: 0, a: 1.0 },    // 开始颜色
  { r: 255, g: 0, b: 0, a: 0.0 },      // 结束颜色
  2.0,                                 // 生命周期
  1.0                                  // 当前时间
);
```

## 🎮 完整游戏循环示例

```typescript
// 游戏主循环
function gameLoop(deltaTime: number) {
  // 1. 更新鱼的位置
  updateFishPositions(deltaTime);

  // 2. 更新子弹轨迹
  updateBulletTrajectories(deltaTime);

  // 3. 检测碰撞
  checkCollisions();

  // 4. 处理击中事件
  processHits();

  // 5. 更新粒子效果
  updateParticles(deltaTime);

  // 6. 网络同步
  synchronizeState();
}

function updateFishPositions(deltaTime: number) {
  // 每条鱼的AI决策
  for (const fish of fishes) {
    switch (fish.movementPattern) {
      case FishAI.MovementPattern.LINEAR:
        const move = FishAI.calculateLinearPath(
          fish.position, fish.target, fish.speed, deltaTime
        );
        fish.position = fish.position.add(move);
        break;

      case FishAI.MovementPattern.CIRCULAR:
        fish.position = FishAI.calculateCircularPath(
          fish.center, fish.position, fish.radius, fish.angularSpeed, fish.time
        );
        fish.time += deltaTime;
        break;
    }
  }
}

function updateBulletTrajectories(deltaTime: number) {
  for (const bullet of bullets) {
    if (bullet.isHoming) {
      // 追踪弹道
      bullet.velocity = TrajectoryCalculator.calculateHomingTrajectory(
        bullet.position,
        bullet.target.position,
        bullet.velocity,
        bullet.maxTurnRate,
        bullet.speed,
        deltaTime
      );
    }

    // 更新位置
    bullet.position = bullet.position.add(
      bullet.velocity.multiply(deltaTime)
    );
  }
}

function checkCollisions() {
  for (const bullet of bullets) {
    for (const fish of fishes) {
      if (CollisionDetector.circleCollision(
        bullet.position, bullet.radius,
        fish.position, fish.radius
      )) {
        // 击中处理
        handleHit(bullet, fish);
      }
    }
  }
}

function handleHit(bullet: any, fish: any) {
  // 计算分数
  const score = ScoreCalculator.calculateBaseScore(
    fish.value,
    bullet.power,
    Vector2D.distance(bullet.position, bullet.startPos),
    DropRateCalculator.calculateCriticalHit(0.1),
    bullet.comboMultiplier
  );

  // 生成爆炸粒子
  const particles = ParticleSystem.generateExplosionParticles(
    fish.position, 8, 20, { min: 5, max: 15 }
  );

  // 移除鱼和子弹
  removeFish(fish);
  removeBullet(bullet);
}
```

## 📊 性能优化建议

### 1. 空间分区
```typescript
// 将游戏区域分成网格，提高碰撞检测效率
class SpatialGrid {
  private grid: Map<string, any[]> = new Map();

  addObject(obj: any) {
    const key = this.getGridKey(obj.position);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key)!.push(obj);
  }

  getNearbyObjects(position: Vector2D, radius: number): any[] {
    const nearby: any[] = [];
    const keys = this.getNearbyKeys(position, radius);

    for (const key of keys) {
      const objects = this.grid.get(key) || [];
      nearby.push(...objects);
    }

    return nearby;
  }
}
```

### 2. 对象池模式
```typescript
// 复用子弹和粒子对象，减少GC压力
class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;

  constructor(createFn: () => T, initialSize: number = 10) {
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get(): T {
    return this.pool.pop() || this.createFn();
  }

  release(obj: T): void {
    this.pool.push(obj);
  }
}
```

## 🧪 测试命令

```bash
# 运行捕鱼游戏算法测试
npm run test-fishing
```

## 🎯 算法复杂度总结

| 算法类型 | 时间复杂度 | 空间复杂度 | 应用场景 |
|----------|-----------|-----------|----------|
| 向量运算 | O(1) | O(1) | 实时位置计算 |
| 碰撞检测 | O(1) | O(1) | 每帧检测 |
| 轨迹计算 | O(1) | O(1) | 子弹/鱼移动 |
| AI决策 | O(1)-O(n) | O(1) | 鱼的行为逻辑 |
| 概率计算 | O(1) | O(1) | 掉落和暴击 |
| 分数计算 | O(1) | O(1) | 即时反馈 |
| 网络同步 | O(1) | O(1) | 状态同步 |
| 粒子效果 | O(m) | O(m) | 视觉特效 |

这个算法集合涵盖了捕鱼游戏开发的核心需求，可以直接用于实际项目开发！🎮✨
