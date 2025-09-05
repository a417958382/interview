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
  private spatialGrid: SpatialGrid;                           // 空间分区网格，用于性能优化
  private activeCombats: Map<string, CombatInstance> = new Map(); // 当前活跃的战斗实例
  private updateInterval: number = 100;                       // 更新间隔时间（毫秒）
  private lastUpdate: number = 0;                             // 最后更新时间戳

  /**
   * 创建实时战斗管理器
   * @param gridSize 空间网格大小，用于性能优化
   */
  constructor(gridSize: number = 50) {
    this.spatialGrid = new SpatialGrid(gridSize);            // 初始化空间分区网格
  }

  /**
   * 添加战斗单位到战斗系统中
   * @param unit 要添加的战斗单位
   */
  addUnit(unit: CombatUnit): void {
    this.units.set(unit.id, unit);                    // 将单位添加到单位映射表
    this.spatialGrid.addUnit(unit);                   // 将单位注册到空间分区网格
  }

  /**
   * 从战斗系统中移除战斗单位
   * @param unitId 要移除的单位ID
   */
  removeUnit(unitId: string): void {
    const unit = this.units.get(unitId);              // 从映射表中查找单位
    if (unit) {                                       // 如果单位存在
      this.spatialGrid.removeUnit(unit);              // 从空间网格中移除
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
    // 获取所有潜在的战斗对（通过空间分区优化）
    const potentialCombats = this.spatialGrid.getPotentialCombats();

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
      // Update unit position in spatial grid
      this.spatialGrid.updateUnit(unit);

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
   * 获取指定位置和范围内的所有单位
   * @param position 中心位置
   * @param range 搜索半径
   * @returns 范围内的单位数组
   */
  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    return this.spatialGrid.getUnitsInRange(position, range);
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
}

/**
 * 空间分区网格系统
 * 用于优化大规模战斗单位的碰撞检测和范围查询
 */
class SpatialGrid {
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
}

/**
 * 战斗实例类
 * 表示一场正在进行的战斗，包含所有参与者
 */
class CombatInstance {
  public participants: Set<string> = new Set();
  public lastActivity: number = Date.now();

  /**
   * 创建战斗实例
   * @param id 战斗实例的唯一标识符
   */
  constructor(public id: string) {}
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
    public id: string,
    public name: string,
    public position: Position,
    public faction: Faction,
    public unitType: UnitType,
    public health: number,
    public maxHealth: number,
    public attack: number,
    public defense: number,
    public attackRange: number,
    public movementSpeed: number,
    public combatState: CombatState = CombatState.IDLE,
    public currentTarget?: string,
    public lastAttackTime: number = 0,
    public attackCooldown: number = 1000
  ) {}

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
