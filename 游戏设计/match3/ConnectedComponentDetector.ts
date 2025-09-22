import { GameGrid, MatchResult, Position, GemType } from './types';

/**
 * 基于连通域的匹配检测器
 * 使用BFS/DFS进行局部匹配检测
 * 
 * 实现思路：
 * 1. 以交换点为中心，向四周搜索同类型的宝石
 * 2. 使用BFS/DFS算法找到所有连通的同类型宝石
 * 3. 分析连通域，检测是否形成L形、T形等特殊匹配
 * 4. 相比固定窗口扫描，更适合局部检测和动态形状识别
 */
export class ConnectedComponentDetector {
  /**
   * 基于BFS的连通域搜索
   * 
   * BFS实现思路：
   * 1. 使用队列(queue)存储待访问的位置
   * 2. 从中心点开始，按距离递增的顺序访问相邻位置
   * 3. 对于每个位置，检查宝石类型是否与中心点相同
   * 4. 如果相同，加入连通域并继续向四周扩展
   * 5. 使用visited集合避免重复访问
   * 6. 限制搜索半径(maxRadius)控制搜索范围
   * 
   * 优势：
   * - 按距离顺序访问，优先找到最近的匹配
   * - 适合检测以交换点为中心的局部匹配
   * - 时间复杂度：O(连通域大小)
   * 
   * 具体例子：
   * 假设网格如下，中心点为(2,2)，宝石类型为🔴：
   * 
   *   0 1 2 3 4
   * 0 🔵 🔵 🔴 🔵 🔵
   * 1 🔵 🔴 🔴 🔴 🔵
   * 2 🔴 🔴 🔴 🔴 🔴  ← 中心点(2,2)
   * 3 🔵 🔴 🔴 🔴 🔵
   * 4 🔵 🔵 🔴 🔵 🔵
   * 
   * BFS搜索过程：
   * 距离0: 访问(2,2) → 发现🔴，加入连通域
   * 距离1: 访问(1,2),(2,1),(2,3),(3,2) → 发现4个🔴，加入连通域
   * 距离2: 访问(0,2),(1,1),(1,3),(2,0),(2,4),(3,1),(3,3),(4,2) → 发现8个🔴，加入连通域
   * 
   * 最终连通域：所有🔴位置
   * 检测结果：水平匹配(2,0-4)、垂直匹配(0-4,2)、L形匹配等
   */
  static findMatchesByBFS(grid: GameGrid, center: Position, maxRadius: number = 3): MatchResult[] {
    const matches: MatchResult[] = [];
    const visited = new Set<string>();
    const queue: Array<{ pos: Position, distance: number }> = [];
    
    // 获取中心点宝石类型
    const centerCell = grid.cells[center.row]?.[center.col];
    if (!centerCell?.gem) return matches;
    
    const targetType = centerCell.gem.type;
    queue.push({ pos: center, distance: 0 });
    visited.add(`${center.row},${center.col}`);
    
    const connectedPositions: Position[] = [];
    
    while (queue.length > 0) {
      const { pos, distance } = queue.shift()!;
      
      if (distance > maxRadius) continue;
      
      const cell = grid.cells[pos.row]?.[pos.col];
      if (cell?.gem?.type === targetType) {
        connectedPositions.push(pos);
        
        // 向四个方向扩展
        const directions = [
          { row: -1, col: 0 },  // 上
          { row: 1, col: 0 },   // 下
          { row: 0, col: -1 },  // 左
          { row: 0, col: 1 }    // 右
        ];
        
        for (const dir of directions) {
          const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
          const key = `${newPos.row},${newPos.col}`;
          
          if (!visited.has(key) && 
              newPos.row >= 0 && newPos.row < grid.rows &&
              newPos.col >= 0 && newPos.col < grid.cols) {
            visited.add(key);
            queue.push({ pos: newPos, distance: distance + 1 });
          }
        }
      }
    }
    
    // 分析连通域，检测特殊形状
    if (connectedPositions.length >= 3) {
      const specialMatches = this.analyzeConnectedComponent(connectedPositions, targetType);
      matches.push(...specialMatches);
    }
    
    return matches;
  }
  
  /**
   * 基于DFS的连通域搜索
   * 
   * DFS实现思路：
   * 1. 使用递归或栈(stack)实现深度优先搜索
   * 2. 从中心点开始，沿着一个方向深入搜索到底
   * 3. 回溯到上一个分支点，继续搜索其他方向
   * 4. 对于每个位置，检查宝石类型是否与中心点相同
   * 5. 如果相同，加入连通域并递归搜索相邻位置
   * 6. 使用visited集合避免重复访问
   * 7. 限制搜索深度(maxDepth)控制搜索范围
   * 
   * 优势：
   * - 内存使用更少（递归栈 vs 队列）
   * - 适合检测链式或分支状的匹配
   * - 实现相对简单
   * 
   * 劣势：
   * - 可能不是最优路径（深度优先 vs 广度优先）
   * - 递归深度过深可能导致栈溢出
   * 
   * 具体例子：
   * 假设网格如下，中心点为(2,2)，宝石类型为🔴：
   * 
   *   0 1 2 3 4
   * 0 🔵 🔵 🔴 🔵 🔵
   * 1 🔵 🔴 🔴 🔴 🔵
   * 2 🔴 🔴 🔴 🔴 🔴  ← 中心点(2,2)
   * 3 🔵 🔴 🔴 🔴 🔵
   * 4 🔵 🔵 🔴 🔵 🔵
   * 
   * DFS搜索过程（递归路径）：
   * 1. 访问(2,2) → 发现🔴，加入连通域
   * 2. 递归访问(1,2) → 发现🔴，加入连通域
   * 3. 递归访问(0,2) → 发现🔴，加入连通域
   * 4. 回溯到(1,2)，访问(1,1) → 发现🔴，加入连通域
   * 5. 回溯到(1,2)，访问(1,3) → 发现🔴，加入连通域
   * 6. 回溯到(2,2)，访问(2,1) → 发现🔴，加入连通域
   * 7. 继续递归...直到访问完所有连通的🔴
   * 
   * 搜索特点：深度优先，一条路径走到底再回溯
   */
  static findMatchesByDFS(grid: GameGrid, center: Position, maxDepth: number = 3): MatchResult[] {
    const matches: MatchResult[] = [];
    const visited = new Set<string>();
    const connectedPositions: Position[] = [];
    
    // 获取中心点宝石类型
    const centerCell = grid.cells[center.row]?.[center.col];
    if (!centerCell?.gem) return matches;
    
    const targetType = centerCell.gem.type;
    
    const dfs = (pos: Position, depth: number) => {
      if (depth > maxDepth) return;
      
      const key = `${pos.row},${pos.col}`;
      if (visited.has(key)) return;
      
      const cell = grid.cells[pos.row]?.[pos.col];
      if (cell?.gem?.type !== targetType) return;
      
      visited.add(key);
      connectedPositions.push(pos);
      
      // 递归搜索四个方向
      const directions = [
        { row: -1, col: 0 },  // 上
        { row: 1, col: 0 },   // 下
        { row: 0, col: -1 },  // 左
        { row: 0, col: 1 }    // 右
      ];
      
      for (const dir of directions) {
        const newPos = { row: pos.row + dir.row, col: pos.col + dir.col };
        if (newPos.row >= 0 && newPos.row < grid.rows &&
            newPos.col >= 0 && newPos.col < grid.cols) {
          dfs(newPos, depth + 1);
        }
      }
    };
    
    dfs(center, 0);
    
    // 分析连通域，检测特殊形状
    if (connectedPositions.length >= 3) {
      const specialMatches = this.analyzeConnectedComponent(connectedPositions, targetType);
      matches.push(...specialMatches);
    }
    
    return matches;
  }
  
  /**
   * 分析连通域，检测特殊形状
   * 
   * 分析思路：
   * 1. 将连通域中的位置按行和列分组
   * 2. 检测每行/列中的连续匹配（水平/垂直匹配）
   * 3. 分析位置分布，识别L形、T形等特殊形状
   * 4. 返回所有检测到的匹配结果
   * 
   * 检测步骤：
   * - 水平匹配：按行分组，检测每行的连续位置
   * - 垂直匹配：按列分组，检测每列的连续位置  
   * - 特殊形状：分析位置分布，识别复杂几何形状
   * 
   * 具体例子：
   * 连通域位置：[(0,2), (1,1), (1,2), (1,3), (2,0), (2,1), (2,2), (2,3), (2,4), (3,1), (3,2), (3,3), (4,2)]
   * 
   * 按行分组：
   * 行0: [(0,2)]
   * 行1: [(1,1), (1,2), (1,3)] → 水平匹配：3个连续
   * 行2: [(2,0), (2,1), (2,2), (2,3), (2,4)] → 水平匹配：5个连续
   * 行3: [(3,1), (3,2), (3,3)] → 水平匹配：3个连续
   * 行4: [(4,2)]
   * 
   * 按列分组：
   * 列0: [(2,0)]
   * 列1: [(1,1), (2,1), (3,1)] → 垂直匹配：3个连续
   * 列2: [(0,2), (1,2), (2,2), (3,2), (4,2)] → 垂直匹配：5个连续
   * 列3: [(1,3), (2,3), (3,3)] → 垂直匹配：3个连续
   * 列4: [(2,4)]
   * 
   * 检测结果：
   * - 水平匹配：行1(3个)、行2(5个)、行3(3个)
   * - 垂直匹配：列1(3个)、列2(5个)、列3(3个)
   * - 特殊形状：十字形匹配（中心点(2,2)）
   */
  private static analyzeConnectedComponent(positions: Position[], gemType: GemType): MatchResult[] {
    const matches: MatchResult[] = [];
    
    // 检测水平匹配
    const horizontalMatches = this.findHorizontalMatchesInComponent(positions, gemType);
    matches.push(...horizontalMatches);
    
    // 检测垂直匹配
    const verticalMatches = this.findVerticalMatchesInComponent(positions, gemType);
    matches.push(...verticalMatches);
    
    // 检测L形和T形匹配
    const specialMatches = this.findSpecialShapesInComponent(positions, gemType);
    matches.push(...specialMatches);
    
    return matches;
  }
  
  /**
   * 在连通域中检测水平匹配
   * 
   * 实现思路：
   * 1. 将连通域中的位置按行分组
   * 2. 对每行的位置按列坐标排序
   * 3. 检测连续的列坐标，形成水平匹配
   * 4. 返回长度>=3的水平匹配
   * 
   * 示例：
   * 连通域位置: [(0,0), (0,1), (0,2), (1,1), (2,1)]
   * 按行分组: {0: [(0,0), (0,1), (0,2)], 1: [(1,1)], 2: [(2,1)]}
   * 检测结果: 行0有水平匹配[(0,0), (0,1), (0,2)]
   */
  private static findHorizontalMatchesInComponent(positions: Position[], gemType: GemType): MatchResult[] {
    const matches: MatchResult[] = [];
    const rowGroups = new Map<number, Position[]>();
    
    // 按行分组
    for (const pos of positions) {
      if (!rowGroups.has(pos.row)) {
        rowGroups.set(pos.row, []);
      }
      rowGroups.get(pos.row)!.push(pos);
    }
    
    // 检测每行的连续匹配
    for (const [, rowPositions] of rowGroups) {
      rowPositions.sort((a, b) => a.col - b.col);
      
      let currentGroup: Position[] = [];
      for (let i = 0; i < rowPositions.length; i++) {
        const currentPos = rowPositions[i];
        if (!currentPos) continue;
        
        const prevPos = rowPositions[i-1];
        
        if (i === 0 || (prevPos && currentPos.col === prevPos.col + 1)) {
          currentGroup.push(currentPos);
        } else {
          if (currentGroup.length >= 3) {
            matches.push({
              positions: [...currentGroup],
              type: gemType,
              length: currentGroup.length,
              direction: 'horizontal'
            });
          }
          currentGroup = [currentPos];
        }
      }
      
      if (currentGroup.length >= 3) {
        matches.push({
          positions: [...currentGroup],
          type: gemType,
          length: currentGroup.length,
          direction: 'horizontal'
        });
      }
    }
    
    return matches;
  }
  
  /**
   * 在连通域中检测垂直匹配
   * 
   * 实现思路：
   * 1. 将连通域中的位置按列分组
   * 2. 对每列的位置按行坐标排序
   * 3. 检测连续的行坐标，形成垂直匹配
   * 4. 返回长度>=3的垂直匹配
   * 
   * 示例：
   * 连通域位置: [(0,0), (0,1), (0,2), (1,1), (2,1)]
   * 按列分组: {0: [(0,0)], 1: [(0,1), (1,1), (2,1)], 2: [(0,2)]}
   * 检测结果: 列1有垂直匹配[(0,1), (1,1), (2,1)]
   */
  private static findVerticalMatchesInComponent(positions: Position[], gemType: GemType): MatchResult[] {
    const matches: MatchResult[] = [];
    const colGroups = new Map<number, Position[]>();
    
    // 按列分组
    for (const pos of positions) {
      if (!colGroups.has(pos.col)) {
        colGroups.set(pos.col, []);
      }
      colGroups.get(pos.col)!.push(pos);
    }
    
    // 检测每列的连续匹配
    for (const [, colPositions] of colGroups) {
      colPositions.sort((a, b) => a.row - b.row);
      
      let currentGroup: Position[] = [];
      for (let i = 0; i < colPositions.length; i++) {
        const currentPos = colPositions[i];
        if (!currentPos) continue;
        
        const prevPos = colPositions[i-1];
        
        if (i === 0 || (prevPos && currentPos.row === prevPos.row + 1)) {
          currentGroup.push(currentPos);
        } else {
          if (currentGroup.length >= 3) {
            matches.push({
              positions: [...currentGroup],
              type: gemType,
              length: currentGroup.length,
              direction: 'vertical'
            });
          }
          currentGroup = [currentPos];
        }
      }
      
      if (currentGroup.length >= 3) {
        matches.push({
          positions: [...currentGroup],
          type: gemType,
          length: currentGroup.length,
          direction: 'vertical'
        });
      }
    }
    
    return matches;
  }
  
  /**
   * 在连通域中检测特殊形状
   * 
   * 实现思路：
   * 1. 分析连通域中位置的几何分布
   * 2. 检测L形、T形、十字形等特殊形状
   * 3. 可以使用以下方法：
   *    - 几何分析：计算位置的重心、分布等
   *    - 模式匹配：预定义形状模板进行匹配
   *    - 图论分析：将位置作为节点，分析连通性
   * 
   * 特殊形状检测示例：
   * L形: 水平3个 + 垂直3个，中心点重叠
   * T形: 水平3个 + 垂直3个，中心点重叠
   * 十字形: 水平3个 + 垂直3个，中心点重叠
   * 
   * 当前实现：预留接口，可扩展更复杂的形状检测算法
   */
  private static findSpecialShapesInComponent(_positions: Position[], _gemType: GemType): MatchResult[] {
    const matches: MatchResult[] = [];
    
    // 检测L形和T形匹配
    // 这里可以使用更复杂的几何分析算法
    // 或者结合当前的固定窗口方法
    
    // TODO: 实现特殊形状检测算法
    // 1. 几何分析：计算位置分布特征
    // 2. 模式匹配：使用预定义模板
    // 3. 图论分析：分析连通性模式
    
    return matches;
  }
  
  /**
   * 混合检测：结合固定窗口和连通域搜索
   * 
   * 混合策略：
   * 1. 局部检测（有中心点）：使用连通域搜索
   *    - 适用场景：玩家交换宝石后的局部检测
   *    - 优势：高效，只检测相关区域
   *    - 算法：BFS/DFS连通域搜索
   * 
   * 2. 全网格检测（无中心点）：使用固定窗口扫描
   *    - 适用场景：游戏开始时的全网格检测
   *    - 优势：完整，检测所有可能的匹配
   *    - 算法：固定窗口遍历
   * 
   * 选择策略：
   * - 有中心点 → 连通域搜索（局部高效）
   * - 无中心点 → 固定窗口扫描（全局完整）
   * 
   * 具体例子：
   * 
   * 场景1：玩家交换宝石后
   * 调用：findMatchesHybrid(grid, {row: 2, col: 2})
   * 策略：使用BFS从(2,2)开始搜索，只检测交换点周围的连通域
   * 优势：快速响应，只处理相关区域
   * 
   * 场景2：游戏开始检测
   * 调用：findMatchesHybrid(grid)
   * 策略：使用固定窗口扫描整个网格，检测所有可能的匹配
   * 优势：确保没有遗漏，检测所有匹配
   * 
   * 性能对比：
   * - 局部检测：O(连通域大小) ≈ O(9-25个位置)
   * - 全网格检测：O(网格大小) ≈ O(8×8=64个位置)
   * - 混合策略：根据场景选择最优算法
   */
  static findMatchesHybrid(grid: GameGrid, center?: Position): MatchResult[] {
    const matches: MatchResult[] = [];
    
    if (center) {
      // 局部检测：使用连通域搜索
      // 适用场景：玩家交换宝石后的局部检测
      const localMatches = this.findMatchesByBFS(grid, center, 3);
      matches.push(...localMatches);
    } else {
      // 全网格检测：使用固定窗口扫描
      // 适用场景：游戏开始时的全网格检测
      // 这里可以调用原有的固定窗口方法
      // matches.push(...FixedWindowDetector.findAllMatches(grid));
    }
    
    return matches;
  }
}
