// 开放地图实时战斗系统实现
// Open World Real-time Combat System Implementation

/** 战斗单位类型枚举 - 定义不同的兵种类型 */
export enum UnitType {
  INFANTRY = 'infantry', // 步兵 - 近战单位，防御力强
  ARCHER = 'archer',     // 弓箭手 - 远程攻击，攻击力中等
  CAVALRY = 'cavalry',   // 骑兵 - 移动速度快，冲击力强
  SIEGE = 'siege',       // 攻城器械 - 对建筑破坏力强
  MAGE = 'mage'          // 法师 - 魔法攻击，特殊效果
}

/** 战斗状态枚举 - 定义单位在战斗中的各种状态 */
export enum CombatState {
  IDLE = 'idle',         // 空闲状态 - 没有参与战斗
  MOVING = 'moving',     // 移动状态 - 正在移动中
  ENGAGING = 'engaging', // 交战状态 - 正在与敌人战斗
  ATTACKING = 'attacking', // 攻击状态 - 正在执行攻击动作
  DEFENDING = 'defending', // 防御状态 - 处于防御姿态
  RETREATING = 'retreating', // 撤退状态 - 正在撤退
  DEAD = 'dead'          // 死亡状态 - 单位已死亡
}

/** 阵营枚举 - 定义不同的势力阵营 */
export enum Faction {
  PLAYER = 'player',     // 玩家阵营 - 玩家的部队
  ENEMY = 'enemy',       // 敌方阵营 - 敌对势力
  NEUTRAL = 'neutral',   // 中立阵营 - 不参与战斗
  ALLY = 'ally'          // 盟友阵营 - 友好势力
}

/** 位置坐标接口 - 定义二维坐标系中的位置 */
export interface Position {
  x: number; // X坐标 - 水平位置
  y: number; // Y坐标 - 垂直位置
}

/**
 * 战斗单位接口
 * 定义了战斗单位的基本属性和行为规范
 */
export interface CombatUnit {
  // 基本属性 - 单位的身份信息
  id: string;              // 单位唯一标识符 - 用于区分不同单位
  name: string;            // 单位名称 - 显示在UI中的名称
  position: Position;      // 单位位置 - 当前在地图上的坐标
  faction: Faction;        // 单位阵营 - 决定敌友关系
  unitType: UnitType;      // 单位类型 - 决定战斗特性和技能

  // 战斗属性 - 决定战斗力的数值
  health: number;          // 当前生命值 - 归零时单位死亡
  maxHealth: number;       // 最大生命值 - 生命值的上限
  attack: number;          // 攻击力 - 基础伤害输出
  defense: number;         // 防御力 - 减少受到的伤害
  attackRange: number;     // 攻击范围 - 能攻击敌人的最大距离
  movementSpeed: number;   // 移动速度 - 单位时间移动的距离

  // 战斗状态 - 反映当前战斗情况
  combatState: CombatState;     // 当前战斗状态 - 决定单位行为
  currentTarget?: string;       // 当前目标单位ID - 正在攻击的对象
  lastAttackTime: number;       // 最后攻击时间戳 - 用于冷却计算
  attackCooldown: number;       // 攻击冷却时间 - 攻击间隔限制

  // 多目标战斗 - 支持同时与多个敌人战斗
  engagedTargets: Set<string>;     // 正在交战的敌对目标集合
  threatTable: Map<string, number>; // 威胁等级表 - 决定攻击优先级

  // 方法接口 - 定义单位的行为
  update(deltaTime: number): void;                    // 更新单位逻辑 - 每帧调用
  canAttack(target: CombatUnit): boolean;             // 检查是否可以攻击目标
  calculateDamage(target: CombatUnit): number;        // 计算对目标造成的伤害
  takeDamage(damage: number): void;                   // 承受伤害 - 更新生命值
  isAlive(): boolean;                                 // 检查单位是否存活
  getDistanceTo(target: CombatUnit): number;          // 计算到目标单位的距离
}

/**
 * 开放地图实时战斗管理器
 * 负责管理和协调所有战斗单位的实时战斗逻辑
 */
export class RealTimeCombatManager {
  // 核心数据结构
  private units: Map<string, CombatUnit> = new Map();         // 所有战斗单位的存储容器
  private spatialIndex: SpatialIndexManager;                  // 空间索引管理器，支持多种策略
  private activeCombats: Map<string, CombatInstance> = new Map(); // 当前活跃的战斗实例
  private updateInterval: number = 100;                       // 更新间隔时间（毫秒）
  private lastUpdate: number = 0;                             // 最后更新时间戳

  /**
   * 创建实时战斗管理器
   * @param initialStrategy 初始空间索引策略
   */
  constructor(initialStrategy: SpatialIndexStrategy = SpatialIndexStrategy.UNIFORM_GRID) {
    this.spatialIndex = new SpatialIndexManager(
      initialStrategy,
      () => Array.from(this.units.values()) // 提供单位获取函数
    ); // 初始化空间索引管理器
  }

  /**
   * 添加战斗单位到战斗系统中
   * @param unit 要添加的战斗单位
   */
  addUnit(unit: CombatUnit): void {
    this.units.set(unit.id, unit);                    // 将单位添加到单位映射表
    this.spatialIndex.addUnit(unit);                  // 将单位注册到空间索引系统
  }

  /**
   * 从战斗系统中移除战斗单位
   * @param unitId 要移除的单位ID
   */
  removeUnit(unitId: string): void {
    const unit = this.units.get(unitId);              // 从映射表中查找单位
    if (unit) {                                       // 如果单位存在
      this.spatialIndex.removeUnit(unit);             // 从空间索引系统中移除
      this.units.delete(unitId);                      // 从单位映射表中删除

      // 清理相关的战斗实例
      for (const [combatId, combat] of this.activeCombats) { // 遍历所有活跃战斗
        if (combat.participants.has(unitId)) {         // 如果战斗包含该单位
          combat.participants.delete(unitId);          // 从参与者列表中移除
          if (combat.participants.size === 0) {        // 如果战斗没有参与者了
            this.activeCombats.delete(combatId);       // 删除整个战斗实例
          }
        }
      }
    }
  }

  /**
   * 更新战斗系统主循环
   * @param deltaTime 时间增量（毫秒）
   */
  update(deltaTime: number): void {
    this.lastUpdate += deltaTime;                    // 累加时间增量

    if (this.lastUpdate >= this.updateInterval) {   // 检查是否到达更新间隔
      this.processCombatDetection();                // 处理战斗检测
      this.processActiveCombats();                  // 处理活跃战斗
      this.updateUnitStates();                      // 更新单位状态
      this.lastUpdate = 0;                          // 重置更新计数器
    }
  }

  /**
   * 处理战斗检测逻辑
   * 扫描所有潜在的战斗对，判断是否满足战斗条件
   */
  private processCombatDetection(): void {
    // 获取所有潜在的战斗对（通过空间索引优化）
    const potentialCombats = this.spatialIndex.getPotentialCombats();

    // 遍历每个潜在的攻击者及其可能的防御者
    for (const [attackerId, defenderIds] of potentialCombats) {
      const attacker = this.units.get(attackerId);   // 获取攻击者单位
      if (!attacker || !attacker.isAlive()) continue; // 跳过不存在或死亡的单位

      // 检查攻击者的每个潜在防御者
      for (const defenderId of defenderIds) {
        const defender = this.units.get(defenderId); // 获取防御者单位
        if (!defender || !defender.isAlive()) continue; // 跳过不存在或死亡的单位

        // 检查是否为敌对关系
        if (this.areEnemies(attacker, defender)) {
          this.handleCombatDetection(attacker, defender); // 处理战斗检测
        }
      }
    }
  }

  /**
   * 处理具体的战斗检测和初始化
   * 当两个敌对单位进入攻击范围时，建立战斗关系
   * @param attacker 攻击者单位
   * @param defender 防御者单位
   */
  private handleCombatDetection(attacker: CombatUnit, defender: CombatUnit): void {
    const distance = attacker.getDistanceTo(defender);    // 计算两个单位之间的距离
    const canAttack = distance <= attacker.attackRange;   // 判断是否在攻击范围内

    if (canAttack) {                                      // 如果可以攻击
      // 将彼此添加到交战目标集合中
      attacker.engagedTargets.add(defender.id);           // 攻击者记录防御者为目标
      defender.engagedTargets.add(attacker.id);           // 防御者记录攻击者为目标

      // 创建或更新战斗实例
      const combatId = this.getCombatId(attacker.id, defender.id); // 生成战斗唯一ID
      let combat = this.activeCombats.get(combatId);     // 查找现有战斗实例

      if (!combat) {                                      // 如果战斗不存在
        combat = new CombatInstance(combatId);           // 创建新的战斗实例
        this.activeCombats.set(combatId, combat);        // 添加到活跃战斗列表
      }

      combat.participants.add(attacker.id);              // 添加攻击者到参与者
      combat.participants.add(defender.id);              // 添加防御者到参与者
      combat.lastActivity = Date.now();                  // 更新最后活动时间

      // 初始化威胁等级
      this.updateThreatLevel(attacker, defender.id, 10); // 攻击者对防御者的初始威胁
      this.updateThreatLevel(defender, attacker.id, 10); // 防御者对攻击者的初始威胁
    }
  }

  /**
   * 处理所有活跃的战斗实例
   * 清理超时的战斗，处理进行中的战斗逻辑
   */
  private processActiveCombats(): void {
    const now = Date.now();                           // 获取当前时间戳
    const cleanupThreshold = 5000;                    // 非活跃战斗清理阈值（5秒）

    // 遍历所有活跃的战斗实例
    for (const [combatId, combat] of this.activeCombats) {
      if (now - combat.lastActivity > cleanupThreshold) { // 检查是否超时
        this.activeCombats.delete(combatId);          // 删除超时的战斗实例
        continue;                                      // 跳过后续处理
      }

      this.processCombatInstance(combat);             // 处理活跃的战斗实例
    }
  }

  /**
   * 处理单个战斗实例
   * 执行所有参与者的战斗行动
   * @param combat 要处理的战斗实例
   */
  private processCombatInstance(combat: CombatInstance): void {
    // 获取所有参与者的单位对象，过滤掉不存在或死亡的单位
    const participants = Array.from(combat.participants)
      .map(id => this.units.get(id))                  // 将ID转换为单位对象
      .filter((unit): unit is CombatUnit => unit !== undefined && unit.isAlive()); // 过滤有效单位

    // 处理每个参与者的战斗行动
    for (const unit of participants) {
      this.processUnitCombat(unit, participants);    // 执行单位战斗逻辑
    }
  }

  /**
   * 处理单个单位的战斗行动
   * @param unit 要处理的战斗单位
   * @param allParticipants 战斗中的所有参与者
   */
  private processUnitCombat(unit: CombatUnit, allParticipants: CombatUnit[]): void {
    const now = Date.now();                            // 获取当前时间戳

    // 检查攻击冷却时间
    if (now - unit.lastAttackTime < unit.attackCooldown) { // 如果还在冷却中
      return;                                           // 跳过本次攻击
    }

    // 基于威胁值和距离寻找最佳目标
    const validTargets = allParticipants.filter(target => // 过滤出有效目标
      target.id !== unit.id &&                         // 排除自己
      this.areEnemies(unit, target) &&                 // 必须是敌人
      unit.canAttack(target)                           // 必须在攻击范围内
    );

    if (validTargets.length === 0) {                   // 如果没有有效目标
      unit.combatState = CombatState.IDLE;             // 设置为空闲状态
      return;                                          // 结束处理
    }

    // 选择目标（优先选择威胁值最高的）
    const target = validTargets.reduce((best, current) => {
      const bestThreat = unit.threatTable.get(best.id) || 0;     // 获取最佳目标威胁值
      const currentThreat = unit.threatTable.get(current.id) || 0; // 获取当前目标威胁值
      return currentThreat > bestThreat ? current : best;        // 返回威胁值更高的目标
    });

    // 执行攻击
    unit.combatState = CombatState.ATTACKING;          // 设置为攻击状态
    unit.currentTarget = target.id;                    // 记录当前目标
    unit.lastAttackTime = now;                         // 更新最后攻击时间

    const damage = unit.calculateDamage(target);       // 计算伤害值
    target.takeDamage(damage);                         // 对目标造成伤害

    // 更新威胁值（造成的伤害会增加威胁）
    this.updateThreatLevel(target, unit.id, damage);

    // 触发战斗效果（动画、粒子、音效等）
    this.triggerCombatEffects(unit, target, damage);
  }

  /**
   * 更新所有单位的战斗状态
   * 处理死亡单位的清理和状态同步
   */
  private updateUnitStates(): void {
    for (const unit of this.units.values()) {
      // Update unit position in spatial index
      this.spatialIndex.updateUnit(unit);

      // Clean up dead units from engaged targets
      if (!unit.isAlive()) {
        unit.combatState = CombatState.DEAD;
        this.cleanupDeadUnit(unit.id);
      }

      // Update combat state based on situation
      this.updateCombatState(unit);
    }
  }

  /**
   * 更新单个单位的战斗状态
   * 根据当前战斗情况调整单位状态
   * @param unit 要更新的战斗单位
   */
  private updateCombatState(unit: CombatUnit): void {
    if (!unit.isAlive()) {
      unit.combatState = CombatState.DEAD;
      return;
    }

    const hasTargets = unit.engagedTargets.size > 0;
    const validTargets = Array.from(unit.engagedTargets)
      .map(id => this.units.get(id))
      .filter(target => target && target.isAlive() && unit.canAttack(target));

    if (validTargets.length === 0) {
      if (hasTargets) {
        // Clear invalid targets
        unit.engagedTargets.clear();
      }
      unit.combatState = CombatState.IDLE;
      unit.currentTarget = undefined;
    } else {
      unit.combatState = CombatState.ENGAGING;
    }
  }

  /**
   * 清理死亡单位的战斗关系
   * 从所有单位的威胁表和交战目标中移除死亡单位
   * @param deadUnitId 死亡单位的ID
   */
  private cleanupDeadUnit(deadUnitId: string): void {
    // 从所有单位的威胁表和交战目标中移除死亡单位
    for (const unit of this.units.values()) {         // 遍历所有存活单位
      unit.engagedTargets.delete(deadUnitId);         // 从交战目标中移除
      unit.threatTable.delete(deadUnitId);            // 从威胁表中移除
    }
  }

  /**
   * 判断两个单位是否为敌对关系
   * @param unit1 第一个单位
   * @param unit2 第二个单位
   * @returns 是否为敌对关系
   */
  private areEnemies(unit1: CombatUnit, unit2: CombatUnit): boolean {
    return unit1.faction !== unit2.faction &&        // 阵营不同
           unit1.faction !== Faction.NEUTRAL;         // 且都不是中立
  }

  /**
   * 更新单位的威胁等级
   * @param unit 要更新威胁表的单位
   * @param targetId 目标单位ID
   * @param threatIncrease 威胁值增量
   */
  private updateThreatLevel(unit: CombatUnit, targetId: string, threatIncrease: number): void {
    const currentThreat = unit.threatTable.get(targetId) || 0; // 获取当前威胁值
    unit.threatTable.set(targetId, currentThreat + threatIncrease); // 更新威胁值
  }

  /**
   * 生成战斗实例的唯一ID
   * @param unitId1 第一个单位ID
   * @param unitId2 第二个单位ID
   * @returns 战斗实例ID
   */
  private getCombatId(unitId1: string, unitId2: string): string {
    return [unitId1, unitId2].sort().join('_');
  }

  /**
   * 触发战斗效果
   * 包括动画、粒子效果、音效等
   * @param attacker 攻击者单位
   * @param defender 防御者单位
   * @param damage 造成的伤害值
   */
  private triggerCombatEffects(attacker: CombatUnit, defender: CombatUnit, damage: number): void {
    // This would trigger animation systems, particle effects, sound effects, etc.
    console.log(`${attacker.name} attacks ${defender.name} for ${damage} damage`);

    // Animation triggers
    // Sound effects
    // Particle systems
    // UI updates
  }

  // Public API methods

  /**
   * 获取指定ID的战斗单位
   * @param unitId 单位ID
   * @returns 战斗单位对象或undefined
   */
  getUnit(unitId: string): CombatUnit | undefined {
    return this.units.get(unitId);
  }

  /**
   * 获取所有活跃的战斗实例
   * @returns 活跃战斗实例数组
   */
  getActiveCombats(): CombatInstance[] {
    return Array.from(this.activeCombats.values());
  }


  /**
   * 强制两个单位进入战斗状态
   * @param attackerId 攻击者单位ID
   * @param defenderId 防御者单位ID
   * @returns 是否成功强制战斗
   */
  forceCombat(attackerId: string, defenderId: string): boolean {
    const attacker = this.units.get(attackerId);
    const defender = this.units.get(defenderId);

    if (!attacker || !defender || !this.areEnemies(attacker, defender)) {
      return false;
    }

    this.handleCombatDetection(attacker, defender);
    return true;
  }

  /**
   * 切换空间索引策略
   * @param strategy 新的空间索引策略
   */
  switchSpatialStrategy(strategy: SpatialIndexStrategy): void {
    this.spatialIndex.switchStrategy(strategy);
  }

  /**
   * 获取当前使用的空间索引策略
   * @returns 当前策略
   */
  getCurrentSpatialStrategy(): SpatialIndexStrategy {
    return this.spatialIndex.getCurrentStrategy();
  }

  /**
   * 获取空间索引性能统计
   * @returns 性能统计信息
   */
  getSpatialPerformanceStats(): any {
    return this.spatialIndex.getPerformanceStats();
  }

  /**
   * 获取指定范围内的单位（通过空间索引优化）
   * @param position 中心位置
   * @param range 搜索半径
   * @returns 范围内的单位数组
   */
  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    return this.spatialIndex.getUnitsInRange(position, range);
  }

  /**
   * 获取所有潜在的战斗对
   * @returns 攻击者ID到防御者ID数组的映射
   */
  getPotentialCombats(): Map<string, string[]> {
    return this.spatialIndex.getPotentialCombats();
  }
}

/**
 * 空间索引接口
 * 定义空间分区系统的基本操作
 */
interface ISpatialIndex {
  addUnit(unit: CombatUnit): void;
  removeUnit(unit: CombatUnit): void;
  updateUnit(unit: CombatUnit): void;
  getUnitsInRange(position: Position, range: number): CombatUnit[];
  getPotentialCombats(): Map<string, string[]>;
  clear(): void;
}

/**
 * 空间分区网格系统
 * 用于优化大规模战斗单位的碰撞检测和范围查询
 */
class SpatialGrid implements ISpatialIndex {
  private grid: Map<string, CombatUnit[]> = new Map();
  private gridSize: number;

  /**
   * 创建空间网格
   * @param gridSize 每个网格单元的大小
   */
  constructor(gridSize: number) {
    this.gridSize = gridSize;
  }

  /**
   * 根据位置计算网格键
   * @param position 单位位置
   * @returns 网格坐标字符串
   */
  private getGridKey(position: Position): string {
    const x = Math.floor(position.x / this.gridSize);  // 计算X坐标网格位置
    const y = Math.floor(position.y / this.gridSize);  // 计算Y坐标网格位置
    return `${x},${y}`;                                 // 返回网格坐标字符串
  }

  /**
   * 将单位添加到空间网格
   * @param unit 要添加的单位
   */
  addUnit(unit: CombatUnit): void {
    const key = this.getGridKey(unit.position);        // 根据位置计算网格键
    if (!this.grid.has(key)) {                          // 如果网格不存在
      this.grid.set(key, []);                           // 创建新的网格单元
    }
    this.grid.get(key)!.push(unit);                    // 将单位添加到网格中
  }

  /**
   * 从空间网格中移除单位
   * @param unit 要移除的单位
   */
  removeUnit(unit: CombatUnit): void {
    const key = this.getGridKey(unit.position);
    const cell = this.grid.get(key);
    if (cell) {
      const index = cell.indexOf(unit);
      if (index !== -1) {
        cell.splice(index, 1);
      }
    }
  }

  /**
   * 更新单位在空间网格中的位置
   * @param unit 要更新的单位
   */
  updateUnit(unit: CombatUnit): void {
    this.removeUnit(unit);
    this.addUnit(unit);
  }

  /**
   * 获取指定范围内的所有单位
   * @param position 中心位置
   * @param range 搜索半径
   * @returns 范围内的单位数组
   */
  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    const units: CombatUnit[] = [];
    const startX = Math.floor((position.x - range) / this.gridSize);
    const endX = Math.floor((position.x + range) / this.gridSize);
    const startY = Math.floor((position.y - range) / this.gridSize);
    const endY = Math.floor((position.y + range) / this.gridSize);

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const key = `${x},${y}`;
        const cell = this.grid.get(key);
        if (cell) {
          for (const unit of cell) {
            if (unit.getDistanceTo({ id: '', name: '', position, faction: Faction.NEUTRAL, unitType: UnitType.INFANTRY, health: 0, maxHealth: 0, attack: 0, defense: 0, attackRange: 0, movementSpeed: 0, combatState: CombatState.IDLE, lastAttackTime: 0, attackCooldown: 0, engagedTargets: new Set(), threatTable: new Map() } as CombatUnit) <= range) {
              units.push(unit);
            }
          }
        }
      }
    }

    return units;
  }

  /**
   * 获取所有潜在的战斗对
   * @returns 攻击者ID到防御者ID数组的映射
   */
  getPotentialCombats(): Map<string, string[]> {
    const combats = new Map<string, string[]>();

    for (const cell of this.grid.values()) {
      for (let i = 0; i < cell.length; i++) {
        for (let j = i + 1; j < cell.length; j++) {
          const unit1 = cell[i];
          const unit2 = cell[j];

          // Only check potential combat for enemy units
          if (unit1.faction !== unit2.faction) {
            if (!combats.has(unit1.id)) {
              combats.set(unit1.id, []);
            }
            combats.get(unit1.id)!.push(unit2.id);
          }
        }
      }
    }

    return combats;
  }

  /**
   * 清空所有网格数据
   */
  clear(): void {
    this.grid.clear();
  }
}

/**
 * 四叉树节点
 * 表示四叉树中的一个节点，包含边界和单位数据
 */
class QuadTreeNode {
  units: CombatUnit[] = [];                                    // 当前节点存储的单位列表
  children: QuadTreeNode[] = [];                               // 子节点数组（四个象限）
  bounds: { x: number; y: number; width: number; height: number }; // 节点边界

  constructor(bounds: { x: number; y: number; width: number; height: number }) {
    this.bounds = bounds;                                      // 初始化节点边界
  }

  /**
   * 判断点是否在边界内
   */
  contains(x: number, y: number): boolean {
    return x >= this.bounds.x &&                           // X坐标大于等于左边界
           x < this.bounds.x + this.bounds.width &&        // X坐标小于右边界
           y >= this.bounds.y &&                           // Y坐标大于等于上边界
           y < this.bounds.y + this.bounds.height;         // Y坐标小于下边界
  }

  /**
   * 判断边界是否与圆相交
   */
  intersects(x: number, y: number, radius: number): boolean {
    const closestX = Math.max(this.bounds.x, Math.min(x, this.bounds.x + this.bounds.width)); // 计算圆心到边界最近的X点
    const closestY = Math.max(this.bounds.y, Math.min(y, this.bounds.y + this.bounds.height)); // 计算圆心到边界最近的Y点
    const distanceX = x - closestX;                        // X方向距离
    const distanceY = y - closestY;                        // Y方向距离
    return (distanceX * distanceX + distanceY * distanceY) <= (radius * radius); // 判断是否在圆内
  }

  /**
   * 细分节点
   */
  subdivide(): void {
    const { x, y, width, height } = this.bounds;           // 解构边界属性
    const halfWidth = width / 2;                           // 计算半宽度
    const halfHeight = height / 2;                         // 计算半高度

    this.children = [
      new QuadTreeNode({ x: x, y: y, width: halfWidth, height: halfHeight }),           // 创建左上子节点
      new QuadTreeNode({ x: x + halfWidth, y: y, width: halfWidth, height: halfHeight }), // 创建右上子节点
      new QuadTreeNode({ x: x, y: y + halfHeight, width: halfWidth, height: halfHeight }), // 创建左下子节点
      new QuadTreeNode({ x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight }) // 创建右下子节点
    ];
  }
}

/**
 * 四叉树空间索引
 * 适用于超大地图，单位密度不均匀的情况
 */
class QuadTreeSpatialIndex implements ISpatialIndex {
  private root: QuadTreeNode;                               // 四叉树根节点
  private maxUnitsPerNode: number;                          // 每个节点最大单位数
  private maxDepth: number;                                 // 树的最大深度

  /**
   * 创建四叉树空间索引
   * @param bounds 根节点边界
   * @param maxUnitsPerNode 每个节点最大单位数
   * @param maxDepth 最大深度
   */
  constructor(
    bounds: { x: number; y: number; width: number; height: number },
    maxUnitsPerNode: number = 8,
    maxDepth: number = 8
  ) {
    this.root = new QuadTreeNode(bounds);                  // 创建根节点
    this.maxUnitsPerNode = maxUnitsPerNode;                 // 设置最大单位数
    this.maxDepth = maxDepth;                               // 设置最大深度
  }

  addUnit(unit: CombatUnit): void {
    this.insert(this.root, unit, 0);                        // 从根节点开始插入单位
  }

  removeUnit(unit: CombatUnit): void {
    this.removeFromNode(this.root, unit);                   // 从根节点开始移除单位
  }

  updateUnit(unit: CombatUnit): void {
    this.removeUnit(unit);                                  // 先移除旧位置的单位
    this.addUnit(unit);                                     // 再添加到新位置
  }

  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    const units: CombatUnit[] = [];                         // 创建结果数组
    this.queryRange(this.root, position.x, position.y, range, units); // 执行范围查询
    return units;                                           // 返回查询结果
  }

  getPotentialCombats(): Map<string, string[]> {
    const combats = new Map<string, string[]>();           // 创建战斗对映射
    this.findPotentialCombats(this.root, combats);         // 查找所有潜在战斗
    return combats;                                         // 返回战斗对结果
  }

  clear(): void {
    this.root = new QuadTreeNode(this.root.bounds);         // 重置根节点，清空所有数据
  }

  /**
   * 递归插入单位到四叉树
   */
  private insert(node: QuadTreeNode, unit: CombatUnit, depth: number): void {
    if (!node.contains(unit.position.x, unit.position.y)) {   // 如果单位不在节点边界内
      return;                                                 // 直接返回，不插入
    }

    if (node.children.length === 0 && (node.units.length < this.maxUnitsPerNode || depth >= this.maxDepth)) {
      // 节点没有子节点，且单位数未超限或已达最大深度
      node.units.push(unit);                                 // 直接添加到当前节点
    } else {
      // 需要细分或添加到子节点
      if (node.children.length === 0) {                      // 如果还没有子节点
        node.subdivide();                                    // 细分当前节点
        // 将现有单位重新分配到子节点
        const existingUnits = [...node.units];               // 复制现有单位
        node.units = [];                                     // 清空当前节点单位
        for (const existingUnit of existingUnits) {          // 重新插入每个现有单位
          this.insert(node, existingUnit, depth);
        }
      }

      // 添加到合适的子节点
      for (const child of node.children) {                   // 遍历所有子节点
        if (child.contains(unit.position.x, unit.position.y)) { // 找到包含单位的子节点
          this.insert(child, unit, depth + 1);              // 递归插入到子节点
          break;                                             // 找到后停止遍历
        }
      }
    }
  }

  /**
   * 从节点中移除单位
   */
  private removeFromNode(node: QuadTreeNode, unit: CombatUnit): boolean {
    const index = node.units.findIndex(u => u.id === unit.id); // 查找单位在当前节点的索引
    if (index !== -1) {                                      // 如果找到单位
      node.units.splice(index, 1);                           // 从数组中移除单位
      return true;                                           // 返回成功标识
    }

    for (const child of node.children) {                     // 遍历子节点
      if (child.contains(unit.position.x, unit.position.y)) { // 如果子节点包含单位位置
        if (this.removeFromNode(child, unit)) {              // 递归移除
          return true;                                       // 返回成功标识
        }
      }
    }

    return false;                                            // 移除失败
  }

  /**
   * 查询范围内的单位
   */
  private queryRange(node: QuadTreeNode, x: number, y: number, range: number, result: CombatUnit[]): void {
    if (!node.intersects(x, y, range)) {                   // 如果节点不与查询圆相交
      return;                                              // 直接返回，不需要检查
    }

    // 检查当前节点的单位
    for (const unit of node.units) {                       // 遍历当前节点的所有单位
      const distance = Math.sqrt(                          // 计算单位到查询点的距离
        Math.pow(unit.position.x - x, 2) + Math.pow(unit.position.y - y, 2)
      );
      if (distance <= range) {                             // 如果单位在查询范围内
        result.push(unit);                                 // 添加到结果数组
      }
    }

    // 递归检查子节点
    for (const child of node.children) {                   // 遍历所有子节点
      this.queryRange(child, x, y, range, result);        // 递归查询子节点
    }
  }

  /**
   * 查找潜在战斗对
   */
  private findPotentialCombats(node: QuadTreeNode, combats: Map<string, string[]>): void {
    // 检查当前节点的单位之间的战斗
    for (let i = 0; i < node.units.length; i++) {          // 遍历所有单位对
      for (let j = i + 1; j < node.units.length; j++) {    // 避免重复比较
        const unit1 = node.units[i];                       // 获取第一个单位
        const unit2 = node.units[j];                       // 获取第二个单位
        if (unit1.faction !== unit2.faction) {             // 如果属于不同阵营
          if (!combats.has(unit1.id)) {                    // 如果映射中没有该单位
            combats.set(unit1.id, []);                     // 创建新的数组
          }
          combats.get(unit1.id)!.push(unit2.id);           // 添加潜在对手
        }
      }
    }

    // 递归检查子节点
    for (const child of node.children) {                   // 遍历所有子节点
      this.findPotentialCombats(child, combats);          // 递归查找子节点
    }
  }
}

/**
 * 分层网格系统
 * 结合粗网格和细网格，根据密度自动切换
 */
class HierarchicalSpatialGrid implements ISpatialIndex {
  private coarseGrid: SpatialGrid;                           // 粗网格，用于大范围、低密度区域
  private fineGrid: SpatialGrid;                             // 细网格，用于小范围、高密度区域
  private coarseThreshold: number;                           // 切换到细网格的单位密度阈值

  constructor(coarseGridSize: number, fineGridSize: number, coarseThreshold: number = 100) {
    this.coarseGrid = new SpatialGrid(coarseGridSize);      // 初始化粗网格
    this.fineGrid = new SpatialGrid(fineGridSize);          // 初始化细网格
    this.coarseThreshold = coarseThreshold;                 // 设置密度阈值
  }

  addUnit(unit: CombatUnit): void {
    this.getOptimalGrid(unit).addUnit(unit);                // 根据密度选择最优网格并添加单位
  }

  removeUnit(unit: CombatUnit): void {
    // 尝试从两个网格中移除（确保从正确的网格移除）
    this.coarseGrid.removeUnit(unit);                      // 从粗网格尝试移除
    this.fineGrid.removeUnit(unit);                        // 从细网格尝试移除
  }

  updateUnit(unit: CombatUnit): void {
    this.removeUnit(unit);                                 // 先移除旧位置的单位
    this.addUnit(unit);                                    // 再添加到新位置的最优网格
  }

  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    const units = new Set<CombatUnit>();                   // 使用Set避免重复单位

    // 从粗网格获取单位
    const coarseUnits = this.coarseGrid.getUnitsInRange(position, range); // 查询粗网格
    coarseUnits.forEach(unit => units.add(unit));          // 添加到结果集合

    // 从细网格获取单位
    const fineUnits = this.fineGrid.getUnitsInRange(position, range); // 查询细网格
    fineUnits.forEach(unit => units.add(unit));            // 添加到结果集合

    return Array.from(units);                              // 转换为数组返回
  }

  getPotentialCombats(): Map<string, string[]> {
    const combats = new Map<string, string[]>();           // 创建战斗对映射

    // 合并两个网格的战斗检测结果
    const coarseCombats = this.coarseGrid.getPotentialCombats(); // 获取粗网格战斗对
    const fineCombats = this.fineGrid.getPotentialCombats(); // 获取细网格战斗对

    // 合并粗网格结果
    for (const [attackerId, defenderIds] of coarseCombats) { // 遍历粗网格战斗对
      if (!combats.has(attackerId)) {                      // 如果结果中没有该攻击者
        combats.set(attackerId, []);                       // 创建新的防御者数组
      }
      combats.get(attackerId)!.push(...defenderIds);      // 添加所有防御者
    }

    // 合并细网格结果
    for (const [attackerId, defenderIds] of fineCombats) { // 遍历细网格战斗对
      if (!combats.has(attackerId)) {                      // 如果结果中没有该攻击者
        combats.set(attackerId, []);                       // 创建新的防御者数组
      }
      combats.get(attackerId)!.push(...defenderIds);      // 添加所有防御者
    }

    return combats;                                        // 返回合并后的战斗对
  }

  clear(): void {
    this.coarseGrid.clear();                               // 清空粗网格
    this.fineGrid.clear();                                 // 清空细网格
  }

  /**
   * 根据单位密度选择最优网格
   */
  private getOptimalGrid(unit: CombatUnit): SpatialGrid {
    const key = this.getGridKey(unit.position, this.coarseGrid['gridSize']); // 计算粗网格键
    const coarseCell = this.coarseGrid['grid'].get(key); // 获取粗网格对应单元

    // 如果粗网格中单位密度过高，使用细网格
    if (coarseCell && coarseCell.length >= this.coarseThreshold) { // 检查密度是否超过阈值
      return this.fineGrid;                               // 返回细网格
    }

    return this.coarseGrid;                               // 返回粗网格
  }

  /**
   * 获取网格键（复制SpatialGrid的逻辑）
   */
  private getGridKey(position: Position, gridSize: number): string {
    const x = Math.floor(position.x / gridSize);         // 计算X坐标的网格索引
    const y = Math.floor(position.y / gridSize);         // 计算Y坐标的网格索引
    return `${x},${y}`;                                   // 返回网格坐标字符串
  }
}

/**
 * 自适应网格系统
 * 根据单位密度动态调整网格大小
 */
class AdaptiveSpatialGrid implements ISpatialIndex {
  private grids: Map<number, SpatialGrid> = new Map();         // 网格大小 -> 网格实例映射
  private unitGridMap: Map<string, number> = new Map();        // 单位ID -> 网格大小映射
  private baseGridSize: number;                                 // 基础网格大小
  private maxGridSize: number;                                  // 最大网格大小
  private densityThreshold: number;                             // 密度阈值

  constructor(baseGridSize: number = 50, maxGridSize: number = 400, densityThreshold: number = 20) {
    this.baseGridSize = baseGridSize;                          // 设置基础网格大小
    this.maxGridSize = maxGridSize;                            // 设置最大网格大小
    this.densityThreshold = densityThreshold;                  // 设置密度阈值
  }

  addUnit(unit: CombatUnit): void {
    const optimalGridSize = this.calculateOptimalGridSize(unit.position); // 计算最优网格大小
    this.getOrCreateGrid(optimalGridSize).addUnit(unit); // 获取或创建网格并添加单位
    this.unitGridMap.set(unit.id, optimalGridSize);      // 记录单位使用的网格大小
  }

  removeUnit(unit: CombatUnit): void {
    const gridSize = this.unitGridMap.get(unit.id);      // 获取单位使用的网格大小
    if (gridSize) {                                       // 如果找到了网格大小
      const grid = this.grids.get(gridSize);              // 获取对应的网格实例
      if (grid) {                                          // 如果网格存在
        grid.removeUnit(unit);                            // 从网格中移除单位
      }
      this.unitGridMap.delete(unit.id);                   // 删除单位网格映射记录
    }
  }

  updateUnit(unit: CombatUnit): void {
    this.removeUnit(unit);                                // 先移除旧位置的单位
    this.addUnit(unit);                                   // 再添加到新位置的最优网格
  }

  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    const units = new Set<CombatUnit>();                   // 使用Set避免重复单位

    // 从所有网格中收集单位
    for (const grid of this.grids.values()) {              // 遍历所有网格实例
      const gridUnits = grid.getUnitsInRange(position, range); // 从每个网格查询单位
      gridUnits.forEach(unit => units.add(unit));          // 添加到结果集合（自动去重）
    }

    return Array.from(units);                              // 转换为数组返回
  }

  getPotentialCombats(): Map<string, string[]> {
    const combats = new Map<string, string[]>();          // 创建战斗对映射

    // 合并所有网格的战斗检测结果
    for (const grid of this.grids.values()) {              // 遍历所有网格实例
      const gridCombats = grid.getPotentialCombats();     // 获取每个网格的战斗对
      for (const [attackerId, defenderIds] of gridCombats) { // 遍历战斗对
        if (!combats.has(attackerId)) {                    // 如果结果中没有该攻击者
          combats.set(attackerId, []);                     // 创建新的防御者数组
        }
        combats.get(attackerId)!.push(...defenderIds);    // 添加所有防御者
      }
    }

    return combats;                                        // 返回合并后的战斗对
  }

  clear(): void {
    this.grids.clear();                                    // 清空所有网格实例
    this.unitGridMap.clear();                               // 清空单位网格映射
  }

  /**
   * 计算最优网格大小
   */
  private calculateOptimalGridSize(position: Position): number {
    // 计算该区域的单位密度
    const sampleRange = this.baseGridSize * 2;             // 设置采样范围
    let density = 0;                                       // 初始化密度计数

    for (const [gridSize, grid] of this.grids) {           // 遍历所有网格
      const unitsInRange = grid.getUnitsInRange(position, sampleRange); // 查询范围内单位
      density += unitsInRange.length;                      // 累加单位数量
    }

    // 根据密度选择网格大小
    if (density < this.densityThreshold) {                 // 密度低于阈值
      return this.baseGridSize;                            // 使用基础网格大小
    } else if (density < this.densityThreshold * 2) {      // 密度中等
      return this.baseGridSize * 2;                        // 使用2倍网格大小
    } else {                                               // 密度很高
      return Math.min(this.baseGridSize * 4, this.maxGridSize); // 使用4倍大小或最大值
    }
  }

  /**
   * 获取或创建指定大小的网格
   */
  private getOrCreateGrid(gridSize: number): SpatialGrid {
    if (!this.grids.has(gridSize)) {                       // 如果该大小的网格不存在
      this.grids.set(gridSize, new SpatialGrid(gridSize)); // 创建新的网格实例
    }
    return this.grids.get(gridSize)!;                      // 返回对应的网格实例
  }
}

/**
 * 空间索引策略枚举
 * 定义可用的空间索引策略类型
 */
export enum SpatialIndexStrategy {
  UNIFORM_GRID = 'uniform_grid',           // 均匀网格 - 适用于密度均匀的场景
  QUAD_TREE = 'quad_tree',                 // 四叉树 - 适用于超大地图，不均匀密度
  HIERARCHICAL = 'hierarchical',           // 分层网格 - 结合粗细网格的混合策略
  ADAPTIVE = 'adaptive'                    // 自适应网格 - 根据密度动态调整
}

/**
 * 空间索引管理器
 * 负责管理和切换不同的空间索引策略
 */
export class SpatialIndexManager {
  private currentStrategy: SpatialIndexStrategy;          // 当前使用的策略
  private currentIndex: ISpatialIndex;                     // 当前的空间索引实例
  private strategyConfigs: Map<SpatialIndexStrategy, any>; // 策略配置映射
  private unitProvider?: () => CombatUnit[];              // 单位提供者函数

  constructor(
    initialStrategy: SpatialIndexStrategy = SpatialIndexStrategy.UNIFORM_GRID,
    unitProvider?: () => CombatUnit[]
  ) {
    this.currentStrategy = initialStrategy;               // 设置初始策略
    this.unitProvider = unitProvider;                      // 设置单位提供者
    this.strategyConfigs = new Map();                      // 初始化配置映射
    this.initializeStrategies();                           // 初始化所有策略配置
    this.currentIndex = this.createSpatialIndex(initialStrategy); // 创建初始索引实例
  }

  /**
   * 切换空间索引策略
   */
  switchStrategy(strategy: SpatialIndexStrategy): void {
    if (strategy === this.currentStrategy) {              // 如果已经是当前策略
      return;                                              // 直接返回，不需要切换
    }

    // 保存当前单位
    const allUnits = this.getAllUnits();                   // 获取所有当前单位

    // 创建新的索引
    const newIndex = this.createSpatialIndex(strategy);   // 创建新策略的索引实例

    // 重新添加所有单位
    for (const unit of allUnits) {                         // 遍历所有单位
      newIndex.addUnit(unit);                              // 将单位添加到新索引
    }

    // 切换索引
    this.currentStrategy = strategy;                       // 更新当前策略
    this.currentIndex = newIndex;                          // 切换到新索引实例

    console.log(`Switched to ${strategy} spatial index strategy`); // 记录切换日志
  }

  /**
   * 添加单位
   */
  addUnit(unit: CombatUnit): void {
    this.currentIndex.addUnit(unit);                      // 委托给当前索引实例
  }

  /**
   * 移除单位
   */
  removeUnit(unit: CombatUnit): void {
    this.currentIndex.removeUnit(unit);                   // 委托给当前索引实例
  }

  /**
   * 更新单位
   */
  updateUnit(unit: CombatUnit): void {
    this.currentIndex.updateUnit(unit);                   // 委托给当前索引实例
  }

  /**
   * 获取范围内的单位
   */
  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    return this.currentIndex.getUnitsInRange(position, range); // 委托给当前索引实例
  }

  /**
   * 获取潜在战斗对
   */
  getPotentialCombats(): Map<string, string[]> {
    return this.currentIndex.getPotentialCombats();      // 委托给当前索引实例
  }

  /**
   * 获取当前策略
   */
  getCurrentStrategy(): SpatialIndexStrategy {
    return this.currentStrategy;                          // 返回当前策略类型
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats(): any {
    return {
      strategy: this.currentStrategy,                     // 当前策略类型
      unitCount: this.getAllUnits().length,               // 当前单位数量
      // 可以添加更多性能指标
    };
  }

  /**
   * 初始化策略配置
   */
  private initializeStrategies(): void {
    // 均匀网格配置
    this.strategyConfigs.set(SpatialIndexStrategy.UNIFORM_GRID, {
      gridSize: 50                                        // 网格单元大小
    });

    // 四叉树配置
    this.strategyConfigs.set(SpatialIndexStrategy.QUAD_TREE, {
      bounds: { x: -10000, y: -10000, width: 20000, height: 20000 }, // 根节点边界
      maxUnitsPerNode: 8,                                 // 每个节点最大单位数
      maxDepth: 8                                         // 树的最大深度
    });

    // 分层网格配置
    this.strategyConfigs.set(SpatialIndexStrategy.HIERARCHICAL, {
      coarseGridSize: 100,                                // 粗网格大小
      fineGridSize: 25,                                   // 细网格大小
      coarseThreshold: 50                                 // 切换阈值
    });

    // 自适应网格配置
    this.strategyConfigs.set(SpatialIndexStrategy.ADAPTIVE, {
      baseGridSize: 50,                                   // 基础网格大小
      maxGridSize: 400,                                   // 最大网格大小
      densityThreshold: 20                                // 密度阈值
    });
  }

  /**
   * 创建空间索引实例
   */
  private createSpatialIndex(strategy: SpatialIndexStrategy): ISpatialIndex {
    const config = this.strategyConfigs.get(strategy);      // 获取策略配置

    switch (strategy) {                                      // 根据策略类型创建实例
      case SpatialIndexStrategy.UNIFORM_GRID:
        return new SpatialGrid(config.gridSize);            // 创建均匀网格实例

      case SpatialIndexStrategy.QUAD_TREE:
        return new QuadTreeSpatialIndex(                    // 创建四叉树实例
          config.bounds,
          config.maxUnitsPerNode,
          config.maxDepth
        );

      case SpatialIndexStrategy.HIERARCHICAL:
        return new HierarchicalSpatialGrid(                 // 创建分层网格实例
          config.coarseGridSize,
          config.fineGridSize,
          config.coarseThreshold
        );

      case SpatialIndexStrategy.ADAPTIVE:
        return new AdaptiveSpatialGrid(                     // 创建自适应网格实例
          config.baseGridSize,
          config.maxGridSize,
          config.densityThreshold
        );

      default:
        throw new Error(`Unknown spatial index strategy: ${strategy}`); // 未知策略错误
    }
  }

  /**
   * 获取所有单位（用于策略切换）
   */
  private getAllUnits(): CombatUnit[] {
    // 通过unitProvider获取所有单位
    return this.unitProvider ? this.unitProvider() : [];    // 如果有提供者则调用，否则返回空数组
  }
}

/**
 * 战斗实例类
 * 表示一场正在进行的战斗，包含所有参与者
 */
class CombatInstance {
  public participants: Set<string> = new Set();            // 参与战斗的单位ID集合
  public lastActivity: number = Date.now();                // 最后活动时间戳

  /**
   * 创建战斗实例
   * @param id 战斗实例的唯一标识符
   */
  constructor(public id: string) {                         // 战斗实例ID
    // 构造函数体为空，初始化由属性默认值处理
  }
}

/**
 * 示例战斗单位实现
 * 实现了CombatUnit接口的完整单位类
 */
export class ExampleUnit implements CombatUnit {
  engagedTargets: Set<string> = new Set();
  threatTable: Map<string, number> = new Map();

  /**
   * 创建示例战斗单位
   * @param id 单位唯一标识符
   * @param name 单位名称
   * @param position 单位位置
   * @param faction 单位阵营
   * @param unitType 单位类型
   * @param health 当前生命值
   * @param maxHealth 最大生命值
   * @param attack 攻击力
   * @param defense 防御力
   * @param attackRange 攻击范围
   * @param movementSpeed 移动速度
   * @param combatState 战斗状态
   * @param currentTarget 当前目标ID
   * @param lastAttackTime 最后攻击时间
   * @param attackCooldown 攻击冷却时间
   */
  constructor(
    public id: string,                                       // 单位唯一标识符
    public name: string,                                     // 单位显示名称
    public position: Position,                               // 单位当前位置
    public faction: Faction,                                 // 单位所属阵营
    public unitType: UnitType,                               // 单位类型（步兵、弓箭手等）
    public health: number,                                   // 当前生命值
    public maxHealth: number,                                // 最大生命值
    public attack: number,                                   // 攻击力
    public defense: number,                                  // 防御力
    public attackRange: number,                              // 攻击范围
    public movementSpeed: number,                            // 移动速度
    public combatState: CombatState = CombatState.IDLE,     // 当前战斗状态
    public currentTarget?: string,                           // 当前攻击目标ID
    public lastAttackTime: number = 0,                       // 最后攻击时间戳
    public attackCooldown: number = 1000                     // 攻击冷却时间
  ) {
    // 构造函数体为空，所有初始化都通过参数和默认值处理
  }

  /**
   * 更新单位逻辑
   * @param deltaTime 时间增量
   */
  update(deltaTime: number): void {
    // Update unit logic here
  }

  /**
   * 检查是否可以攻击目标
   * @param target 目标单位
   * @returns 是否可以攻击
   */
  canAttack(target: CombatUnit): boolean {
    return this.isAlive() && target.isAlive() &&
           this.getDistanceTo(target) <= this.attackRange;
  }

  /**
   * 计算对目标造成的伤害
   * @param target 目标单位
   * @returns 伤害值
   */
  calculateDamage(target: CombatUnit): number {
    const baseDamage = this.attack - target.defense;
    const damageMultiplier = this.getTypeMultiplier(this.unitType, target.unitType);
    return Math.max(1, Math.floor(baseDamage * damageMultiplier));
  }

  /**
   * 承受伤害
   * @param damage 受到的伤害值
   */
  takeDamage(damage: number): void {
    this.health = Math.max(0, this.health - damage);
    if (this.health === 0) {
      this.combatState = CombatState.DEAD;
    }
  }

  /**
   * 检查单位是否存活
   * @returns 是否存活
   */
  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * 计算到目标单位的距离
   * @param target 目标单位
   * @returns 距离值
   */
  getDistanceTo(target: CombatUnit): number {
    const dx = this.position.x - target.position.x;
    const dy = this.position.y - target.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 获取类型相克倍率
   * @param attackerType 攻击者类型
   * @param defenderType 防御者类型
   * @returns 伤害倍率
   */
  private getTypeMultiplier(attackerType: UnitType, defenderType: UnitType): number {
    // Type advantage system - complete mapping for all unit types
    const typeChart: Record<UnitType, Record<UnitType, number>> = {
      [UnitType.INFANTRY]: {
        [UnitType.INFANTRY]: 1.0,
        [UnitType.CAVALRY]: 1.2,
        [UnitType.ARCHER]: 0.8,
        [UnitType.SIEGE]: 1.0,
        [UnitType.MAGE]: 1.0
      },
      [UnitType.ARCHER]: {
        [UnitType.INFANTRY]: 1.2,
        [UnitType.CAVALRY]: 0.8,
        [UnitType.ARCHER]: 1.0,
        [UnitType.SIEGE]: 1.0,
        [UnitType.MAGE]: 1.0
      },
      [UnitType.CAVALRY]: {
        [UnitType.INFANTRY]: 0.8,
        [UnitType.CAVALRY]: 1.0,
        [UnitType.ARCHER]: 1.2,
        [UnitType.SIEGE]: 1.0,
        [UnitType.MAGE]: 1.0
      },
      [UnitType.SIEGE]: {
        [UnitType.INFANTRY]: 2.0,
        [UnitType.CAVALRY]: 1.0,
        [UnitType.ARCHER]: 1.0,
        [UnitType.SIEGE]: 1.0,
        [UnitType.MAGE]: 1.0
      },
      [UnitType.MAGE]: {
        [UnitType.INFANTRY]: 1.0,
        [UnitType.CAVALRY]: 1.5,
        [UnitType.ARCHER]: 1.0,
        [UnitType.SIEGE]: 1.0,
        [UnitType.MAGE]: 0.7
      }
    };

    return typeChart[attackerType][defenderType];
  }
}

/**
 * 创建示例战斗系统
 * 用于演示和测试实时战斗系统的功能
 * @returns 配置好的实时战斗管理器实例
 */
export function createExampleCombatSystem(): RealTimeCombatManager {
  const combatSystem = new RealTimeCombatManager();

  // Create player units
  const playerUnit1 = new ExampleUnit(
    'player_1', 'Player Infantry', { x: 100, y: 100 }, Faction.PLAYER, UnitType.INFANTRY,
    100, 100, 20, 10, 30, 5
  );

  const playerUnit2 = new ExampleUnit(
    'player_2', 'Player Archer', { x: 120, y: 100 }, Faction.PLAYER, UnitType.ARCHER,
    80, 80, 25, 5, 50, 4
  );

  // Create enemy units
  const enemyUnit1 = new ExampleUnit(
    'enemy_1', 'Enemy Infantry', { x: 150, y: 150 }, Faction.ENEMY, UnitType.INFANTRY,
    90, 90, 18, 12, 25, 5
  );

  const enemyUnit2 = new ExampleUnit(
    'enemy_2', 'Enemy Cavalry', { x: 160, y: 160 }, Faction.ENEMY, UnitType.CAVALRY,
    110, 110, 22, 8, 40, 8
  );

  combatSystem.addUnit(playerUnit1);
  combatSystem.addUnit(playerUnit2);
  combatSystem.addUnit(enemyUnit1);
  combatSystem.addUnit(enemyUnit2);

  return combatSystem;
}
