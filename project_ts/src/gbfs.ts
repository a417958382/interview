/**
 * 贪婪最佳优先搜索（GBFS）算法：在网格上寻找路径
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 只使用启发式函数，不考虑实际距离
 * - 速度快但不保证最优路径
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface GBFSOptions {
  allowDiagonal?: boolean;
}

interface NodeRecord {
  position: Point;
  parent?: NodeRecord;
}

class PriorityQueue<T> {
  private heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

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

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parentIdx = (idx - 1) >> 1;
      if (this.compare(this.heap[idx], this.heap[parentIdx]) < 0) {
        this.swap(idx, parentIdx);
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  private bubbleDown(idx: number): void {
    const n = this.heap.length;
    while (true) {
      const left = idx * 2 + 1;
      const right = left + 1;
      let smallest = idx;
      if (left < n && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < n && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== idx) {
        this.swap(idx, smallest);
        idx = smallest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const tmp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = tmp;
  }
}

function isInside(grid: Grid, x: number, y: number): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0);
}

function isWalkable(grid: Grid, x: number, y: number): boolean {
  return isInside(grid, x, y) && grid[y][x] === 0;
}

function heuristic(a: Point, b: Point, allowDiagonal: boolean): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (allowDiagonal) {
    const D = 1;
    const D2 = Math.SQRT2;
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
  }
  return dx + dy;
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
 * GBFS 路径查找
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns 路径点数组，如果未找到路径则返回 null
 */
export function findPathGBFS(
  grid: Grid,
  start: Point,
  goal: Point,
  options: GBFSOptions = {}
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

  // 使用启发式函数作为优先级
  const open = new PriorityQueue<NodeRecord>((a, b) => {
    const hA = heuristic(a.position, goal, allowDiagonal);
    const hB = heuristic(b.position, goal, allowDiagonal);
    return hA - hB;
  });

  open.push({ position: start });

  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;

    if (visited[y][x]) continue;
    visited[y][x] = true;

    if (x === goal.x && y === goal.y) {
      return reconstructPath(current);
    }

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (!visited[neighbor.y][neighbor.x]) {
        open.push({ position: neighbor, parent: current });
      }
    }
  }

  return null;
}

/**
 * GBFS 全图搜索：找到所有可达点（按启发式函数排序）
 * @param grid 网格地图
 * @param start 起点
 * @param goal 目标点（用于计算启发式函数）
 * @param options 选项
 * @returns 所有可达点的坐标数组（按启发式函数排序）
 */
export function gbfsAll(
  grid: Grid,
  start: Point,
  goal: Point,
  options: GBFSOptions = {}
): Point[] {
  const allowDiagonal = options.allowDiagonal ?? false;
  
  if (!isWalkable(grid, start.x, start.y)) {
    return [];
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const reachable: Point[] = [];

  const open = new PriorityQueue<Point>((a, b) => {
    const hA = heuristic(a, goal, allowDiagonal);
    const hB = heuristic(b, goal, allowDiagonal);
    return hA - hB;
  });

  open.push(start);

  while (!open.isEmpty()) {
    const current = open.pop() as Point;
    const { x, y } = current;

    if (visited[y][x]) continue;
    visited[y][x] = true;
    reachable.push(current);

    const neighbors = getNeighbors(current, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (!visited[neighbor.y][neighbor.x]) {
        open.push(neighbor);
      }
    }
  }

  return reachable;
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

/**
 * 计算路径的启发式函数值总和
 */
export function calculateHeuristicSum(path: Point[], goal: Point, allowDiagonal: boolean = false): number {
  let sum = 0;
  for (const point of path) {
    sum += heuristic(point, goal, allowDiagonal);
  }
  return sum;
}
