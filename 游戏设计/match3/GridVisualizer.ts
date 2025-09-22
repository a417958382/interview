import { GameGrid, GemType, Position } from './types';

/**
 * 网格可视化器 - 负责将网格数据转换为可读的文本格式
 */
export class GridVisualizer {
  private static readonly GEM_SYMBOLS: Record<GemType, string> = {
    [GemType.RED]: '🔴',
    [GemType.BLUE]: '🔵',
    [GemType.GREEN]: '🟢',
    [GemType.YELLOW]: '🟡',
    [GemType.PURPLE]: '🟣',
    [GemType.ORANGE]: '🟠',
    [GemType.SPECIAL_BOMB]: '💣',
    [GemType.SPECIAL_LINE_H]: '➡️',
    [GemType.SPECIAL_LINE_V]: '⬇️',
    [GemType.SPECIAL_COLOR]: '🌈',
    [GemType.BLOCKER]: '🟫',
    [GemType.EMPTY]: '⬜'
  };

  private static readonly GEM_LETTERS: Record<GemType, string> = {
    [GemType.RED]: 'R',
    [GemType.BLUE]: 'B',
    [GemType.GREEN]: 'G',
    [GemType.YELLOW]: 'Y',
    [GemType.PURPLE]: 'P',
    [GemType.ORANGE]: 'O',
    [GemType.SPECIAL_BOMB]: 'X',
    [GemType.SPECIAL_LINE_H]: 'H',
    [GemType.SPECIAL_LINE_V]: 'V',
    [GemType.SPECIAL_COLOR]: 'C',
    [GemType.BLOCKER]: '#',
    [GemType.EMPTY]: '.'
  };

  /**
   * 将网格转换为字符串（使用符号）
   */
  static gridToString(grid: GameGrid, useSymbols: boolean = true): string {
    const symbolMap = useSymbols ? this.GEM_SYMBOLS : this.GEM_LETTERS;
    let result = '';

    // 添加列号
    result += '   ';
    for (let col = 0; col < grid.cols; col++) {
      result += ` ${col.toString().padStart(2)}`;
    }
    result += '\n';

    // 添加网格内容
    for (let row = 0; row < grid.rows; row++) {
      result += `${row.toString().padStart(2)}: `;
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const symbol = cell?.isEmpty 
          ? symbolMap[GemType.EMPTY]
          : symbolMap[cell?.gem?.type || GemType.EMPTY];
        result += ` ${symbol}`;
      }
      result += '\n';
    }

    return result;
  }

  /**
   * 将网格转换为HTML表格
   */
  static gridToHTML(grid: GameGrid): string {
    let html = '<table style="border-collapse: collapse; font-family: monospace;">\n';
    
    // 添加表头
    html += '  <tr>\n';
    html += '    <th style="border: 1px solid #ccc; padding: 4px; background: #f0f0f0;"></th>\n';
    for (let col = 0; col < grid.cols; col++) {
      html += `    <th style="border: 1px solid #ccc; padding: 4px; background: #f0f0f0;">${col}</th>\n`;
    }
    html += '  </tr>\n';

    // 添加网格内容
    for (let row = 0; row < grid.rows; row++) {
      html += '  <tr>\n';
      html += `    <th style="border: 1px solid #ccc; padding: 4px; background: #f0f0f0;">${row}</th>\n`;
      
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const symbol = cell?.isEmpty 
          ? this.GEM_SYMBOLS[GemType.EMPTY]
          : this.GEM_SYMBOLS[cell?.gem?.type || GemType.EMPTY];
        
        const style = cell?.isLocked 
          ? 'border: 1px solid #ccc; padding: 4px; background: #ffcccc;'
          : 'border: 1px solid #ccc; padding: 4px;';
        
        html += `    <td style="${style}">${symbol}</td>\n`;
      }
      html += '  </tr>\n';
    }
    
    html += '</table>';
    return html;
  }

  /**
   * 高亮显示匹配
   */
  static highlightMatches(grid: GameGrid, matches: Array<{ positions: Position[] }>): string {
    const highlightedPositions = new Set<string>();
    
    // 收集所有匹配位置
    for (const match of matches) {
      for (const pos of match.positions) {
        highlightedPositions.add(`${pos.row},${pos.col}`);
      }
    }

    let result = '';
    
    // 添加列号
    result += '   ';
    for (let col = 0; col < grid.cols; col++) {
      result += ` ${col.toString().padStart(2)}`;
    }
    result += '\n';

    // 添加网格内容
    for (let row = 0; row < grid.rows; row++) {
      result += `${row.toString().padStart(2)}: `;
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        const isHighlighted = highlightedPositions.has(`${row},${col}`);
        const symbol = cell?.isEmpty 
          ? this.GEM_LETTERS[GemType.EMPTY]
          : this.GEM_LETTERS[cell?.gem?.type || GemType.EMPTY];
        
        if (isHighlighted) {
          result += `[${symbol}]`;
        } else {
          result += ` ${symbol} `;
        }
      }
      result += '\n';
    }

    return result;
  }

  /**
   * 显示网格统计信息
   */
  static getGridStats(grid: GameGrid): string {
    const stats = {
      totalCells: grid.rows * grid.cols,
      emptyCells: 0,
      gemCounts: {} as Record<GemType, number>,
      lockedCells: 0
    };

    // 初始化计数
    for (const gemType of Object.values(GemType)) {
      stats.gemCounts[gemType] = 0;
    }

    // 统计网格
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const cell = grid.cells[row]?.[col];
        
        if (cell?.isEmpty) {
          stats.emptyCells++;
        } else if (cell?.gem) {
          stats.gemCounts[cell.gem.type]++;
        }
        
        if (cell?.isLocked) {
          stats.lockedCells++;
        }
      }
    }

    let result = '网格统计信息:\n';
    result += `总单元格: ${stats.totalCells}\n`;
    result += `空单元格: ${stats.emptyCells}\n`;
    result += `锁定单元格: ${stats.lockedCells}\n`;
    result += '宝石分布:\n';

    for (const [gemType, count] of Object.entries(stats.gemCounts)) {
      if (count > 0) {
        const symbol = this.GEM_SYMBOLS[gemType as GemType];
        result += `  ${symbol} ${gemType}: ${count}\n`;
      }
    }

    return result;
  }

  /**
   * 显示移动预览
   */
  static showMovePreview(grid: GameGrid, from: Position, to: Position): string {
    let result = '移动预览:\n';
    result += `从 (${from.row}, ${from.col}) 到 (${to.row}, ${to.col})\n\n`;

    // 显示移动前的网格
    result += '移动前:\n';
    result += this.gridToString(grid, false);

    // 创建临时网格显示移动后状态
    const tempGrid = this.cloneGrid(grid);
    this.swapCells(tempGrid, from, to);

    result += '\n移动后:\n';
    result += this.gridToString(tempGrid, false);

    return result;
  }

  /**
   * 克隆网格
   */
  private static cloneGrid(grid: GameGrid): GameGrid {
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
  private static swapCells(grid: GameGrid, from: Position, to: Position): void {
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
   * 显示动画序列
   */
  static showAnimationSequence(animations: Array<{ fromPosition: Position, toPosition: Position, gem: any }>): string {
    let result = '动画序列:\n';
    
    for (let i = 0; i < animations.length; i++) {
      const anim = animations[i];
      if (anim && anim.gem && anim.gem.type) {
        const symbol = this.GEM_SYMBOLS[anim.gem.type as GemType] || '?';
        result += `${i + 1}. ${symbol} 从 (${anim.fromPosition.row}, ${anim.fromPosition.col}) 移动到 (${anim.toPosition.row}, ${anim.toPosition.col})\n`;
      }
    }

    return result;
  }

  /**
   * 显示分数信息
   */
  static showScoreInfo(score: number, comboCount: number, chainCount: number): string {
    let result = '分数信息:\n';
    result += `基础分数: ${score}\n`;
    result += `连击数: ${comboCount}\n`;
    result += `连锁数: ${chainCount}\n`;
    result += `总分数: ${score * (1 + comboCount * 0.1) * (1 + chainCount * 0.2)}\n`;
    return result;
  }
}
