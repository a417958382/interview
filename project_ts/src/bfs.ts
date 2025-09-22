/**
 * 广度优先搜索（BFS）算法：在网格上求最短路径
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 使用队列按层级扩展，保证最短路径
 * - 适用于等权重网格
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface BFSOptions {
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

function reconstructPath(endNode: NodeRecord): Point[] {
  const path: Point[] = [];
  let cur: NodeRecord | undefined = endNode;
  while (cur) {
    path.push(cur.position);
    cur = cur.parent;
  }
  return path.reverse();
}

/**
 * BFS 路径查找
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns 路径点数组，如果未找到路径则返回 null
 */
export function findPathBFS(
  grid: Grid,
  start: Point,
  goal: Point,
  options: BFSOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const parent: (Point | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );

  const queue = new Queue<NodeRecord>();
  queue.enqueue({ position: start });
  visited[start.y][start.x] = true;

  while (!queue.isEmpty()) {
    const current = queue.dequeue() as NodeRecord;
    const { x, y } = current.position;

    if (x === goal.x && y === goal.y) {
      return reconstructPath(current);
    }

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (!visited[neighbor.y][neighbor.x]) {
        visited[neighbor.y][neighbor.x] = true;
        parent[neighbor.y][neighbor.x] = current.position;
        queue.enqueue({ position: neighbor, parent: current });
      }
    }
  }

  return null;
}

/**
 * BFS 全图搜索：给出源点到全图所有可达点的最短距离与父指针
 * @param grid 网格地图
 * @param start 起点
 * @param options 选项
 * @returns { dist, parent }：
 *  - dist[y][x]: 从 start 到 (x,y) 的最短距离（不可达为 -1）
 *  - parent[y][x]: 到达 (x,y) 的前驱坐标（用于回溯路径），不可达为 undefined
 */
export function bfsAll(
  grid: Grid,
  start: Point,
  options: BFSOptions = {}
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

  const queue = new Queue<{ position: Point; distance: number }>();

  if (isWalkable(grid, start.x, start.y)) {
    dist[start.y][start.x] = 0;
    queue.enqueue({ position: start, distance: 0 });
  }

  while (!queue.isEmpty()) {
    const current = queue.dequeue() as { position: Point; distance: number };
    const { x, y } = current.position;

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (dist[neighbor.y][neighbor.x] === -1) {
        dist[neighbor.y][neighbor.x] = current.distance + 1;
        parent[neighbor.y][neighbor.x] = { x, y };
        queue.enqueue({ position: neighbor, distance: current.distance + 1 });
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
