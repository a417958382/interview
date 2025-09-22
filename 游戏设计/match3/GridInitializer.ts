import { GameGrid, GridCell, Gem, GemType, Position } from './types';

/**
 * 网格初始化器 - 负责创建和初始化游戏网格
 */
export class GridInitializer {
  /**
   * 创建空网格
   */
  static createEmptyGrid(rows: number, cols: number): GameGrid {
    const cells: GridCell[][] = [];

    for (let row = 0; row < rows; row++) {
      cells[row] = [];
      for (let col = 0; col < cols; col++) {
        cells[row]![col] = {
          gem: null,
          position: { row, col },
          isEmpty: true,
          isLocked: false
        };
      }
    }

    return { rows, cols, cells };
  }

  /**
   * 随机填充网格
   */
  static fillGridRandomly(grid: GameGrid): void {
    const gemTypes = [
      GemType.RED,
      GemType.BLUE,
      GemType.GREEN,
      GemType.YELLOW,
      GemType.PURPLE,
      GemType.ORANGE
    ];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          const gemType = gemTypes[Math.floor(Math.random() * gemTypes.length)];
          if (gemType) {
            cell.gem = this.createGem(gemType, { row, col });
            cell.isEmpty = false;
          }
        }
      }
    }
  }

  /**
   * 智能填充网格（避免初始匹配）
   */
  static fillGridIntelligently(grid: GameGrid): void {
    const gemTypes = [
      GemType.RED,
      GemType.BLUE,
      GemType.GREEN,
      GemType.YELLOW,
      GemType.PURPLE,
      GemType.ORANGE
    ];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          const gemType = this.selectSafeGemType(grid, { row, col }, gemTypes);
          if (gemType) {
            cell.gem = this.createGem(gemType, { row, col });
            cell.isEmpty = false;
          }
        }
      }
    }
  }

  /**
   * 选择安全的宝石类型（避免立即匹配）
   */
  private static selectSafeGemType(grid: GameGrid, position: Position, availableTypes: GemType[]): GemType {
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const gemType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      
      if (gemType && !this.wouldCreateMatch(grid, position, gemType)) {
        return gemType;
      }
      
      attempts++;
    }

    // 如果无法避免匹配，返回随机类型
    const fallbackType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    return fallbackType || GemType.RED;
  }

  /**
   * 检查放置宝石是否会创建匹配
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
   * 创建预设测试网格
   */
  static createTestGrid(): GameGrid {
    const grid = this.createEmptyGrid(8, 8);
    
    // 创建一些测试匹配
    const testPattern = [
      [GemType.RED, GemType.RED, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE],
      [GemType.BLUE, GemType.BLUE, GemType.BLUE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE],
      [GemType.GREEN, GemType.GREEN, GemType.GREEN, GemType.BLUE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW],
      [GemType.YELLOW, GemType.YELLOW, GemType.YELLOW, GemType.GREEN, GemType.BLUE, GemType.RED, GemType.BLUE, GemType.GREEN],
      [GemType.PURPLE, GemType.PURPLE, GemType.PURPLE, GemType.YELLOW, GemType.GREEN, GemType.BLUE, GemType.RED, GemType.BLUE],
      [GemType.ORANGE, GemType.ORANGE, GemType.ORANGE, GemType.PURPLE, GemType.YELLOW, GemType.GREEN, GemType.BLUE, GemType.RED],
      [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
      [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN]
    ];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const gemType = testPattern[row]?.[col];
        if (cell && gemType) {
          cell.gem = this.createGem(gemType, { row, col });
          cell.isEmpty = false;
        }
      }
    }

    return grid;
  }

  /**
   * 创建包含L形和T形匹配的测试网格
   */
  static createSpecialShapeTestGrid(): GameGrid {
    const grid = this.createEmptyGrid(8, 8);
    
    // 创建包含L形和T形匹配的测试模式
    const specialPattern = [
      [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
      [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN],
      [GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW],
      [GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE],
      [GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE],
      [GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED],
      [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
      [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN]
    ];

    // 在特定位置创建L形匹配 (2,2) 为中心
    // L形：水平3个 + 垂直3个，中心点在(3,3)
    if (specialPattern[2]) {
      specialPattern[2][2] = GemType.RED; // 左上
      specialPattern[2][3] = GemType.RED; // 中心
      specialPattern[2][4] = GemType.RED; // 右上
    }
    if (specialPattern[3]) {
      specialPattern[3][3] = GemType.RED; // 中心
    }
    if (specialPattern[4]) {
      specialPattern[4][3] = GemType.RED; // 下
    }

    // 在特定位置创建T形匹配 (5,1) 为中心
    // T形：水平3个 + 垂直3个，中心点在(6,2)
    if (specialPattern[5]) {
      specialPattern[5][1] = GemType.BLUE; // 左上
      specialPattern[5][2] = GemType.BLUE; // 中心
      specialPattern[5][3] = GemType.BLUE; // 右上
    }
    if (specialPattern[6]) {
      specialPattern[6][2] = GemType.BLUE; // 中心
    }
    if (specialPattern[7]) {
      specialPattern[7][2] = GemType.BLUE; // 下
    }

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const gemType = specialPattern[row]?.[col];
        if (cell && gemType) {
          cell.gem = this.createGem(gemType, { row, col });
          cell.isEmpty = false;
        }
      }
    }

    return grid;
  }

  /**
   * 创建无匹配网格（用于测试移动）
   */
  static createNoMatchGrid(): GameGrid {
    const grid = this.createEmptyGrid(8, 8);
    
    // 创建无匹配的网格模式
    const noMatchPattern = [
      [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
      [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN],
      [GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW],
      [GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE],
      [GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE],
      [GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED],
      [GemType.RED, GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE],
      [GemType.BLUE, GemType.GREEN, GemType.YELLOW, GemType.PURPLE, GemType.ORANGE, GemType.RED, GemType.BLUE, GemType.GREEN]
    ];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const gemType = noMatchPattern[row]?.[col];
        if (cell && gemType) {
          cell.gem = this.createGem(gemType, { row, col });
          cell.isEmpty = false;
        }
      }
    }

    return grid;
  }

  /**
   * 添加障碍物
   */
  static addBlockers(grid: GameGrid, positions: Position[]): void {
    for (const position of positions) {
      const cell = grid.cells[position.row]?.[position.col];
      if (cell) {
        cell.gem = this.createGem(GemType.BLOCKER, position);
        cell.isEmpty = false;
        cell.isLocked = true;
      }
    }
  }

  /**
   * 添加特殊元素
   */
  static addSpecialElements(grid: GameGrid, specialElements: Array<{ position: Position, type: GemType }>): void {
    for (const { position, type } of specialElements) {
      const cell = grid.cells[position.row]?.[position.col];
      if (cell) {
        cell.gem = this.createGem(type, position);
        cell.isEmpty = false;
      }
    }
  }
}
