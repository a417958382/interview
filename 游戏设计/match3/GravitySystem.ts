import { GameGrid, MoveAnimation, Position, GravityResult } from './types';

/**
 * 重力系统 - 负责处理元素下落和位置调整
 */
export class GravitySystem {
  /**
   * 应用重力，使元素下落填充空隙
   */
  static applyGravity(grid: GameGrid): GravityResult {
    const animations: MoveAnimation[] = [];
    let hasChanges = false;

    for (let col = 0; col < grid.cols; col++) {
      const columnChanges = this.applyGravityToColumn(grid, col);
      animations.push(...columnChanges.animations);
      if (columnChanges.hasChanges) {
        hasChanges = true;
      }
    }

    return { animations, hasChanges };
  }

  /**
   * 对单列应用重力
   */
  private static applyGravityToColumn(grid: GameGrid, col: number): { animations: MoveAnimation[], hasChanges: boolean } {
    const animations: MoveAnimation[] = [];
    let hasChanges = false;

    // 从底部向上扫描，寻找空位
    for (let row = grid.rows - 1; row >= 0; row--) {
      const cell = grid.cells[row]?.[col];

      if (cell?.isEmpty) {
        // 找到空位，寻找上面的非空元素
        const sourceRow = this.findSourceRow(grid, row, col);
        
        if (sourceRow >= 0) {
          // 执行下落
          const sourceCell = grid.cells[sourceRow]?.[col];
          if (sourceCell?.gem) {
            // 创建移动动画
            animations.push({
              fromPosition: { row: sourceRow, col },
              toPosition: { row, col },
              gem: sourceCell.gem,
              duration: this.calculateFallDuration(sourceRow, row)
            });

            // 执行实际移动
            const targetCell = grid.cells[row]?.[col];
            if (targetCell) {
              targetCell.gem = sourceCell.gem;
              targetCell.isEmpty = false;
            }
            sourceCell.gem = null;
            sourceCell.isEmpty = true;

            hasChanges = true;
          }
        }
      }
    }

    return { animations, hasChanges };
  }

  /**
   * 寻找下落源位置
   */
  private static findSourceRow(grid: GameGrid, emptyRow: number, col: number): number {
    for (let row = emptyRow - 1; row >= 0; row--) {
      const cell = grid.cells[row]?.[col];
      if (cell && !cell.isEmpty && cell.gem && !cell.isLocked) {
        return row;
      }
    }
    return -1;
  }

  /**
   * 计算下落时间
   */
  private static calculateFallDuration(fromRow: number, toRow: number): number {
    const distance = fromRow - toRow;
    // 使用平方根函数，让下落时间更自然
    return Math.sqrt(distance) * 0.1; // 基础时间单位
  }

  /**
   * 检查列是否还有空位
   */
  static hasEmptySpacesInColumn(grid: GameGrid, col: number): boolean {
    for (let row = 0; row < grid.rows; row++) {
      const cell = grid.cells[row]?.[col];
      if (cell?.isEmpty) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取列中的空位数量
   */
  static getEmptySpaceCountInColumn(grid: GameGrid, col: number): number {
    let count = 0;
    for (let row = 0; row < grid.rows; row++) {
      const cell = grid.cells[row]?.[col];
      if (cell?.isEmpty) {
        count++;
      }
    }
    return count;
  }

  /**
   * 获取所有空位位置
   */
  static getAllEmptyPositions(grid: GameGrid): Position[] {
    const emptyPositions: Position[] = [];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        if (cell?.isEmpty) {
          emptyPositions.push({ row, col });
        }
      }
    }

    return emptyPositions;
  }

  /**
   * 检查网格是否稳定（没有元素需要下落）
   */
  static isGridStable(grid: GameGrid): boolean {
    for (let col = 0; col < grid.cols; col++) {
      if (this.hasEmptySpacesInColumn(grid, col)) {
        // 检查空位上方是否有非空元素
        for (let row = 0; row < grid.rows - 1; row++) {
          const currentCell = grid.cells[row]?.[col];
          const belowCell = grid.cells[row + 1]?.[col];
          
          if (currentCell && belowCell && !currentCell.isEmpty && currentCell.gem && 
              belowCell.isEmpty && !currentCell.isLocked) {
            return false; // 有元素可以下落
          }
        }
      }
    }
    return true;
  }

  /**
   * 获取需要下落的元素
   */
  static getFallingElements(grid: GameGrid): Array<{ from: Position, to: Position, gem: any }> {
    const fallingElements: Array<{ from: Position, to: Position, gem: any }> = [];

    for (let col = 0; col < grid.cols; col++) {
      for (let row = 0; row < grid.rows - 1; row++) {
        const currentCell = grid.cells[row]?.[col];
        const belowCell = grid.cells[row + 1]?.[col];

        if (currentCell && belowCell && !currentCell.isEmpty && currentCell.gem && 
            belowCell.isEmpty && !currentCell.isLocked) {
          
          // 找到这个元素能下落到的最终位置
          let finalRow = row + 1;
          while (finalRow < grid.rows - 1) {
            const nextCell = grid.cells[finalRow + 1]?.[col];
            if (nextCell?.isEmpty) {
              finalRow++;
            } else {
              break;
            }
          }

          fallingElements.push({
            from: { row, col },
            to: { row: finalRow, col },
            gem: currentCell.gem
          });
        }
      }
    }

    return fallingElements;
  }

  /**
   * 批量应用重力（优化版本）
   */
  static applyGravityBatch(grid: GameGrid): GravityResult {
    const animations: MoveAnimation[] = [];
    let hasChanges = false;

    // 获取所有需要下落的元素
    const fallingElements = this.getFallingElements(grid);

    if (fallingElements.length === 0) {
      return { animations, hasChanges: false };
    }

    // 按列分组处理
    const columnGroups = new Map<number, typeof fallingElements>();
    for (const element of fallingElements) {
      const col = element.from.col;
      if (!columnGroups.has(col)) {
        columnGroups.set(col, []);
      }
      const group = columnGroups.get(col);
      if (group) {
        group.push(element);
      }
    }

    // 处理每一列
    for (const [, elements] of columnGroups) {
      // 按行排序，从下往上处理
      elements.sort((a, b) => b.from.row - a.from.row);

      for (const element of elements) {
        const { from, to, gem } = element;

        // 创建动画
        animations.push({
          fromPosition: from,
          toPosition: to,
          gem,
          duration: this.calculateFallDuration(from.row, to.row)
        });

        // 执行移动
        const toCell = grid.cells[to.row]?.[to.col];
        const fromCell = grid.cells[from.row]?.[from.col];
        if (toCell && fromCell) {
          toCell.gem = gem;
          toCell.isEmpty = false;
          fromCell.gem = null;
          fromCell.isEmpty = true;
        }

        hasChanges = true;
      }
    }

    return { animations, hasChanges };
  }
}
