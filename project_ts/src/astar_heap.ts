/**
 * 使用二叉堆优先队列优化 open 集合的 A* 实现
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface AStarOptions {
  allowDiagonal?: boolean;
}

interface NodeRecord {
  position: Point;
  gCost: number;
  fCost: number;
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

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
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

function isInside(grid: Grid, point: Point): boolean {
  return (
    point.y >= 0 &&
    point.y < grid.length &&
    point.x >= 0 &&
    point.x < (grid[0]?.length ?? 0)
  );
}

function isWalkable(grid: Grid, point: Point): boolean {
  return isInside(grid, point) && grid[point.y][point.x] === 0;
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

function getNeighbors(point: Point, grid: Grid, allowDiagonal: boolean): Point[] {
  const candidates: Point[] = [
    { x: point.x + 1, y: point.y },
    { x: point.x - 1, y: point.y },
    { x: point.x, y: point.y + 1 },
    { x: point.x, y: point.y - 1 },
  ];
  if (allowDiagonal) {
    candidates.push(
      { x: point.x + 1, y: point.y + 1 },
      { x: point.x + 1, y: point.y - 1 },
      { x: point.x - 1, y: point.y + 1 },
      { x: point.x - 1, y: point.y - 1 },
    );
  }
  return candidates.filter((p) => isWalkable(grid, p));
}

function cost(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx === 1 && dy === 1 ? Math.SQRT2 : 1;
}

function reconstructPath(endNode: NodeRecord): Point[] {
  const path: Point[] = [];
  let current: NodeRecord | undefined = endNode;
  while (current) {
    path.push(current.position);
    current = current.parent;
  }
  return path.reverse();
}

export function findPathHeap(
  grid: Grid,
  start: Point,
  goal: Point,
  options: AStarOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;

  if (!isWalkable(grid, start) || !isWalkable(grid, goal)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;

  const gScore: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  const closed: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  const open = new PriorityQueue<NodeRecord>((a, b) => {
    if (a.fCost !== b.fCost) return a.fCost - b.fCost;
    // tie-break：f 相等时，g 更大者优先（更靠近目标的倾向）
    return b.gCost - a.gCost;
  });

  const startNode: NodeRecord = {
    position: start,
    gCost: 0,
    fCost: heuristic(start, goal, allowDiagonal),
  };
  open.push(startNode);
  gScore[start.y][start.x] = 0;

  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord; // 非空前提 pop
    const { position } = current;

    if (current.gCost !== gScore[position.y][position.x]) {
      // 过期条目
      continue;
    }

    if (position.x === goal.x && position.y === goal.y) {
      return reconstructPath(current);
    }

    closed[position.y][position.x] = true;

    const neighbors = getNeighbors(position, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      if (closed[neighbor.y][neighbor.x]) continue;

      const tentativeG = current.gCost + cost(position, neighbor);
      if (tentativeG < gScore[neighbor.y][neighbor.x]) {
        gScore[neighbor.y][neighbor.x] = tentativeG;
        const f = tentativeG + heuristic(neighbor, goal, allowDiagonal);
        const nextNode: NodeRecord = {
          position: neighbor,
          gCost: tentativeG,
          fCost: f,
          parent: current,
        };
        open.push(nextNode);
      }
    }
  }

  return null;
}
