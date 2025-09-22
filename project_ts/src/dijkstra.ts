/**
 * 迪克斯特拉（Dijkstra）算法：在非负权重网格上求最短路径
 * 
 * 算法特点：
 * - 适用于非负权重图的最短路径问题
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 使用二叉堆优先队列按 gCost 最小出队
 * - 保证找到的路径是最优解
 * 
 * 时间复杂度：O((V + E) log V)，其中 V 是节点数，E 是边数
 * 空间复杂度：O(V)
 * 
 * 应用场景：
 * - 游戏中的寻路系统
 * - 网络路由算法
 * - 地图导航系统
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
 * Dijkstra算法配置选项
 */
export interface DijkstraOptions {
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
  /** 父节点，用于路径重构 */
  parent?: NodeRecord;
}

/**
 * 基于二叉堆的优先队列实现
 * 用于Dijkstra算法中按代价排序的节点队列
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
 * @param x X坐标
 * @param y Y坐标
 * @returns 在范围内返回true，否则返回false
 */
function isInside(grid: Grid, x: number, y: number): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0);
}

/**
 * 检查指定位置是否可通行
 * @param grid 网格地图
 * @param x X坐标
 * @param y Y坐标
 * @returns 可通行返回true，否则返回false
 */
function isWalkable(grid: Grid, x: number, y: number): boolean {
  return isInside(grid, x, y) && grid[y][x] === 0;
}

/**
 * 获取指定点的所有可通行邻居
 * @param p 当前点
 * @param grid 网格地图
 * @param allowDiagonal 是否允许对角线移动
 * @returns 可通行的邻居点数组
 */
function getNeighbors(p: Point, grid: Grid, allowDiagonal: boolean): Point[] {
  const { x, y } = p;
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
  return candidates.filter((q) => isWalkable(grid, q.x, q.y));
}

/**
 * 计算从一个点到另一个点的移动代价
 * @param a 起点
 * @param b 终点
 * @returns 移动代价：对角线移动为√2，直线移动为1
 */
function stepCost(a: Point, b: Point): number {
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
  let cur: NodeRecord | undefined = endNode;
  
  // 从终点开始，沿着父节点指针回溯到起点
  while (cur) {
    path.push(cur.position);
    cur = cur.parent;
  }
  
  // 反转数组，得到从起点到终点的路径
  return path.reverse();
}

/**
 * 使用Dijkstra算法在网格中寻找从起点到终点的最短路径
 * 
 * 算法流程：
 * 1. 初始化：将起点加入开放列表，设置起点的g值为0
 * 2. 循环直到找到目标或开放列表为空：
 *    - 从开放列表中取出g值最小的节点
 *    - 如果到达目标，重构路径并返回
 *    - 将当前节点标记为已访问
 *    - 检查所有邻居，更新它们的g值
 * 
 * @param grid 网格地图，0表示可通行，1表示障碍
 * @param start 起点坐标
 * @param goal 终点坐标
 * @param options 算法配置选项
 * @returns 最短路径的点数组，如果无路径则返回null
 */
export function findPathDijkstra(
  grid: Grid,
  start: Point,
  goal: Point,
  options: DijkstraOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  
  // 检查起点和终点是否可通行
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  // gScore[y][x]: 从起点到(x,y)的最短距离
  const gScore: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  
  // closed[y][x]: 标记节点是否已被访问
  const closed: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  // 优先队列：按g值排序，g值小的优先出队
  const open = new PriorityQueue<NodeRecord>((a, b) => a.gCost - b.gCost);

  // 初始化起点
  const startNode: NodeRecord = { position: start, gCost: 0 };
  open.push(startNode);
  gScore[start.y][start.x] = 0;

  // 主循环：Dijkstra算法核心
  while (!open.isEmpty()) {
    // 取出g值最小的节点
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;

    // 跳过过期条目（同一位置可能有多个不同g值的条目）
    if (current.gCost !== gScore[y][x]) continue;
    
    // 到达目标，重构路径
    if (x === goal.x && y === goal.y) {
      return reconstructPath(current);
    }

    // 标记当前节点为已访问
    closed[y][x] = true;

    // 检查所有邻居
    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const nb of neighbors) {
      // 跳过已访问的节点
      if (closed[nb.y][nb.x]) continue;
      
      // 计算从起点经过当前节点到邻居的代价
      const tentative = current.gCost + stepCost(current.position, nb);
      
      // 如果找到更短的路径，更新邻居的g值
      if (tentative < gScore[nb.y][nb.x]) {
        gScore[nb.y][nb.x] = tentative;
        open.push({ position: nb, gCost: tentative, parent: current });
      }
    }
  }

  // 没有找到路径
  return null;
}

/**
 * 完整的Dijkstra算法：计算从起点到网格中所有可达点的最短距离
 * 
 * 与findPathDijkstra的区别：
 * - 不提前终止，会遍历所有可达节点
 * - 返回所有节点的最短距离和前驱节点信息
 * - 适用于需要多次查询不同终点的场景
 * 
 * 算法流程：
 * 1. 初始化：设置起点的距离为0，其他为无穷大
 * 2. 循环直到所有可达节点都被访问：
 *    - 从未访问节点中选择距离最小的节点
 *    - 标记为已访问
 *    - 更新所有邻居的距离
 * 
 * @param grid 网格地图，0表示可通行，1表示障碍
 * @param start 起点坐标
 * @param options 算法配置选项
 * @returns 包含距离矩阵和父节点矩阵的对象
 *   - dist[y][x]: 从起点到(x,y)的最短距离（不可达为+Infinity）
 *   - parent[y][x]: 到达(x,y)的前驱坐标（用于回溯路径），不可达为undefined
 */
export function dijkstraAll(
  grid: Grid,
  start: Point,
  options: DijkstraOptions = {}
): { dist: number[][]; parent: (Point | undefined)[][] } {
  const allowDiagonal = options.allowDiagonal ?? false;
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  // 距离矩阵：存储从起点到每个点的最短距离
  const dist: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  
  // 父节点矩阵：存储到达每个点的前驱节点
  const parent: (Point | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );
  
  // 访问标记矩阵：标记节点是否已被访问
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  // 优先队列：按距离排序
  const open = new PriorityQueue<NodeRecord>((a, b) => a.gCost - b.gCost);

  // 初始化起点
  if (isWalkable(grid, start.x, start.y)) {
    dist[start.y][start.x] = 0;
    open.push({ position: start, gCost: 0 });
  }

  // 主循环：遍历所有可达节点
  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;
    
    // 跳过已访问的节点
    if (visited[y][x]) continue;
    
    // 跳过过期条目
    if (current.gCost !== dist[y][x]) continue;
    
    // 标记为已访问
    visited[y][x] = true;

    // 检查所有邻居
    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const nb of neighbors) {
      const nx = nb.x, ny = nb.y;
      
      // 跳过已访问的节点
      if (visited[ny][nx]) continue;
      
      // 计算新的距离
      const tentative = dist[y][x] + stepCost(current.position, nb);
      
      // 如果找到更短的路径，更新距离和父节点
      if (tentative < dist[ny][nx]) {
        dist[ny][nx] = tentative;
        parent[ny][nx] = { x, y };
        open.push({ position: nb, gCost: tentative });
      }
    }
  }

  return { dist, parent };
}
