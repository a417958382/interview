/**
 * 双向搜索算法：在网格上求最短路径
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 从起点和终点同时搜索，在中间相遇
 * - 大幅减少搜索空间，提高效率
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface BidirectionalOptions {
  allowDiagonal?: boolean;
}

interface NodeRecord {
  position: Point;
  parent?: NodeRecord;
}

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

function isInside(grid: Grid, x: number, y: number): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0);
}

function isWalkable(grid: Grid, x: number, y: number): boolean {
  return isInside(grid, x, y) && grid[y][x] === 0;
}

function getNeighbors(p: Point, grid: Grid, allowDiagonal: boolean): Point[] {
  const { x, y } = p;
  const candidates: Point[] = [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
  if (allowDiagonal) {
    candidates.push(
      { x: x + 1, y: y + 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y: y - 1 },
    );
  }
  return candidates.filter((q) => isWalkable(grid, q.x, q.y));
}

function reconstructPath(
  fromStart: NodeRecord | null,
  fromGoal: NodeRecord | null,
  meetingPoint: Point
): Point[] {
  const path: Point[] = [];
  
  // 从起点到相遇点
  if (fromStart) {
    const startPath: Point[] = [];
    let current: NodeRecord | undefined = fromStart;
    while (current) {
      startPath.push(current.position);
      current = current.parent;
    }
    path.push(...startPath.reverse());
  }
  
  // 从相遇点到终点
  if (fromGoal) {
    const goalPath: Point[] = [];
    let current: NodeRecord | undefined = fromGoal;
    while (current) {
      goalPath.push(current.position);
      current = current.parent;
    }
    // 跳过相遇点，避免重复
    path.push(...goalPath.slice(1));
  }
  
  return path;
}

/**
 * 双向搜索路径查找
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns 路径点数组，如果未找到路径则返回 null
 */
export function findPathBidirectional(
  grid: Grid,
  start: Point,
  goal: Point,
  options: BidirectionalOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  // 从起点开始的搜索
  const visitedFromStart: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const parentFromStart: (NodeRecord | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );
  
  // 从终点开始的搜索
  const visitedFromGoal: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const parentFromGoal: (NodeRecord | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );

  const queueFromStart = new Queue<NodeRecord>();
  const queueFromGoal = new Queue<NodeRecord>();
  
  queueFromStart.enqueue({ position: start });
  queueFromGoal.enqueue({ position: goal });
  
  visitedFromStart[start.y][start.x] = true;
  visitedFromGoal[goal.y][goal.x] = true;
  
  parentFromStart[start.y][start.x] = undefined;
  parentFromGoal[goal.y][goal.x] = undefined;

  while (!queueFromStart.isEmpty() && !queueFromGoal.isEmpty()) {
    // 从起点扩展一层
    const currentFromStart = queueFromStart.dequeue() as NodeRecord;
    const { x: sx, y: sy } = currentFromStart.position;

    // 检查是否与从终点的搜索相遇
    if (visitedFromGoal[sy][sx]) {
      return reconstructPath(currentFromStart, parentFromGoal[sy][sx], currentFromStart.position);
    }

    const neighborsFromStart = getNeighbors(currentFromStart.position, grid, allowDiagonal);
    for (const neighbor of neighborsFromStart) {
      if (!visitedFromStart[neighbor.y][neighbor.x]) {
        visitedFromStart[neighbor.y][neighbor.x] = true;
        parentFromStart[neighbor.y][neighbor.x] = currentFromStart;
        queueFromStart.enqueue({ position: neighbor, parent: currentFromStart });
      }
    }

    // 从终点扩展一层
    const currentFromGoal = queueFromGoal.dequeue() as NodeRecord;
    const { x: gx, y: gy } = currentFromGoal.position;

    // 检查是否与从起点的搜索相遇
    if (visitedFromStart[gy][gx]) {
      return reconstructPath(parentFromStart[gy][gx], currentFromGoal, currentFromGoal.position);
    }

    const neighborsFromGoal = getNeighbors(currentFromGoal.position, grid, allowDiagonal);
    for (const neighbor of neighborsFromGoal) {
      if (!visitedFromGoal[neighbor.y][neighbor.x]) {
        visitedFromGoal[neighbor.y][neighbor.x] = true;
        parentFromGoal[neighbor.y][neighbor.x] = currentFromGoal;
        queueFromGoal.enqueue({ position: neighbor, parent: currentFromGoal });
      }
    }
  }

  return null;
}

/**
 * 双向搜索全图：给出源点到全图所有可达点的最短距离
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns { dist, parent }：
 *  - dist[y][x]: 从 start 到 (x,y) 的最短距离（不可达为 -1）
 *  - parent[y][x]: 到达 (x,y) 的前驱坐标（用于回溯路径），不可达为 undefined
 */
export function bidirectionalAll(
  grid: Grid,
  start: Point,
  goal: Point,
  options: BidirectionalOptions = {}
): { dist: number[][]; parent: (Point | undefined)[][] } {
  const allowDiagonal = options.allowDiagonal ?? false;
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const dist: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => -1)
  );
  const parent: (Point | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );

  // 从起点开始的搜索
  const visitedFromStart: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const distFromStart: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => -1)
  );
  
  // 从终点开始的搜索
  const visitedFromGoal: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const distFromGoal: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => -1)
  );

  const queueFromStart = new Queue<{ position: Point; distance: number }>();
  const queueFromGoal = new Queue<{ position: Point; distance: number }>();

  if (isWalkable(grid, start.x, start.y)) {
    distFromStart[start.y][start.x] = 0;
    queueFromStart.enqueue({ position: start, distance: 0 });
  }

  if (isWalkable(grid, goal.x, goal.y)) {
    distFromGoal[goal.y][goal.x] = 0;
    queueFromGoal.enqueue({ position: goal, distance: 0 });
  }

  while (!queueFromStart.isEmpty() && !queueFromGoal.isEmpty()) {
    // 从起点扩展
    const currentFromStart = queueFromStart.dequeue() as { position: Point; distance: number };
    const { x: sx, y: sy } = currentFromStart.position;

    if (visitedFromStart[sy][sx]) continue;
    visitedFromStart[sy][sx] = true;

    // 检查是否与从终点的搜索相遇
    if (visitedFromGoal[sy][sx]) {
      // 合并两个搜索的结果
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (distFromStart[y][x] !== -1) {
            dist[y][x] = distFromStart[y][x];
          } else if (distFromGoal[y][x] !== -1) {
            dist[y][x] = distFromGoal[y][x];
          }
        }
      }
      return { dist, parent };
    }

    const neighborsFromStart = getNeighbors(currentFromStart.position, grid, allowDiagonal);
    for (const neighbor of neighborsFromStart) {
      if (distFromStart[neighbor.y][neighbor.x] === -1) {
        distFromStart[neighbor.y][neighbor.x] = currentFromStart.distance + 1;
        parent[neighbor.y][neighbor.x] = currentFromStart.position;
        queueFromStart.enqueue({ position: neighbor, distance: currentFromStart.distance + 1 });
      }
    }

    // 从终点扩展
    const currentFromGoal = queueFromGoal.dequeue() as { position: Point; distance: number };
    const { x: gx, y: gy } = currentFromGoal.position;

    if (visitedFromGoal[gy][gx]) continue;
    visitedFromGoal[gy][gx] = true;

    // 检查是否与从起点的搜索相遇
    if (visitedFromStart[gy][gx]) {
      // 合并两个搜索的结果
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (distFromStart[y][x] !== -1) {
            dist[y][x] = distFromStart[y][x];
          } else if (distFromGoal[y][x] !== -1) {
            dist[y][x] = distFromGoal[y][x];
          }
        }
      }
      return { dist, parent };
    }

    const neighborsFromGoal = getNeighbors(currentFromGoal.position, grid, allowDiagonal);
    for (const neighbor of neighborsFromGoal) {
      if (distFromGoal[neighbor.y][neighbor.x] === -1) {
        distFromGoal[neighbor.y][neighbor.x] = currentFromGoal.distance + 1;
        parent[neighbor.y][neighbor.x] = currentFromGoal.position;
        queueFromGoal.enqueue({ position: neighbor, distance: currentFromGoal.distance + 1 });
      }
    }
  }

  return { dist, parent };
}

/**
 * 计算路径长度（步数）
 */
export function calculatePathLength(path: Point[], allowDiagonal: boolean = false): number {
  if (path.length <= 1) return 0;
  
  let length = 0;
  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    const dx = Math.abs(curr.x - prev.x);
    const dy = Math.abs(curr.y - prev.y);
    
    if (allowDiagonal && dx === 1 && dy === 1) {
      length += Math.SQRT2;
    } else {
      length += dx + dy;
    }
  }
  
  return length;
}
