/**
 * 使用二叉堆优先队列优化 open 集合的 A* 算法实现
 * 
 * 算法特点：
 * - 结合了Dijkstra算法的准确性（保证最优解）和贪心算法的效率
 * - 使用启发式函数 h(n) 引导搜索方向，减少搜索空间
 * - 使用二叉堆优先队列优化 open 集合的操作效率
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 保证找到的路径是最优解（启发式函数满足一致性条件）
 * 
 * 时间复杂度：O((V + E) log V)，其中 V 是节点数，E 是边数
 * 空间复杂度：O(V)
 * 
 * 应用场景：
 * - 游戏中的寻路系统
 * - 机器人路径规划
 * - 地图导航系统
 * - 任何需要最优路径的场景
 */

/**
 * 二维坐标点
 */
export type Point = { x: number; y: number };

/**
 * 网格地图表示
 * - 0: 可通行的空地
 * - 1: 障碍物
 */
export type Grid = number[][];

/**
 * A*算法配置选项
 */
export interface AStarOptions {
  /** 是否允许对角线移动（8邻接），默认为false（4邻接） */
  allowDiagonal?: boolean;
}

/**
 * 节点记录，用于算法执行过程中的状态跟踪
 */
interface NodeRecord {
  /** 节点在网格中的位置 */
  position: Point;
  /** 从起点到该节点的实际代价（g值） */
  gCost: number;
  /** 总代价估计（f值 = g值 + h值） */
  fCost: number;
  /** 父节点，用于路径重构 */
  parent?: NodeRecord;
}

/**
 * 基于二叉堆的优先队列实现
 * 用于A*算法中按f值排序的节点队列
 * 
 * 堆特性：
 * - 父节点的值总是小于等于子节点的值（最小堆）
 * - 根节点始终是最小值
 * - 插入和删除操作的时间复杂度为O(log n)
 */
class PriorityQueue<T> {
  /** 堆数组，存储所有元素 */
  private heap: T[] = [];
  /** 比较函数，用于确定元素优先级 */
  private readonly compare: (a: T, b: T) => number;

  /**
   * 构造函数
   * @param compare 比较函数，返回负数表示a优先级更高，正数表示b优先级更高
   */
  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  /**
   * 向队列中添加元素
   * @param item 要添加的元素
   */
  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  /**
   * 从队列中取出优先级最高的元素
   * @returns 优先级最高的元素，队列为空时返回undefined
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop() as T;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  /**
   * 查看队列顶部元素但不移除
   * @returns 优先级最高的元素，队列为空时返回undefined
   */
  peek(): T | undefined {
    return this.heap[0];
  }

  /**
   * 获取队列中元素的数量
   * @returns 元素数量
   */
  size(): number {
    return this.heap.length;
  }

  /**
   * 检查队列是否为空
   * @returns 队列为空返回true，否则返回false
   */
  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * 向上调整堆结构（插入元素后调用）
   * 将新插入的元素向上移动到正确位置
   * @param idx 需要调整的节点索引
   */
  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = (idx - 1) >> 1; // 父节点索引
      if (this.compare(this.heap[idx], this.heap[parentIdx]) < 0) {
        this.swap(idx, parentIdx);
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  /**
   * 向下调整堆结构（删除根节点后调用）
   * 将根节点向下移动到正确位置
   * @param idx 需要调整的节点索引
   */
  private bubbleDown(idx: number): void {
    const n = this.heap.length;
    while (true) {
      const left = idx * 2 + 1;  // 左子节点索引
      const right = left + 1;    // 右子节点索引
      let smallest = idx;
      
      // 找到当前节点和其子节点中的最小值
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      
      // 如果最小值不是当前节点，则交换并继续调整
      if (smallest !== idx) {
        this.swap(idx, smallest);
        idx = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * 交换堆中两个位置的元素
   * @param i 第一个位置索引
   * @param j 第二个位置索引
   */
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/**
 * 检查坐标是否在网格范围内
 * @param grid 网格地图
 * @param point 要检查的点
 * @returns 在范围内返回true，否则返回false
 */
function isInside(grid: Grid, point: Point): boolean {
  return (
    point.y >= 0 &&
    point.y < grid.length &&
    point.x >= 0 &&
    point.x < (grid[0]?.length ?? 0)
  );
}

/**
 * 检查指定位置是否可通行
 * @param grid 网格地图
 * @param point 要检查的点
 * @returns 可通行返回true，否则返回false
 */
function isWalkable(grid: Grid, point: Point): boolean {
  return isInside(grid, point) && grid[point.y][point.x] === 0;
}

/**
 * 启发式函数：估算从当前点到目标点的距离
 * 
 * 启发式函数的选择原则：
 * - 必须满足一致性条件（admissible）：h(n) <= h*(n)，其中h*(n)是真实最短距离
 * - 越接近真实距离，算法效率越高
 * - 不能高估真实距离，否则可能找不到最优解
 * 
 * 本实现使用：
 * - 4邻接：曼哈顿距离 |dx| + |dy|
 * - 8邻接：对角线距离，考虑对角线移动的√2代价
 * 
 * @param a 当前点
 * @param b 目标点
 * @param allowDiagonal 是否允许对角线移动
 * @returns 启发式距离估计值
 */
function heuristic(a: Point, b: Point, allowDiagonal: boolean): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  
  if (allowDiagonal) {
    // 8邻接：对角线距离
    // 公式：D * (dx + dy) + (D2 - 2*D) * min(dx, dy)
    // 其中 D = 1（直线移动代价），D2 = √2（对角线移动代价）
    const D = 1;
    const D2 = Math.SQRT2;
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
  }
  
  // 4邻接：曼哈顿距离
  return dx + dy;
}

/**
 * 获取指定点的所有可通行邻居
 * @param point 当前点
 * @param grid 网格地图
 * @param allowDiagonal 是否允许对角线移动
 * @returns 可通行的邻居点数组
 */
function getNeighbors(point: Point, grid: Grid, allowDiagonal: boolean): Point[] {
  const { x, y } = point;
  
  // 4邻接：上下左右
  const candidates: Point[] = [
    { x: x + 1, y },      // 右
    { x: x - 1, y },      // 左
    { x, y: y + 1 },      // 下
    { x, y: y - 1 },      // 上
  ];
  
  // 如果允许对角线移动，添加4个对角线方向
  if (allowDiagonal) {
    candidates.push(
      { x: x + 1, y: y + 1 },  // 右下
      { x: x + 1, y: y - 1 },  // 右上
      { x: x - 1, y: y + 1 },  // 左下
      { x: x - 1, y: y - 1 },  // 左上
    );
  }
  
  // 过滤出可通行的邻居
  return candidates.filter((p) => isWalkable(grid, p));
}

/**
 * 计算从一个点到另一个点的移动代价
 * @param a 起点
 * @param b 终点
 * @returns 移动代价：对角线移动为√2，直线移动为1
 */
function cost(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  // 对角线移动代价为√2，直线移动代价为1
  return dx === 1 && dy === 1 ? Math.SQRT2 : 1;
}

/**
 * 从终点节点重构完整路径
 * @param endNode 终点节点
 * @returns 从起点到终点的路径点数组
 */
function reconstructPath(endNode: NodeRecord): Point[] {
  const path: Point[] = [];
  let current: NodeRecord | undefined = endNode;
  
  // 从终点开始，沿着父节点指针回溯到起点
  while (current) {
    path.push(current.position);
    current = current.parent;
  }
  
  // 反转数组，得到从起点到终点的路径
  return path.reverse();
}

/**
 * 使用A*算法在网格中寻找从起点到终点的最短路径
 * 
 * A*算法流程：
 * 1. 初始化：将起点加入开放列表，设置起点的g值为0，f值为g+h
 * 2. 循环直到找到目标或开放列表为空：
 *    - 从开放列表中取出f值最小的节点
 *    - 如果到达目标，重构路径并返回
 *    - 将当前节点标记为已访问
 *    - 检查所有邻居，计算新的g值和f值，更新开放列表
 * 
 * A*算法的关键特点：
 * - f(n) = g(n) + h(n)，其中g(n)是实际代价，h(n)是启发式估计
 * - 启发式函数h(n)必须满足一致性条件，保证找到最优解
 * - 使用优先队列按f值排序，优先探索最有希望的路径
 * 
 * @param grid 网格地图，0表示可通行，1表示障碍
 * @param start 起点坐标
 * @param goal 终点坐标
 * @param options 算法配置选项
 * @returns 最短路径的点数组，如果无路径则返回null
 */
export function findPathHeap(
  grid: Grid,
  start: Point,
  goal: Point,
  options: AStarOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  
  console.log(`🚀 开始A*算法寻路`);
  console.log(`📍 起点: (${start.x}, ${start.y})`);
  console.log(`🎯 终点: (${goal.x}, ${goal.y})`);
  console.log(`🔀 允许对角线移动: ${allowDiagonal}`);
  
  // 检查起点和终点是否可通行
  if (!isWalkable(grid, start) || !isWalkable(grid, goal)) {
    console.log(`❌ 起点或终点不可通行，寻路失败`);
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  console.log(`🗺️  网格大小: ${width} x ${height}`);

  // gScore[y][x]: 从起点到(x,y)的最短距离
  const gScore: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  
  // closed[y][x]: 标记节点是否已被访问
  const closed: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  // 优先队列：按f值排序，f值小的优先出队
  // tie-break：f相等时，g更大者优先（更靠近目标的倾向）
  const open = new PriorityQueue<NodeRecord>((a, b) => {
    if (a.fCost !== b.fCost) return a.fCost - b.fCost;
    return b.gCost - a.gCost;
  });

  // 初始化起点
  const startH = heuristic(start, goal, allowDiagonal);
  const startNode: NodeRecord = {
    position: start,
    gCost: 0,
    fCost: startH,
  };
  open.push(startNode);
  gScore[start.y][start.x] = 0;
  
  console.log(`✅ 初始化完成，起点已加入开放列表`);
  console.log(`📊 起点启发式值 h: ${startH.toFixed(2)}`);
  console.log(`📊 起点总代价 f: ${startNode.fCost.toFixed(2)}`);
  console.log(`📊 开放列表初始大小: ${open.isEmpty() ? 0 : 1}`);

  let iterationCount = 0;
  let totalNodesExplored = 0;

  // 主循环：A*算法核心
  while (!open.isEmpty()) {
    iterationCount++;
    
    // 取出f值最小的节点
    const current = open.pop() as NodeRecord;
    const { position } = current;
    const { x, y } = position;

    console.log(`\n🔄 第 ${iterationCount} 次迭代`);
    console.log(`📤 从开放列表取出节点: (${x}, ${y})`);
    console.log(`📊 节点代价 - g: ${current.gCost.toFixed(2)}, h: ${(current.fCost - current.gCost).toFixed(2)}, f: ${current.fCost.toFixed(2)}`);

    // 跳过过期条目（同一位置可能有多个不同g值的条目）
    if (current.gCost !== gScore[y][x]) {
      console.log(`⏭️  跳过过期条目，当前g值: ${current.gCost.toFixed(2)}, 记录g值: ${gScore[y][x].toFixed(2)}`);
      continue;
    }
    
    // 到达目标，重构路径
    if (x === goal.x && y === goal.y) {
      console.log(`🎉 找到目标节点！`);
      console.log(`📈 总迭代次数: ${iterationCount}`);
      console.log(`🔍 总探索节点数: ${totalNodesExplored}`);
      console.log(`📏 最短距离: ${current.gCost.toFixed(2)}`);
      
      const path = reconstructPath(current);
      console.log(`🛤️  路径长度: ${path.length} 个节点`);
      console.log(`📍 路径: ${path.map(p => `(${p.x},${p.y})`).join(' → ')}`);
      
      return path;
    }

    // 标记当前节点为已访问
    closed[y][x] = true;
    totalNodesExplored++;
    console.log(`✅ 节点 (${x}, ${y}) 已标记为已访问`);

    // 检查所有邻居
    const neighbors = getNeighbors(position, grid, allowDiagonal);
    console.log(`🔍 检查 ${neighbors.length} 个邻居节点`);
    
    let updatedNeighbors = 0;
    for (const neighbor of neighbors) {
      // 跳过已访问的节点
      if (closed[neighbor.y][neighbor.x]) {
        console.log(`  ⏭️  邻居 (${neighbor.x}, ${neighbor.y}) 已访问，跳过`);
        continue;
      }
      
      // 计算从起点经过当前节点到邻居的代价
      const tentativeG = current.gCost + cost(position, neighbor);
      const currentG = gScore[neighbor.y][neighbor.x];
      const h = heuristic(neighbor, goal, allowDiagonal);
      const f = tentativeG + h;
      
      console.log(`  🔍 邻居 (${neighbor.x}, ${neighbor.y}): 当前g值=${currentG === Number.POSITIVE_INFINITY ? '∞' : currentG.toFixed(2)}, 新g值=${tentativeG.toFixed(2)}, h值=${h.toFixed(2)}, f值=${f.toFixed(2)}`);
      
      // 如果找到更短的路径，更新邻居的g值和f值
      if (tentativeG < gScore[neighbor.y][neighbor.x]) {
        gScore[neighbor.y][neighbor.x] = tentativeG;
        const nextNode: NodeRecord = {
          position: neighbor,
          gCost: tentativeG,
          fCost: f,
          parent: current,
        };
        open.push(nextNode);
        updatedNeighbors++;
        console.log(`    ✅ 更新邻居 (${neighbor.x}, ${neighbor.y}) 的g值为 ${tentativeG.toFixed(2)}，f值为 ${f.toFixed(2)}，已加入开放列表`);
      } else {
        console.log(`    ❌ 新路径不更优，跳过`);
      }
    }
    
    console.log(`📊 本次迭代更新了 ${updatedNeighbors} 个邻居节点`);
    
    // 打印开放列表内容（不包含父节点信息）
    if (!open.isEmpty()) {
      const openListCopy: NodeRecord[] = [];
      const tempQueue = new PriorityQueue<NodeRecord>((a, b) => {
        if (a.fCost !== b.fCost) return a.fCost - b.fCost;
        return b.gCost - a.gCost;
      });
      
      // 复制开放列表内容
      while (!open.isEmpty()) {
        const node = open.pop() as NodeRecord;
        openListCopy.push(node);
        tempQueue.push(node);
      }
      
      // 恢复开放列表
      while (!tempQueue.isEmpty()) {
        open.push(tempQueue.pop() as NodeRecord);
      }
      
      // 按f值排序并打印
      openListCopy.sort((a, b) => {
        if (a.fCost !== b.fCost) return a.fCost - b.fCost;
        return b.gCost - a.gCost;
      });
      console.log(`📋 开放列表内容 (${openListCopy.length} 个节点):`);
      openListCopy.forEach((node, index) => {
        const h = node.fCost - node.gCost;
        console.log(`  ${index + 1}. (${node.position.x}, ${node.position.y}) - g:${node.gCost.toFixed(2)}, h:${h.toFixed(2)}, f:${node.fCost.toFixed(2)}`);
      });
    } else {
      console.log(`📋 开放列表为空`);
    }
  }

  console.log(`\n❌ 开放列表为空，未找到路径`);
  console.log(`📈 总迭代次数: ${iterationCount}`);
  console.log(`🔍 总探索节点数: ${totalNodesExplored}`);
  
  // 没有找到路径
  return null;
}
