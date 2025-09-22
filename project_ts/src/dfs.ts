/**
 * 深度优先搜索（DFS）算法：在网格上寻找路径
 * - 支持 4/8 邻接（allowDiagonal 控制）
 * - 使用栈进行深度优先探索
 * - 不保证最短路径，但内存占用少
 */

export type Point = { x: number; y: number };
export type Grid = number[][]; // 0 可走，1 障碍

export interface DFSOptions {
  allowDiagonal?: boolean;
  maxDepth?: number; // 最大搜索深度限制
}

interface NodeRecord {
  position: Point;
  parent?: NodeRecord;
  depth: number;
}

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
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
 * DFS 路径查找
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns 路径点数组，如果未找到路径则返回 null
 */
export function findPathDFS(
  grid: Grid,
  start: Point,
  goal: Point,
  options: DFSOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  const maxDepth = options.maxDepth ?? Infinity;
  
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  const stack = new Stack<NodeRecord>();
  stack.push({ position: start, depth: 0 });

  while (!stack.isEmpty()) {
    const current = stack.pop() as NodeRecord;
    const { x, y } = current.position;

    if (visited[y][x]) continue;
    visited[y][x] = true;

    if (x === goal.x && y === goal.y) {
      return reconstructPath(current);
    }

    // 如果达到最大深度，跳过
    if (current.depth >= maxDepth) continue;

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    // DFS 通常反向添加邻居以保持探索顺序
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited[neighbor.y][neighbor.x]) {
        stack.push({ 
          position: neighbor, 
          parent: current,
          depth: current.depth + 1
        });
      }
    }
  }

  return null;
}

/**
 * 递归版本的 DFS
 * @param grid 网格地图
 * @param start 起点
 * @param goal 终点
 * @param options 选项
 * @returns 路径点数组，如果未找到路径则返回 null
 */
export function findPathDFSRecursive(
  grid: Grid,
  start: Point,
  goal: Point,
  options: DFSOptions = {}
): Point[] | null {
  const allowDiagonal = options.allowDiagonal ?? false;
  const maxDepth = options.maxDepth ?? Infinity;
  
  if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
    return null;
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  function dfs(current: Point, depth: number): Point[] | null {
    if (depth > maxDepth) return null;
    if (visited[current.y][current.x]) return null;
    
    visited[current.y][current.x] = true;

    if (current.x === goal.x && current.y === goal.y) {
      return [current];
    }

    const neighbors = getNeighbors(current, grid, allowDiagonal);
    for (const neighbor of neighbors) {
      const result = dfs(neighbor, depth + 1);
      if (result) {
        return [current, ...result];
      }
    }

    return null;
  }

  return dfs(start, 0);
}

/**
 * DFS 全图搜索：找到所有可达点
 * @param grid 网格地图
 * @param start 起点
 * @param options 选项
 * @returns 所有可达点的坐标数组
 */
export function dfsAll(
  grid: Grid,
  start: Point,
  options: DFSOptions = {}
): Point[] {
  const allowDiagonal = options.allowDiagonal ?? false;
  const maxDepth = options.maxDepth ?? Infinity;
  
  if (!isWalkable(grid, start.x, start.y)) {
    return [];
  }

  const height = grid.length;
  const width = grid[0]?.length ?? 0;
  
  const visited: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );
  const reachable: Point[] = [];

  const stack = new Stack<{ position: Point; depth: number }>();
  stack.push({ position: start, depth: 0 });

  while (!stack.isEmpty()) {
    const current = stack.pop() as { position: Point; depth: number };
    const { x, y } = current.position;

    if (visited[y][x]) continue;
    visited[y][x] = true;
    reachable.push(current.position);

    if (current.depth >= maxDepth) continue;

    const neighbors = getNeighbors(current.position, grid, allowDiagonal);
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited[neighbor.y][neighbor.x]) {
        stack.push({ position: neighbor, depth: current.depth + 1 });
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
