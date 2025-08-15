/**
 * Jump Point Search (JPS) for uniform-cost grids (0 walkable, 1 blocked)
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 使用二叉堆优先队列维护 open
 * - 与标准 A* 一样使用 f = g + h
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

function costDiagonalAllowed(dx: number, dy: number): number {
  return dx !== 0 && dy !== 0 ? Math.SQRT2 : 1;
}

function equals(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

function getDirectionsFromParent(curr: Point, parent: Point | undefined, allowDiagonal: boolean): Array<[number, number]> {
  if (!parent) {
    // 根节点：返回所有可能方向
    const dirs: Array<[number, number]> = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
    ];
    if (allowDiagonal) dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    return dirs;
  }
  const dx = Math.sign(curr.x - parent.x);
  const dy = Math.sign(curr.y - parent.y);

  // 沿着从 parent 到 curr 的方向继续推进，
  // 并根据 JPS 的邻居剪枝规则加入必要的自然/强制方向。
  const dirs: Array<[number, number]> = [];

  if (allowDiagonal && dx !== 0 && dy !== 0) {
    // 对角移动：保留对角方向及其两个正交方向（自然邻居）
    dirs.push([dx, dy], [dx, 0], [0, dy]);
  } else {
    // 直线移动：仅沿着原方向推进（4 邻接下不扩展旁侧方向）
    dirs.push([dx, dy]);
    if (allowDiagonal) {
      // 在 8 邻接下，为了捕捉强制邻居，可考虑旁侧对角
      if (dx !== 0) {
        dirs.push([dx, 1], [dx, -1]);
      } else if (dy !== 0) {
        dirs.push([1, dy], [-1, dy]);
      }
    }
  }
  return dirs.filter(([sx, sy]) => !(sx === 0 && sy === 0));
}

function hasForcedNeighbor(grid: Grid, x: number, y: number, dx: number, dy: number, allowDiagonal: boolean): boolean {
  // 检测在方向 (dx,dy) 推进时是否出现“强制邻居”（拐角阻挡导致必须在此停下）
  if (allowDiagonal && dx !== 0 && dy !== 0) {
    // 斜向：如果( x - dx, y + dy ) 被堵而 ( x, y + dy ) 可走，或 ( x + dx, y - dy ) 被堵而 ( x + dx, y ) 可走
    if (!isWalkable(grid, x - dx, y + dy) && isWalkable(grid, x, y + dy)) return true;
    if (!isWalkable(grid, x + dx, y - dy) && isWalkable(grid, x + dx, y)) return true;
  } else if (dx !== 0 || dy !== 0) {
    // 直向：检测横向（或纵向）两侧是否出现阻挡导致的强制邻居
    if (dx !== 0) {
      if (!isWalkable(grid, x, y + 1) && isWalkable(grid, x + dx, y + 1)) return true;
      if (!isWalkable(grid, x, y - 1) && isWalkable(grid, x + dx, y - 1)) return true;
    } else if (dy !== 0) {
      if (!isWalkable(grid, x + 1, y) && isWalkable(grid, x + 1, y + dy)) return true;
      if (!isWalkable(grid, x - 1, y) && isWalkable(grid, x - 1, y + dy)) return true;
    }
  }
  return false;
}

function jump(
  grid: Grid,
  x: number,
  y: number,
  dx: number,
  dy: number,
  goal: Point,
  allowDiagonal: boolean
): Point | null {
  const nx = x + dx;
  const ny = y + dy;
  if (!isWalkable(grid, nx, ny)) return null;

  if (nx === goal.x && ny === goal.y) return { x: nx, y: ny };

  // 停止条件：出现强制邻居
  if (hasForcedNeighbor(grid, nx, ny, dx, dy, allowDiagonal)) {
    return { x: nx, y: ny };
  }

  if (allowDiagonal && dx !== 0 && dy !== 0) {
    // 对角推进时，如果在任一正交分量方向上存在跳点，也需在此停下
    if (jump(grid, nx, ny, dx, 0, goal, allowDiagonal)) return { x: nx, y: ny };
    if (jump(grid, nx, ny, 0, dy, goal, allowDiagonal)) return { x: nx, y: ny };
  }

  // 否则继续往前推进
  return jump(grid, nx, ny, dx, dy, goal, allowDiagonal);
}

export function findPathJPS(
  grid: Grid,
  start: Point,
  goal: Point,
  options: AStarOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) return null;
  if (equals(start, goal)) return [start];

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
    return b.gCost - a.gCost; // tie-break
  });

  const startNode: NodeRecord = {
    position: start,
    gCost: 0,
    fCost: heuristic(start, goal, allowDiagonal),
  };
  open.push(startNode);
  gScore[start.y][start.x] = 0;

  // 记录父节点以回溯
  const parentMap: (Point | undefined)[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => undefined)
  );

  function expandPath(jumpPoints: Point[]): Point[] {
    if (jumpPoints.length === 0) return [];
    const expanded: Point[] = [jumpPoints[0]];
    for (let i = 1; i < jumpPoints.length; i++) {
      let cx = expanded[expanded.length - 1].x;
      let cy = expanded[expanded.length - 1].y;
      const tx = jumpPoints[i].x;
      const ty = jumpPoints[i].y;
      const sx = Math.sign(tx - cx);
      const sy = Math.sign(ty - cy);
      while (cx !== tx || cy !== ty) {
        if (cx !== tx) cx += sx;
        if (cy !== ty) cy += sy;
        expanded.push({ x: cx, y: cy });
      }
    }
    return expanded;
  }

  while (!open.isEmpty()) {
    const current = open.pop() as NodeRecord;
    const { x, y } = current.position;

    if (current.gCost !== gScore[y][x]) continue; // 过期条目
    if (x === goal.x && y === goal.y) {
      // 回溯跳点序列
      const jumpSeq: Point[] = [];
      let cx = x, cy = y;
      while (true) {
        jumpSeq.push({ x: cx, y: cy });
        const p = parentMap[cy][cx];
        if (!p) break;
        cx = p.x; cy = p.y;
      }
      const path = expandPath(jumpSeq.reverse());
      return path;
    }

    closed[y][x] = true;

    const parent = parentMap[y][x];
    const dirs = getDirectionsFromParent({ x, y }, parent, allowDiagonal);
    for (const [dx, dy] of dirs) {
      const jp = jump(grid, x, y, dx, dy, goal, allowDiagonal);
      if (!jp) continue;
      const jx = jp.x, jy = jp.y;
      if (closed[jy][jx]) continue;

      const stepCost = allowDiagonal ? Math.hypot(jx - x, jy - y) : Math.abs(jx - x) + Math.abs(jy - y);
      const tentativeG = current.gCost + stepCost;
      if (tentativeG < gScore[jy][jx]) {
        gScore[jy][jx] = tentativeG;
        parentMap[jy][jx] = { x, y };
        const f = tentativeG + heuristic({ x: jx, y: jy }, goal, allowDiagonal);
        open.push({ position: { x: jx, y: jy }, gCost: tentativeG, fCost: f, parent: undefined });
      }
    }
  }

  return null;
}
