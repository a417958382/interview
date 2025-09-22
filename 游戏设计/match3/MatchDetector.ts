import { GameGrid, MatchResult, Position, GemType } from './types';

/**
 * 匹配检测器 - 负责检测网格中的匹配组合
 */
export class MatchDetector {
  /**
   * 检测所有匹配
   */
  static findAllMatches(grid: GameGrid): MatchResult[] {
    const matches: MatchResult[] = [];
    const visited = new Set<string>();

    // 水平扫描
    const horizontalMatches = this.findHorizontalMatches(grid);
    for (const match of horizontalMatches) {
      const key = this.getMatchKey(match);
      if (!visited.has(key)) {
        matches.push(match);
        visited.add(key);
      }
    }

    // 垂直扫描
    const verticalMatches = this.findVerticalMatches(grid);
    for (const match of verticalMatches) {
      const key = this.getMatchKey(match);
      if (!visited.has(key)) {
        matches.push(match);
        visited.add(key);
      }
    }

    // L形和T形匹配扫描
    const specialShapeMatches = this.findSpecialShapeMatches(grid);
    for (const match of specialShapeMatches) {
      const key = this.getMatchKey(match);
      if (!visited.has(key)) {
        matches.push(match);
        visited.add(key);
      }
    }

    return matches;
  }

  /**
   * 检测水平匹配
   */
  static findHorizontalMatches(grid: GameGrid): MatchResult[] {
    const matches: MatchResult[] = [];

    for (let row = 0; row < grid.rows; row++) {
      let currentType = GemType.EMPTY;
      let count = 0;
      let startCol = 0;

      for (let col = 0; col <= grid.cols; col++) {
        const cell = col < grid.cols ? grid.cells[row]?.[col] : null;
        const gemType = cell?.gem?.type || GemType.EMPTY;

        if (gemType === currentType && gemType !== GemType.EMPTY) {
          count++;
        } else {
          if (count >= 3 && currentType !== GemType.EMPTY) {
            matches.push({
              positions: this.getMatchPositions(row, startCol, count, 'horizontal'),
              type: currentType,
              length: count,
              direction: 'horizontal'
            });
          }
          currentType = gemType;
          count = 1;
          startCol = col;
        }
      }
    }

    return matches;
  }

  /**
   * 检测垂直匹配
   */
  static findVerticalMatches(grid: GameGrid): MatchResult[] {
    const matches: MatchResult[] = [];

    for (let col = 0; col < grid.cols; col++) {
      let currentType = GemType.EMPTY;
      let count = 0;
      let startRow = 0;

      for (let row = 0; row <= grid.rows; row++) {
        const cell = row < grid.rows ? grid.cells[row]?.[col] : null;
        const gemType = cell?.gem?.type || GemType.EMPTY;

        if (gemType === currentType && gemType !== GemType.EMPTY) {
          count++;
        } else {
          if (count >= 3 && currentType !== GemType.EMPTY) {
            matches.push({
              positions: this.getMatchPositions(startRow, col, count, 'vertical'),
              type: currentType,
              length: count,
              direction: 'vertical'
            });
          }
          currentType = gemType;
          count = 1;
          startRow = row;
        }
      }
    }

    return matches;
  }

  /**
   * 检测L形和T形匹配
   */
  static findSpecialShapeMatches(grid: GameGrid): MatchResult[] {
    const matches: MatchResult[] = [];
    const visited = new Set<string>();

    for (let row = 0; row < grid.rows - 2; row++) {
      for (let col = 0; col < grid.cols - 2; col++) {
        const lMatch = this.findLShapeMatch(grid, row, col);
        if (lMatch && !visited.has(this.getMatchKey(lMatch))) {
          matches.push(lMatch);
          visited.add(this.getMatchKey(lMatch));
        }

        const tMatch = this.findTShapeMatch(grid, row, col);
        if (tMatch && !visited.has(this.getMatchKey(tMatch))) {
          matches.push(tMatch);
          visited.add(this.getMatchKey(tMatch));
        }
      }
    }

    return matches;
  }

  /**
   * 检测L形匹配
   */
  private static findLShapeMatch(grid: GameGrid, startRow: number, startCol: number): MatchResult | null {
    const centerCell = grid.cells[startRow + 1]?.[startCol + 1];
    const centerGem = centerCell?.gem;
    if (!centerGem) return null;

    const gemType = centerGem.type;
    const positions: Position[] = [];

    // 检查水平部分（3x3网格的中间行）
    let horizontalCount = 0;
    for (let col = startCol; col < startCol + 3; col++) {
      const cell = grid.cells[startRow + 1]?.[col];
      if (cell?.gem?.type === gemType) {
        horizontalCount++;
        positions.push({ row: startRow + 1, col });
      }
    }

    // 检查垂直部分（3x3网格的中间列）
    let verticalCount = 0;
    for (let row = startRow; row < startRow + 3; row++) {
      const cell = grid.cells[row]?.[startCol + 1];
      if (cell?.gem?.type === gemType) {
        verticalCount++;
        positions.push({ row, col: startCol + 1 });
      }
    }

    // L形需要至少3个水平 + 3个垂直，但中心点只算一次
    // 去重后的位置数量应该至少是5个（3+3-1=5，因为中心点重复计算）
    if (horizontalCount >= 3 && verticalCount >= 3) {
      const uniquePositions = this.removeDuplicatePositions(positions);
      if (uniquePositions.length >= 5) {
        return {
          positions: uniquePositions,
          type: gemType,
          length: uniquePositions.length,
          direction: 'horizontal' // L形主要按水平处理
        };
      }
    }

    return null;
  }

  /**
   * 检测T形匹配
   */
  private static findTShapeMatch(grid: GameGrid, startRow: number, startCol: number): MatchResult | null {
    const centerCell = grid.cells[startRow + 1]?.[startCol + 1];
    const centerGem = centerCell?.gem;
    if (!centerGem) return null;

    const gemType = centerGem.type;
    const positions: Position[] = [];

    // 检查水平部分（T的顶部）
    let horizontalCount = 0;
    for (let col = startCol; col < startCol + 3; col++) {
      const cell = grid.cells[startRow]?.[col];
      if (cell?.gem?.type === gemType) {
        horizontalCount++;
        positions.push({ row: startRow, col });
      }
    }

    // 检查垂直部分（T的底部）
    let verticalCount = 0;
    for (let row = startRow; row < startRow + 3; row++) {
      const cell = grid.cells[row]?.[startCol + 1];
      if (cell?.gem?.type === gemType) {
        verticalCount++;
        positions.push({ row, col: startCol + 1 });
      }
    }

    // T形需要3个水平 + 3个垂直
    // 去重后的位置数量应该至少是5个（3+3-1=5，因为中心点重复计算）
    if (horizontalCount >= 3 && verticalCount >= 3) {
      const uniquePositions = this.removeDuplicatePositions(positions);
      if (uniquePositions.length >= 5) {
        return {
          positions: uniquePositions,
          type: gemType,
          length: uniquePositions.length,
          direction: 'horizontal'
        };
      }
    }

    return null;
  }

  /**
   * 获取匹配位置数组
   */
  private static getMatchPositions(
    row: number,
    startCol: number,
    length: number,
    direction: 'horizontal' | 'vertical'
  ): Position[] {
    const positions: Position[] = [];

    for (let i = 0; i < length; i++) {
      positions.push({
        row: direction === 'horizontal' ? row : row + i,
        col: direction === 'horizontal' ? startCol + i : startCol
      });
    }

    return positions;
  }

  /**
   * 移除重复位置
   */
  private static removeDuplicatePositions(positions: Position[]): Position[] {
    const unique = new Set<string>();
    return positions.filter(pos => {
      const key = `${pos.row},${pos.col}`;
      if (unique.has(key)) {
        return false;
      }
      unique.add(key);
      return true;
    });
  }

  /**
   * 生成匹配的唯一键
   */
  private static getMatchKey(match: MatchResult): string {
    return match.positions
      .map(pos => `${pos.row},${pos.col}`)
      .sort()
      .join('|');
  }

  /**
   * 检查位置是否在网格范围内
   */
  static isValidPosition(grid: GameGrid, position: Position): boolean {
    return position.row >= 0 && 
           position.row < grid.rows && 
           position.col >= 0 && 
           position.col < grid.cols;
  }

  /**
   * 检查两个位置是否相邻
   */
  static areAdjacent(pos1: Position, pos2: Position): boolean {
    const rowDiff = Math.abs(pos1.row - pos2.row);
    const colDiff = Math.abs(pos1.col - pos2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }
}
