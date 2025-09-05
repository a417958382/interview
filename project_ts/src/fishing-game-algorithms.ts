/**
 * 捕鱼类游戏核心算法集合
 * 包括物理引擎、AI、概率系统、游戏逻辑等
 */

// =============== 物理引擎算法 ===============

/**
 * 向量类 - 用于位置、速度、加速度计算
 */
class Vector2D {
  constructor(public x: number = 0, public y: number = 0) {}

  /**
   * 向量加法
   */
  add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * 向量减法
   */
  subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * 向量乘法（标量）
   */
  multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * 向量长度
   */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 向量标准化
   */
  normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }

  /**
   * 向量点积
   */
  dot(other: Vector2D): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * 计算两点间距离
   */
  static distance(a: Vector2D, b: Vector2D): number {
    return a.subtract(b).magnitude();
  }

  /**
   * 计算方向向量
   */
  static direction(from: Vector2D, to: Vector2D): Vector2D {
    return to.subtract(from).normalize();
  }
}

/**
 * 碰撞检测算法
 */
class CollisionDetector {
  /**
   * 圆形碰撞检测
   */
  static circleCollision(
    pos1: Vector2D,
    radius1: number,
    pos2: Vector2D,
    radius2: number
  ): boolean {
    const distance = Vector2D.distance(pos1, pos2);
    return distance <= (radius1 + radius2);
  }

  /**
   * 矩形碰撞检测
   */
  static rectangleCollision(
    pos1: Vector2D,
    width1: number,
    height1: number,
    pos2: Vector2D,
    width2: number,
    height2: number
  ): boolean {
    return (
      pos1.x < pos2.x + width2 &&
      pos1.x + width1 > pos2.x &&
      pos1.y < pos2.y + height2 &&
      pos1.y + height1 > pos2.y
    );
  }

  /**
   * 点到线段的最短距离
   */
  static pointToLineDistance(
    point: Vector2D,
    lineStart: Vector2D,
    lineEnd: Vector2D
  ): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;

    if (lenSq === 0) {
      return Vector2D.distance(point, lineStart);
    }

    const param = dot / lenSq;

    let xx: number, yy: number;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    return Vector2D.distance(point, new Vector2D(xx, yy));
  }
}

/**
 * 弹道轨迹算法
 */
class TrajectoryCalculator {
  /**
   * 计算抛物线轨迹点
   */
  static calculateParabolicPoint(
    startPos: Vector2D,
    velocity: Vector2D,
    gravity: number,
    time: number
  ): Vector2D {
    const x = startPos.x + velocity.x * time;
    const y = startPos.y + velocity.y * time - 0.5 * gravity * time * time;
    return new Vector2D(x, y);
  }

  /**
   * 计算直线轨迹点
   */
  static calculateLinearPoint(
    startPos: Vector2D,
    direction: Vector2D,
    speed: number,
    time: number
  ): Vector2D {
    const distance = speed * time;
    const displacement = direction.multiply(distance);
    return startPos.add(displacement);
  }

  /**
   * 计算贝塞尔曲线轨迹点
   */
  static calculateBezierPoint(
    t: number,
    p0: Vector2D,
    p1: Vector2D,
    p2: Vector2D
  ): Vector2D {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;

    const x = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
    const y = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;

    return new Vector2D(x, y);
  }

  /**
   * 计算鱼雷轨迹（追踪型）
   */
  static calculateHomingTrajectory(
    currentPos: Vector2D,
    targetPos: Vector2D,
    currentVelocity: Vector2D,
    maxTurnRate: number,
    speed: number,
    deltaTime: number
  ): Vector2D {
    const desiredDirection = Vector2D.direction(currentPos, targetPos);
    const currentDirection = currentVelocity.normalize();

    // 计算转向角度
    const cross = currentDirection.x * desiredDirection.y - currentDirection.y * desiredDirection.x;
    const dot = currentDirection.dot(desiredDirection);

    let turnAngle = Math.acos(Math.max(-1, Math.min(1, dot)));
    if (cross < 0) turnAngle = -turnAngle;

    // 限制转向速度
    turnAngle = Math.max(-maxTurnRate * deltaTime, Math.min(maxTurnRate * deltaTime, turnAngle));

    // 计算新方向
    const cos = Math.cos(turnAngle);
    const sin = Math.sin(turnAngle);

    const newDirectionX = currentDirection.x * cos - currentDirection.y * sin;
    const newDirectionY = currentDirection.x * sin + currentDirection.y * cos;

    const newDirection = new Vector2D(newDirectionX, newDirectionY).normalize();

    return newDirection.multiply(speed);
  }
}

// =============== AI算法 ===============

/**
 * 鱼类AI行为算法
 */
class FishAI {
  /**
   * 鱼的移动模式枚举
   */
  static MovementPattern = {
    LINEAR: 'linear',           // 直线移动
    CIRCULAR: 'circular',       // 圆形移动
    SINUSOIDAL: 'sinusoidal',   // 正弦波移动
    RANDOM: 'random',          // 随机移动
    SCHOOLING: 'schooling'     // 鱼群行为
  };

  /**
   * 计算直线移动路径
   */
  static calculateLinearPath(
    currentPos: Vector2D,
    targetPos: Vector2D,
    speed: number,
    deltaTime: number
  ): Vector2D {
    const direction = Vector2D.direction(currentPos, targetPos);
    return direction.multiply(speed * deltaTime);
  }

  /**
   * 计算圆形移动路径
   */
  static calculateCircularPath(
    center: Vector2D,
    currentPos: Vector2D,
    radius: number,
    angularSpeed: number,
    time: number
  ): Vector2D {
    const angle = angularSpeed * time;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    return new Vector2D(x, y);
  }

  /**
   * 计算正弦波移动路径
   */
  static calculateSinusoidalPath(
    startPos: Vector2D,
    direction: Vector2D,
    amplitude: number,
    frequency: number,
    speed: number,
    time: number
  ): Vector2D {
    const forwardDistance = speed * time;
    const perpendicular = new Vector2D(-direction.y, direction.x);
    const waveOffset = amplitude * Math.sin(frequency * time);

    const forward = direction.multiply(forwardDistance);
    const wave = perpendicular.multiply(waveOffset);

    return startPos.add(forward).add(wave);
  }

  /**
   * 计算随机游走路径
   */
  static calculateRandomWalk(
    currentPos: Vector2D,
    currentDirection: Vector2D,
    speed: number,
    turnRate: number,
    deltaTime: number
  ): { position: Vector2D; direction: Vector2D } {
    // 随机转向
    const randomTurn = (Math.random() - 0.5) * turnRate * deltaTime;

    const cos = Math.cos(randomTurn);
    const sin = Math.sin(randomTurn);

    const newDirectionX = currentDirection.x * cos - currentDirection.y * sin;
    const newDirectionY = currentDirection.x * sin + currentDirection.y * cos;

    const newDirection = new Vector2D(newDirectionX, newDirectionY).normalize();
    const displacement = newDirection.multiply(speed * deltaTime);
    const newPosition = currentPos.add(displacement);

    return { position: newPosition, direction: newDirection };
  }

  /**
   * 计算鱼群行为（简化版）
   */
  static calculateSchoolingBehavior(
    fishPos: Vector2D,
    neighbors: Vector2D[],
    separationDistance: number,
    alignmentDistance: number,
    cohesionDistance: number,
    weights: { separation: number; alignment: number; cohesion: number }
  ): Vector2D {
    let separationForce = new Vector2D(0, 0);
    let alignmentForce = new Vector2D(0, 0);
    let cohesionForce = new Vector2D(0, 0);

    let separationCount = 0;
    let alignmentCount = 0;
    let cohesionCount = 0;

    for (const neighbor of neighbors) {
      const distance = Vector2D.distance(fishPos, neighbor);

      // 分离行为：避免太近的邻居
      if (distance < separationDistance && distance > 0) {
        const force = Vector2D.direction(neighbor, fishPos).multiply(1 / distance);
        separationForce = separationForce.add(force);
        separationCount++;
      }

      // 对齐行为：与邻居保持相同方向
      if (distance < alignmentDistance) {
        // 这里简化处理，实际需要邻居的速度向量
        alignmentForce = alignmentForce.add(neighbor.subtract(fishPos).normalize());
        alignmentCount++;
      }

      // 内聚行为：向邻居中心移动
      if (distance < cohesionDistance) {
        cohesionForce = cohesionForce.add(neighbor);
        cohesionCount++;
      }
    }

    // 平均化力
    if (separationCount > 0) separationForce = separationForce.multiply(1 / separationCount);
    if (alignmentCount > 0) alignmentForce = alignmentForce.multiply(1 / alignmentCount);
    if (cohesionCount > 0) {
      cohesionForce = cohesionForce.multiply(1 / cohesionCount);
      cohesionForce = Vector2D.direction(fishPos, cohesionForce);
    }

    // 组合所有力
    const totalForce = separationForce.multiply(weights.separation)
      .add(alignmentForce.multiply(weights.alignment))
      .add(cohesionForce.multiply(weights.cohesion));

    return totalForce.normalize();
  }
}

// =============== 概率系统算法 ===============

/**
 * 掉落概率算法
 */
class DropRateCalculator {
  /**
   * 计算暴击概率
   */
  static calculateCriticalHit(
    baseRate: number,
    luckModifier: number = 1.0,
    streakBonus: number = 0
  ): boolean {
    const effectiveRate = Math.min(1.0, baseRate * luckModifier * (1 + streakBonus));
    return Math.random() < effectiveRate;
  }

  /**
   * 计算多重掉落
   */
  static calculateMultipleDrops(
    dropTable: Array<{ item: string; probability: number; quantity: number }>,
    rolls: number = 1
  ): Array<{ item: string; quantity: number }> {
    const results: Array<{ item: string; quantity: number }> = [];

    for (let i = 0; i < rolls; i++) {
      const roll = Math.random();
      let cumulative = 0;

      for (const drop of dropTable) {
        cumulative += drop.probability;
        if (roll <= cumulative) {
          const existingItem = results.find(r => r.item === drop.item);
          if (existingItem) {
            existingItem.quantity += drop.quantity;
          } else {
            results.push({ item: drop.item, quantity: drop.quantity });
          }
          break;
        }
      }
    }

    return results;
  }

  /**
   * 计算连击奖励
   */
  static calculateComboBonus(
    currentCombo: number,
    baseMultiplier: number = 1.0,
    growthRate: number = 0.1
  ): number {
    return baseMultiplier * Math.pow(1 + growthRate, currentCombo);
  }

  /**
   * 计算稀有度概率
   */
  static calculateRarityProbability(
    baseRates: { common: number; rare: number; epic: number; legendary: number },
    playerLevel: number,
    luckStat: number
  ): { common: number; rare: number; epic: number; legendary: number } {
    const luckModifier = 1 + (luckStat / 100);
    const levelModifier = 1 + (playerLevel / 100);

    return {
      common: Math.max(0, baseRates.common - (luckModifier * levelModifier - 1) * 0.1),
      rare: baseRates.rare * luckModifier * levelModifier,
      epic: baseRates.epic * luckModifier * levelModifier,
      legendary: baseRates.legendary * luckModifier * levelModifier
    };
  }

  /**
   * 计算时间奖励（离线收益）
   */
  static calculateTimeBonus(
    offlineTime: number, // 秒
    baseRate: number,
    maxTime: number = 86400, // 24小时
    decayFactor: number = 0.8
  ): number {
    const effectiveTime = Math.min(offlineTime, maxTime);
    return baseRate * effectiveTime * Math.pow(decayFactor, effectiveTime / 3600);
  }
}

// =============== 游戏逻辑算法 ===============

/**
 * 分数计算系统
 */
class ScoreCalculator {
  /**
   * 计算基础分数
   */
  static calculateBaseScore(
    fishValue: number,
    bulletPower: number,
    distance: number,
    isCritical: boolean = false,
    comboMultiplier: number = 1.0
  ): number {
    let score = fishValue * bulletPower;

    // 距离惩罚（越远分数越低）
    const distancePenalty = Math.max(0.1, 1 - (distance / 1000));

    // 暴击加成
    if (isCritical) {
      score *= 2;
    }

    // 连击加成
    score *= comboMultiplier;

    return Math.floor(score * distancePenalty);
  }

  /**
   * 计算等级经验
   */
  static calculateExperience(
    score: number,
    level: number,
    difficulty: number
  ): number {
    return Math.floor(score * (1 + level / 10) * difficulty);
  }

  /**
   * 计算升级所需经验
   */
  static calculateLevelUpExperience(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  /**
   * 计算技能升级概率
   */
  static calculateSkillUpgradeChance(
    currentLevel: number,
    upgradeCost: number,
    playerGold: number
  ): number {
    if (playerGold < upgradeCost) return 0;

    const baseChance = 0.1; // 10%基础概率
    const levelBonus = currentLevel * 0.01; // 每级1%加成
    const goldRatio = playerGold / upgradeCost;

    return Math.min(0.9, baseChance + levelBonus + (goldRatio - 1) * 0.05);
  }
}

/**
 * 道具效果算法
 */
class ItemEffectCalculator {
  /**
   * 计算武器倍率
   */
  static calculateWeaponMultiplier(
    basePower: number,
    weaponLevel: number,
    weaponRarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): number {
    const rarityMultipliers = {
      common: 1.0,
      rare: 1.2,
      epic: 1.5,
      legendary: 2.0
    };

    const levelMultiplier = 1 + (weaponLevel - 1) * 0.1;

    return basePower * rarityMultipliers[weaponRarity] * levelMultiplier;
  }

  /**
   * 计算Buff效果
   */
  static calculateBuffEffect(
    baseValue: number,
    buffType: 'damage' | 'speed' | 'luck' | 'experience',
    buffLevel: number,
    duration: number,
    timeElapsed: number
  ): number {
    if (timeElapsed >= duration) return 0;

    const buffMultipliers = {
      damage: 0.1,
      speed: 0.05,
      luck: 0.08,
      experience: 0.15
    };

    const multiplier = buffMultipliers[buffType];
    const levelBonus = buffLevel * 0.05;
    const timeDecay = 1 - (timeElapsed / duration) * 0.2; // 最后20%时间衰减

    return baseValue * (1 + multiplier + levelBonus) * timeDecay;
  }

  /**
   * 计算道具合成概率
   */
  static calculateCraftingSuccess(
    recipe: Array<{ item: string; quantity: number }>,
    playerInventory: Map<string, number>,
    craftingSkill: number
  ): number {
    let successRate = 0.5; // 基础成功率50%

    // 检查材料是否充足
    const hasAllMaterials = recipe.every(req =>
      (playerInventory.get(req.item) || 0) >= req.quantity
    );

    if (!hasAllMaterials) return 0;

    // 技能加成
    successRate += craftingSkill * 0.01;

    // 材料品质加成（这里简化处理）
    const materialBonus = recipe.length * 0.02;

    return Math.min(0.95, successRate + materialBonus);
  }
}

// =============== 网络同步算法 ===============

/**
 * 状态同步算法
 */
class NetworkSynchronization {
  /**
   * 预测性补偿算法
   */
  static calculatePredictedPosition(
    currentPos: Vector2D,
    velocity: Vector2D,
    lastUpdateTime: number,
    currentTime: number,
    latency: number
  ): Vector2D {
    const timeDiff = (currentTime - lastUpdateTime + latency) / 1000; // 转换为秒
    return currentPos.add(velocity.multiply(timeDiff));
  }

  /**
   * 插值同步算法
   */
  static interpolatePosition(
    startPos: Vector2D,
    endPos: Vector2D,
    startTime: number,
    endTime: number,
    currentTime: number,
    interpolationType: 'linear' | 'smooth' = 'linear'
  ): Vector2D {
    const totalTime = endTime - startTime;
    const elapsedTime = currentTime - startTime;

    if (totalTime <= 0) return endPos;

    let t = Math.max(0, Math.min(1, elapsedTime / totalTime));

    // 平滑插值
    if (interpolationType === 'smooth') {
      t = t * t * (3 - 2 * t); // Smoothstep function
    }

    const x = startPos.x + (endPos.x - startPos.x) * t;
    const y = startPos.y + (endPos.y - startPos.y) * t;

    return new Vector2D(x, y);
  }

  /**
   * 延迟隐藏算法
   */
  static shouldHideEntity(
    lastUpdateTime: number,
    currentTime: number,
    timeoutThreshold: number = 5000
  ): boolean {
    return (currentTime - lastUpdateTime) > timeoutThreshold;
  }

  /**
   * 压缩位置数据
   */
  static compressPosition(
    position: Vector2D,
    precision: number = 0.01
  ): { x: number; y: number } {
    return {
      x: Math.round(position.x / precision),
      y: Math.round(position.y / precision)
    };
  }

  /**
   * 解压缩位置数据
   */
  static decompressPosition(
    compressed: { x: number; y: number },
    precision: number = 0.01
  ): Vector2D {
    return new Vector2D(
      compressed.x * precision,
      compressed.y * precision
    );
  }
}

// =============== 粒子效果算法 ===============

/**
 * 粒子系统算法
 */
class ParticleSystem {
  /**
   * 计算粒子位置
   */
  static calculateParticlePosition(
    initialPos: Vector2D,
    velocity: Vector2D,
    gravity: number,
    time: number,
    lifeTime: number
  ): Vector2D {
    const normalizedTime = time / lifeTime;
    const gravityEffect = gravity * time * time * 0.5;

    const x = initialPos.x + velocity.x * time;
    const y = initialPos.y + velocity.y * time + gravityEffect;

    return new Vector2D(x, y);
  }

  /**
   * 计算粒子颜色（基于生命周期）
   */
  static calculateParticleColor(
    startColor: { r: number; g: number; b: number; a: number },
    endColor: { r: number; g: number; b: number; a: number },
    lifeTime: number,
    currentTime: number
  ): { r: number; g: number; b: number; a: number } {
    const t = Math.max(0, Math.min(1, currentTime / lifeTime));

    return {
      r: Math.round(startColor.r + (endColor.r - startColor.r) * t),
      g: Math.round(startColor.g + (endColor.g - startColor.g) * t),
      b: Math.round(startColor.b + (endColor.b - startColor.b) * t),
      a: startColor.a + (endColor.a - startColor.a) * t
    };
  }

  /**
   * 计算粒子大小（基于生命周期）
   */
  static calculateParticleSize(
    startSize: number,
    endSize: number,
    lifeTime: number,
    currentTime: number
  ): number {
    const t = Math.max(0, Math.min(1, currentTime / lifeTime));
    return startSize + (endSize - startSize) * t;
  }

  /**
   * 生成爆炸粒子效果
   */
  static generateExplosionParticles(
    center: Vector2D,
    particleCount: number,
    explosionRadius: number,
    speedRange: { min: number; max: number }
  ): Array<{ position: Vector2D; velocity: Vector2D }> {
    const particles: Array<{ position: Vector2D; velocity: Vector2D }> = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = speedRange.min + Math.random() * (speedRange.max - speedRange.min);

      const velocity = new Vector2D(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      particles.push({
        position: center,
        velocity: velocity
      });
    }

    return particles;
  }
}

// =============== 导出所有类和函数 ===============

export {
  Vector2D,
  CollisionDetector,
  TrajectoryCalculator,
  FishAI,
  DropRateCalculator,
  ScoreCalculator,
  ItemEffectCalculator,
  NetworkSynchronization,
  ParticleSystem
};
