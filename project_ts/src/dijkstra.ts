/**
 * 迪克斯特拉（Dijkstra）算法：在非负权重网格上求最短路径
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 用二叉堆优先队列按 gCost 最小出队
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface DijkstraOptions {
  allowDiagonal?: boolean;
}

interface NodeRecord {
  position: Point;
  gCost: number;
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

function stepCost(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx === 1 && dy === 1 ? Math.SQRT2 : 1;
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

export function findPathDijkstra(
  grid: Grid,
  start: Point,
  goal: Point,
  options: DijkstraOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) return null;

  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const gScore: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  const closed: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  const open = new PriorityQueue<NodeRecord>((a, b) => a.gCost - b.gCost);

  const startNode: NodeRecord = { position: start, gCost: 0 };
  open.push(startNode);
  gScore[start.y][start.x] = 0;

  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;

    if (current.gCost !== gScore[y][x]) continue; // 过期条目
    if (x === goal.x && y === goal.y) {
      return reconstructPath(current);
    }

    closed[y][x] = true;

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const nb of neighbors) {
      if (closed[nb.y][nb.x]) continue;
      const tentative = current.gCost + stepCost(current.position, nb);
      if (tentative < gScore[nb.y][nb.x]) {
        gScore[nb.y][nb.x] = tentative;
        open.push({ position: nb, gCost: tentative, parent: current });
      }
    }
  }

  return null;
}

/**
 * 常规 Dijkstra：给出源点到全图所有可达点的最短距离与父指针
 * @returns { dist, parent }：
 *  - dist[y][x]: 从 start 到 (x,y) 的最短距离（不可达为 +Infinity）
 *  - parent[y][x]: 到达 (x,y) 的前驱坐标（用于回溯路径），不可达为 undefined
 */
export function dijkstraAll(
  grid: Grid,
  start: Point,
  options: DijkstraOptions = {}
): { dist: number[][]; parent: (Point | undefined)[][] } {
  const allowDiagonal = options.allowDiagonal ?? false;
  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const dist: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  const parent: (Point | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  const open = new PriorityQueue<NodeRecord>((a, b) => a.gCost - b.gCost);

  if (isWalkable(grid, start.x, start.y)) {
    dist[start.y][start.x] = 0;
    open.push({ position: start, gCost: 0 });
  }

  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;
    if (visited[y][x]) continue;
    if (current.gCost !== dist[y][x]) continue; // 过期条目
    visited[y][x] = true;

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (const nb of neighbors) {
      const nx = nb.x, ny = nb.y;
      if (visited[ny][nx]) continue;
      const tentative = dist[y][x] + stepCost(current.position, nb);
      if (tentative < dist[ny][nx]) {
        dist[ny][nx] = tentative;
        parent[ny][nx] = { x, y };
        open.push({ position: nb, gCost: tentative });
      }
    }
  }

  return { dist, parent };
}
