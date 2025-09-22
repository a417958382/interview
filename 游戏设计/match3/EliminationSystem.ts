import { 
  GameGrid, 
  MatchResult, 
  EliminationResult, 
  EliminatedGem, 
  SpecialEffect, 
  GravityResult, 
  FillResult, 
  CascadeResult,
  Position,
  GemType,
  EliminationConfig
} from './types';
import { MatchDetector } from './MatchDetector';
import { GravitySystem } from './GravitySystem';
import { FillSystem } from './FillSystem';

/**
 * 消除系统 - 核心消除引擎，负责处理匹配检测、消除执行、重力下落和连锁反应
 */
export class EliminationSystem {
  private config: EliminationConfig;
  private eliminationQueue: MatchResult[] = [];

  constructor(config?: Partial<EliminationConfig>) {
    this.config = {
      baseScorePerGem: 10,
      matchLengthMultiplier: 1.5,
      specialGemMultiplier: 2.0,
      comboTimeWindow: 3.0,
      maxComboMultiplier: 5.0,
      comboDecayRate: 0.1,
      chainReactionMultiplier: 1.2,
      maxChainLength: 10,
      chainBonusThreshold: 3,
      ...config
    };
  }

  /**
   * 查找所有匹配
   */
  findMatches(grid: GameGrid): MatchResult[] {
    return MatchDetector.findAllMatches(grid);
  }

  /**
   * 执行消除
   */
  async executeElimination(grid: GameGrid, matches: MatchResult[]): Promise<EliminationResult> {
    const eliminatedGems: EliminatedGem[] = [];
    const specialEffects: SpecialEffect[] = [];
    let totalScore = 0;

    // 按优先级排序匹配
    const sortedMatches = this.optimizeEliminationSequence(matches);

    for (const match of sortedMatches) {
      // 处理普通消除
      const matchResult = await this.processMatch(grid, match);
      eliminatedGems.push(...matchResult.eliminatedGems);
      specialEffects.push(...matchResult.specialEffects);
      totalScore += matchResult.score;
    }

    return {
      eliminatedGems,
      specialEffects,
      score: totalScore,
      comboCount: this.calculateComboCount(eliminatedGems.length)
    };
  }

  /**
   * 处理单个匹配
   */
  private async processMatch(grid: GameGrid, match: MatchResult): Promise<EliminationResult> {
    const eliminatedGems: EliminatedGem[] = [];
    const specialEffects: SpecialEffect[] = [];

    // 消除匹配的宝石
    for (const position of match.positions) {
      const cell = grid.cells[position.row]?.[position.col];
      if (cell?.gem) {
        eliminatedGems.push({
          position,
          gem: cell.gem,
          score: this.calculateGemScore(cell.gem, match.length)
        });

        // 清空单元格
        cell.gem = null;
        cell.isEmpty = true;
      }
    }

    // 生成特殊元素
    const specialGem = this.generateSpecialGem(match);
    if (specialGem) {
      const specialPosition = this.findSpecialGemPosition(match);
      specialEffects.push({
        type: 'create_special',
        position: specialPosition,
        gemType: specialGem
      });
    }

    const score = eliminatedGems.reduce((sum, gem) => sum + gem.score, 0);

    return {
      eliminatedGems,
      specialEffects,
      score,
      comboCount: 1
    };
  }

  /**
   * 计算宝石分数
   */
  private calculateGemScore(gem: any, matchLength: number): number {
    const baseScore = gem.baseScore || this.config.baseScorePerGem;
    const lengthBonus = (matchLength - 3) * 5; // 超过3个的额外分数
    const specialMultiplier = gem.isSpecial ? this.config.specialGemMultiplier : 1;
    
    return Math.floor((baseScore + lengthBonus) * specialMultiplier);
  }

  /**
   * 生成特殊元素
   */
  private generateSpecialGem(match: MatchResult): GemType | null {
    if (match.length >= 5) {
      return GemType.SPECIAL_COLOR; // 5个或以上生成同色消除
    }
    
    if (match.length === 4) {
      return match.direction === 'horizontal' 
        ? GemType.SPECIAL_LINE_H 
        : GemType.SPECIAL_LINE_V;
    }
    
    if (match.length === 3) {
      // 检查是否为L形或T形匹配
      return this.checkSpecialShape(match) ? GemType.SPECIAL_BOMB : null;
    }
    
    return null;
  }

  /**
   * 检查特殊形状匹配
   */
  private checkSpecialShape(match: MatchResult): boolean {
    // 简化的特殊形状检测
    // 实际实现中需要更复杂的几何检测
    return match.positions.length > 3;
  }

  /**
   * 找到特殊元素生成位置
   */
  private findSpecialGemPosition(match: MatchResult): Position {
    // 返回匹配的中心位置
    const centerIndex = Math.floor(match.positions.length / 2);
    const centerPos = match.positions[centerIndex];
    const firstPos = match.positions[0];
    return centerPos || firstPos || { row: 0, col: 0 };
  }

  /**
   * 优化消除序列
   */
  private optimizeEliminationSequence(matches: MatchResult[]): MatchResult[] {
    return matches.sort((a, b) => {
      // 特殊元素优先级
      const aSpecial = this.isSpecialGem(a.type);
      const bSpecial = this.isSpecialGem(b.type);

      if (aSpecial !== bSpecial) {
        return aSpecial ? -1 : 1;
      }

      // 长度优先
      if (a.length !== b.length) {
        return b.length - a.length;
      }

      // 位置优先（左上优先）
      const aPos = a.positions[0];
      const bPos = b.positions[0];

      if (aPos && bPos) {
        if (aPos.row !== bPos.row) {
          return aPos.row - bPos.row;
        }
        return aPos.col - bPos.col;
      }
      return 0;
    });
  }

  /**
   * 检查是否为特殊宝石
   */
  private isSpecialGem(type: GemType): boolean {
    return [
      GemType.SPECIAL_BOMB,
      GemType.SPECIAL_LINE_H,
      GemType.SPECIAL_LINE_V,
      GemType.SPECIAL_COLOR
    ].includes(type);
  }

  /**
   * 计算连击数量
   */
  private calculateComboCount(eliminationCount: number): number {
    return Math.min(eliminationCount, this.config.maxChainLength);
  }

  /**
   * 应用重力
   */
  applyGravity(grid: GameGrid): GravityResult {
    return GravitySystem.applyGravity(grid);
  }

  /**
   * 填充空位
   */
  fillEmptySpaces(grid: GameGrid, count?: number): FillResult {
    return FillSystem.generateNewGems(grid, count);
  }

  /**
   * 处理连锁反应
   */
  async processCascade(grid: GameGrid): Promise<CascadeResult> {
    const allAnimations: (any)[] = [];
    let totalEliminations = 0;
    let totalScore = 0;
    let chainCount = 0;
    let hasMoreMatches = true;

    while (hasMoreMatches && chainCount < this.config.maxChainLength) {
      // 检测新匹配
      const matches = this.findMatches(grid);
      
      if (matches.length === 0) {
        hasMoreMatches = false;
        break;
      }

      // 执行消除
      const eliminationResult = await this.executeElimination(grid, matches);
      totalEliminations += eliminationResult.eliminatedGems.length;
      totalScore += eliminationResult.score;
      chainCount++;

      // 应用重力
      const gravityResult = this.applyGravity(grid);
      allAnimations.push(...gravityResult.animations);

      // 填充新元素
      const fillResult = this.fillEmptySpaces(grid);
      allAnimations.push(...fillResult.animations);

      // 检查是否还有新匹配
      const newMatches = this.findMatches(grid);
      hasMoreMatches = newMatches.length > 0;
    }

    return {
      totalEliminations,
      totalScore,
      chainCount,
      animations: allAnimations
    };
  }

  /**
   * 执行完整的消除流程
   */
  async executeFullElimination(grid: GameGrid, initialMatches: MatchResult[]): Promise<CascadeResult> {
    let totalEliminations = 0;
    let totalScore = 0;
    let chainCount = 0;
    const allAnimations: (any)[] = [];

    // 执行初始消除
    if (initialMatches.length > 0) {
      const eliminationResult = await this.executeElimination(grid, initialMatches);
      totalEliminations += eliminationResult.eliminatedGems.length;
      totalScore += eliminationResult.score;
      chainCount++;

      // 应用重力和填充
      const gravityResult = this.applyGravity(grid);
      allAnimations.push(...gravityResult.animations);

      const fillResult = this.fillEmptySpaces(grid);
      allAnimations.push(...fillResult.animations);
    }

    // 处理连锁反应
    const cascadeResult = await this.processCascade(grid);
    totalEliminations += cascadeResult.totalEliminations;
    totalScore += cascadeResult.totalScore;
    chainCount += cascadeResult.chainCount;
    allAnimations.push(...cascadeResult.animations);

    return {
      totalEliminations,
      totalScore,
      chainCount,
      animations: allAnimations
    };
  }

  /**
   * 验证移动是否有效
   */
  isValidMove(grid: GameGrid, from: Position, to: Position): boolean {
    // 检查位置是否有效
    if (!MatchDetector.isValidPosition(grid, from) || 
        !MatchDetector.isValidPosition(grid, to)) {
      return false;
    }

    // 检查是否相邻
    if (!MatchDetector.areAdjacent(from, to)) {
      return false;
    }

    // 检查单元格是否可移动
    const fromCell = grid.cells[from.row]?.[from.col];
    const toCell = grid.cells[to.row]?.[to.col];

    if (!fromCell || !toCell || fromCell.isEmpty || fromCell.isLocked || 
        toCell.isEmpty || toCell.isLocked) {
      return false;
    }

    // 创建临时网格测试移动
    const tempGrid = this.cloneGrid(grid);
    this.swapCells(tempGrid, from, to);

    // 检查是否产生匹配
    const matches = this.findMatches(tempGrid);
    return matches.length > 0;
  }

  /**
   * 克隆网格
   */
  private cloneGrid(grid: GameGrid): GameGrid {
    const clonedCells: any[][] = [];
    
    for (let row = 0; row < grid.rows; row++) {
      clonedCells[row] = [];
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell) {
          clonedCells[row]![col] = {
            gem: cell.gem ? { ...cell.gem } : null,
            position: { ...cell.position },
            isEmpty: cell.isEmpty,
            isLocked: cell.isLocked
          };
        }
      }
    }

    return {
      rows: grid.rows,
      cols: grid.cols,
      cells: clonedCells
    };
  }

  /**
   * 交换单元格
   */
  private swapCells(grid: GameGrid, from: Position, to: Position): void {
    const fromCell = grid.cells[from.row]?.[from.col];
    const toCell = grid.cells[to.row]?.[to.col];

    if (fromCell && toCell) {
      const tempGem = fromCell.gem;
      const tempEmpty = fromCell.isEmpty;

      fromCell.gem = toCell.gem;
      fromCell.isEmpty = toCell.isEmpty;
      toCell.gem = tempGem;
      toCell.isEmpty = tempEmpty;
    }
  }

  /**
   * 获取系统配置
   */
  getConfig(): EliminationConfig {
    return { ...this.config };
  }

  /**
   * 更新系统配置
   */
  updateConfig(newConfig: Partial<EliminationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * 重置系统状态
   */
  reset(): void {
    this.eliminationQueue = [];
  }

  /**
   * 获取统计信息
   */
  getStats(): { queueLength: number; config: EliminationConfig } {
    return {
      queueLength: this.eliminationQueue.length,
      config: this.getConfig()
    };
  }
}
