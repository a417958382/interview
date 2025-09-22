import { GameGrid, SpawnAnimation, Position, Gem, GemType, FillResult } from './types';

/**
 * 填充系统 - 负责生成新元素填充空位
 */
export class FillSystem {
  private static readonly AVAILABLE_GEM_TYPES = [
    GemType.RED,
    GemType.BLUE,
    GemType.GREEN,
    GemType.YELLOW,
    GemType.PURPLE,
    GemType.ORANGE
  ];

  /**
   * 生成新元素填充空位
   */
  static generateNewGems(grid: GameGrid, maxCount?: number): FillResult {
    const animations: SpawnAnimation[] = [];
    const newGems: Gem[] = [];
    let hasChanges = false;

    const emptyPositions = this.getEmptyPositions(grid);
    const fillCount = maxCount ? Math.min(maxCount, emptyPositions.length) : emptyPositions.length;

    for (let i = 0; i < fillCount; i++) {
      const position = emptyPositions[i];
      if (position) {
        const gemType = this.selectGemType(grid, position);
        const newGem = this.createGem(gemType, position);

        // 更新网格
        const cell = grid.cells[position.row]?.[position.col];
        if (cell) {
          cell.gem = newGem;
          cell.isEmpty = false;
        }

        // 创建生成动画
        animations.push({
          position,
          gem: newGem,
          spawnType: 'fall_in',
          delay: i * 0.05 // 交错生成，避免同时出现
        });

        newGems.push(newGem);
        hasChanges = true;
      }
    }

    return { animations, newGems, hasChanges };
  }

  /**
   * 获取所有空位位置（按列优先，从下往上）
   */
  private static getEmptyPositions(grid: GameGrid): Position[] {
    const emptyPositions: Position[] = [];

    // 按列处理，优先填充底部
    for (let col = 0; col < grid.cols; col++) {
      for (let row = grid.rows - 1; row >= 0; row--) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          emptyPositions.push({ row, col });
        }
      }
    }

    return emptyPositions;
  }

  /**
   * 选择宝石类型（避免立即匹配）
   */
  private static selectGemType(grid: GameGrid, position: Position): GemType {
    let selectedType: GemType;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      selectedType = this.getRandomGemType();
      attempts++;
    } while (selectedType && this.wouldCreateMatch(grid, position, selectedType) && attempts < maxAttempts);

    return selectedType || GemType.RED;
  }

  /**
   * 获取随机宝石类型
   */
  private static getRandomGemType(): GemType {
    const index = Math.floor(Math.random() * this.AVAILABLE_GEM_TYPES.length);
    return this.AVAILABLE_GEM_TYPES[index] || GemType.RED;
  }

  /**
   * 检查放置宝石是否会立即产生匹配
   */
  private static wouldCreateMatch(grid: GameGrid, position: Position, gemType: GemType): boolean {
    // 检查水平方向
    const horizontalCount = this.countConsecutiveGems(grid, position, gemType, 'horizontal');
    if (horizontalCount >= 2) {
      return true;
    }

    // 检查垂直方向
    const verticalCount = this.countConsecutiveGems(grid, position, gemType, 'vertical');
    if (verticalCount >= 2) {
      return true;
    }

    return false;
  }

  /**
   * 计算连续相同宝石的数量
   */
  private static countConsecutiveGems(
    grid: GameGrid, 
    position: Position, 
    gemType: GemType, 
    direction: 'horizontal' | 'vertical'
  ): number {
    let count = 1; // 包括当前位置

    if (direction === 'horizontal') {
      // 向左检查
      for (let col = position.col - 1; col >= 0; col--) {
        const cell = grid.cells[position.row]?.[col];
        if (cell?.gem?.type === gemType) {
          count++;
        } else {
          break;
        }
      }

      // 向右检查
      for (let col = position.col + 1; col < grid.cols; col++) {
        const cell = grid.cells[position.row]?.[col];
        if (cell?.gem?.type === gemType) {
          count++;
        } else {
          break;
        }
      }
    } else {
      // 向上检查
      for (let row = position.row - 1; row >= 0; row--) {
        const cell = grid.cells[row]?.[position.col];
        if (cell?.gem?.type === gemType) {
          count++;
        } else {
          break;
        }
      }

      // 向下检查
      for (let row = position.row + 1; row < grid.rows; row++) {
        const cell = grid.cells[row]?.[position.col];
        if (cell?.gem?.type === gemType) {
          count++;
        } else {
          break;
        }
      }
    }

    return count;
  }

  /**
   * 创建宝石对象
   */
  private static createGem(type: GemType, position: Position): Gem {
    return {
      id: this.generateGemId(),
      type,
      position,
      baseScore: this.getBaseScore(type),
      isSpecial: this.isSpecialGem(type),
      effects: []
    };
  }

  /**
   * 生成宝石ID
   */
  private static generateGemId(): string {
    return `gem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取宝石基础分数
   */
  private static getBaseScore(type: GemType): number {
    const scoreMap: Record<GemType, number> = {
      [GemType.RED]: 10,
      [GemType.BLUE]: 10,
      [GemType.GREEN]: 10,
      [GemType.YELLOW]: 10,
      [GemType.PURPLE]: 10,
      [GemType.ORANGE]: 10,
      [GemType.SPECIAL_BOMB]: 50,
      [GemType.SPECIAL_LINE_H]: 30,
      [GemType.SPECIAL_LINE_V]: 30,
      [GemType.SPECIAL_COLOR]: 100,
      [GemType.BLOCKER]: 0,
      [GemType.EMPTY]: 0
    };

    return scoreMap[type] || 10;
  }

  /**
   * 检查是否为特殊宝石
   */
  private static isSpecialGem(type: GemType): boolean {
    return [
      GemType.SPECIAL_BOMB,
      GemType.SPECIAL_LINE_H,
      GemType.SPECIAL_LINE_V,
      GemType.SPECIAL_COLOR
    ].includes(type);
  }

  /**
   * 填充特定位置
   */
  static fillPosition(grid: GameGrid, position: Position, gemType?: GemType): Gem | null {
    const cell = grid.cells[position.row]?.[position.col];
    if (!cell || !cell.isEmpty) {
      return null;
    }

    const type = gemType || this.selectGemType(grid, position);
    const newGem = this.createGem(type, position);

    cell.gem = newGem;
    cell.isEmpty = false;

    return newGem;
  }

  /**
   * 批量填充空位（优化版本）
   */
  static fillEmptySpacesBatch(grid: GameGrid): FillResult {
    const animations: SpawnAnimation[] = [];
    const newGems: Gem[] = [];
    let hasChanges = false;

    // 按列分组处理空位
    const columnEmptySpaces = new Map<number, Position[]>();

    for (let col = 0; col < grid.cols; col++) {
      const emptySpaces: Position[] = [];
      for (let row = grid.rows - 1; row >= 0; row--) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          emptySpaces.push({ row, col });
        }
      }
      if (emptySpaces.length > 0) {
        columnEmptySpaces.set(col, emptySpaces);
      }
    }

    // 处理每一列
    let animationDelay = 0;
    for (const [, emptySpaces] of columnEmptySpaces) {
      for (const position of emptySpaces) {
        const gemType = this.selectGemType(grid, position);
        const newGem = this.createGem(gemType, position);

        // 更新网格
        const cell = grid.cells[position.row]?.[position.col];
        if (cell) {
          cell.gem = newGem;
          cell.isEmpty = false;
        }

        // 创建动画
        animations.push({
          position,
          gem: newGem,
          spawnType: 'fall_in',
          delay: animationDelay
        });

        newGems.push(newGem);
        hasChanges = true;
        animationDelay += 0.05;
      }
    }

    return { animations, newGems, hasChanges };
  }

  /**
   * 检查网格是否还有空位
   */
  static hasEmptySpaces(grid: GameGrid): boolean {
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获取空位数量
   */
  static getEmptySpaceCount(grid: GameGrid): number {
    let count = 0;
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          count++;
        }
      }
    }
    return count;
  }
}
