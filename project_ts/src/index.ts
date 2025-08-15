/**
 * 网格坐标点
 */
type Point = { x: number; y: number };

/**
 * 栅格地图
 * - 0 表示可走
 * - 1 表示障碍
 *
 * 约定：每一行长度一致，grid.length 为地图高度，grid[0].length 为宽度
 */
type Grid = number[][];

/**
 * A* 搜索的可选项
 */
interface AStarOptions {
  /**
   * 是否允许对角线移动（8 邻接）。
   * - false：仅 4 邻接（上下左右）
   * - true：8 邻接（含 4 个对角）
   */
  allowDiagonal?: boolean;
}

/**
 * A* 内部搜索节点的记录结构
 */
interface NodeRecord {
  /** 当前位置（网格坐标） */
  position: Point;
  /** 起点到该位置的实际代价 g(n) */
  gCost: number;
  /** 评价函数 f(n) = g(n) + h(n) */
  fCost: number;
  /** 回溯路径的父节点 */
  parent?: NodeRecord;
}

/**
 * 判断坐标是否在网格范围内
 * @param grid 栅格地图
 * @param point 待检查点
 * @returns 是否位于地图边界之内
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
 * 判断该点是否可走（边界内且非障碍）
 * @param grid 栅格地图
 * @param point 待检查点
 * @returns 是否可走
 */
function isWalkable(grid: Grid, point: Point): boolean {
  return isInside(grid, point) && grid[point.y][point.x] === 0;
}

/**
 * 启发函数 h(n)
 * - 4 邻接使用曼哈顿距离（|dx| + |dy|）
 * - 8 邻接使用 Octile 距离（考虑对角移动的 √2 代价）
 *
 * 注意：该实现的 h 不高估（admissible）且一致（consistent），
 * 因此 A* 能保证最优性且无需对 closed 节点回退。
 *
 * @param a 当前点
 * @param b 目标点
 * @param allowDiagonal 是否允许对角移动
 * @returns 预估代价 h(n)
 */
function heuristic(a: Point, b: Point, allowDiagonal: boolean): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  if (allowDiagonal) {
    // Octile 距离，适用于 8 邻接
    const D = 1;
    const D2 = Math.SQRT2; // ≈ 1.4142
    return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
  }
  // 曼哈顿距离，适用于 4 邻接
  return dx + dy;
}

/**
 * 获取某一点的相邻可走点集合
 * - 4 邻接：上下左右
 * - 8 邻接：额外包含四个对角方向
 *
 * 注意：当前未做"禁止贴角穿越"的判断（即未检查对角两侧的正交格是否阻挡）。
 * 如需严格避免拐角穿墙，可在加入对角邻居前补充两侧可走性判定。
 *
 * @param point 当前点
 * @param grid 栅格地图
 * @param allowDiagonal 是否允许对角移动
 * @returns 相邻可走点列表
 */
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

/**
 * 单步移动代价
 * - 直行：1
 * - 对角：√2
 *
 * @param a 起点
 * @param b 终点（应为相邻点）
 * @returns 从 a 走到 b 的代价
 */
function cost(a: Point, b: Point): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return dx === 1 && dy === 1 ? Math.SQRT2 : 1;
}

/**
 * 计算一条离散路径的总代价（与寻路代价模型一致）
 */
function pathCost(path: Point[] | null): number {
  if (!path || path.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += cost(path[i - 1], path[i]);
  }
  return total;
}

/**
 * 从终点节点回溯重建路径（包含起点与终点）
 * @param endNode 命中的终点节点
 * @returns 路径点序列（起点→终点）
 */
function reconstructPath(endNode: NodeRecord): Point[] {
  const path: Point[] = [];
  let current: NodeRecord | undefined = endNode;
  while (current) {
    path.push(current.position);
    current = current.parent;
  }
  return path.reverse();
}

/**
 * A* 寻路主函数
 *
 * 算法要点：
 * - open（待办清单）：按 f = g + h 选择最小者扩展
 * - closed（已办清单）：表示该格子的最优到达已确定
 * - gScore：记录起点到各格子的当前最优 g
 * - 通过 parent 指针回溯得到完整路径
 *
 * 正确性：
 * - 当启发函数可采纳且一致（本实现满足），A* 返回最短路径
 *
 * 复杂度（当前实现）：
 * - open 使用数组线性取最小，最坏近似 O(V^2)
 * - 可改为优先队列（如二叉堆）降为 O((V+E) log V)
 *
 * @param grid 栅格地图（0 可走、1 障碍）
 * @param start 起点
 * @param goal 终点
 * @param options 可选项：是否允许对角移动
 * @returns 最短路径（包含起终点）；无路返回 null
 */
export function findPath(
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

  // gScore[y][x]：起点到 (x,y) 的当前已知最优 g 值
  const gScore: number[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
  );
  // closed[y][x]：该格是否已"办结"
  const closed: boolean[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => false)
  );

  // open：待扩展的节点集合（此处用数组；大图建议替换为二叉堆）
  const open: NodeRecord[] = [];
  const startNode: NodeRecord = {
    position: start,
    gCost: 0,
    fCost: heuristic(start, goal, allowDiagonal),
  };
  open.push(startNode);
  gScore[start.y][start.x] = 0;

  while (open.length > 0) {
    // 取 fCost 最小的节点（简单线性扫描，适用于小图；大图可换为二叉堆）
    let bestIdx = 0;
    for (let i = 1; i < open.length; i++) {
      if (open[i].fCost < open[bestIdx].fCost) bestIdx = i;
    }
    const current = open.splice(bestIdx, 1)[0];
    const { position } = current;

    // 跳过过期条目（若 gCost 非当前最优说明该条目已被更优路径淘汰）
    if (current.gCost !== gScore[position.y][position.x]) {
      continue;
    }

    // 命中终点：重建路径
    if (position.x === goal.x && position.y === goal.y) {
      return reconstructPath(current);
    }

    // 标记为已办
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

  // open 为空仍未到达，说明无可达路径
  return null;
}

/**
 * 轻量断言工具（用于示例）
 * @param actual 实际值
 * @param expected 期望值
 * @param description 用例描述
 * @throws 当断言失败时抛出异常
 */
function assertEqual(actual: unknown, expected: unknown, description: string): void {
  if (actual !== expected) {
    throw new Error(`断言失败: ${description}. 实际: ${String(actual)}, 期望: ${String(expected)}`);
  }
  console.log(`✅ ${description}`);
}

/**
 * 控制台打印路径（* 为路径，# 为障碍，. 为空地）
 * @param grid 栅格地图
 * @param path 路径（可为 null）
 */
function prettyPrint(grid: Grid, path: Point[] | null): void {
  const set = new Set<string>(path?.map((p) => `${p.x},${p.y}`) ?? []);
  const rows = grid.map((row, y) =>
    row
      .map((cell, x) => {
        const key = `${x},${y}`;
        if (set.has(key)) return "*";
        return cell === 1 ? "#" : ".";
      })
      .join("")
  );
  console.log(rows.join("\n"));
}

/**
 * 示例用例：
 * - grid1：验证 4 邻接与 8 邻接的路径存在性与长度
 * - grid2：验证 4 邻接下无路可达
 */
function runExamples(): void {
  const grid1: Grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ];

  const start = { x: 0, y: 0 };
  const goal = { x: 4, y: 4 };

  const path4 = findPath(grid1, start, goal, { allowDiagonal: false });
  console.log("4 邻接路径:");
  prettyPrint(grid1, path4);
  if (!path4) throw new Error("应当存在 4 邻接路径");
  // 该地图 4 邻接最短路径长度应为 9（包含起点与终点）
  assertEqual(path4.length, 9, "grid1 4 邻接路径长度为 9");

  const path8 = findPath(grid1, start, goal, { allowDiagonal: true });
  console.log("\n8 邻接路径:");
  prettyPrint(grid1, path8);
  if (!path8) throw new Error("应当存在 8 邻接路径");
  // 允许对角线时，长度应更短；在此图上应为 7（包含起点与终点）
  assertEqual(path8.length, 7, "grid1 8 邻接路径长度为 7");

  const grid2: Grid = [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ];
  const noPath = findPath(grid2, { x: 0, y: 0 }, { x: 0, y: 2 }, { allowDiagonal: false });
  assertEqual(noPath === null, true, "grid2 4 邻接无可达路径");

  // 使用堆版本对比验证
  const { findPathHeap } = require("./astar_heap");
  const { findPathJPS } = require("./astar_jps");
  const { findPathDijkstra, dijkstraAll } = require("./dijkstra");
  const path4Heap = findPathHeap(grid1, start, goal, { allowDiagonal: false });
  const path8Heap = findPathHeap(grid1, start, goal, { allowDiagonal: true });
  assertEqual(!!path4Heap, true, "heap 4 邻接存在路径");
  assertEqual(!!path8Heap, true, "heap 8 邻接存在路径");
  assertEqual(path4Heap!.length, path4.length, "heap 与数组 4 邻接路径长度一致");
  assertEqual(path8Heap!.length, path8.length, "heap 与数组 8 邻接路径长度一致");

  // JPS 版本基本一致性校验（在同图上）
  const path8Jps = findPathJPS(grid1, start, goal, { allowDiagonal: true });
  assertEqual(!!path8Jps, true, "JPS 8 邻接存在路径");
  assertEqual(path8Jps!.length, path8.length, "JPS 与数组 8 邻接路径长度一致");

  // Dijkstra 一致性：h≡0 的 A* 特例
  const path4Dij = findPathDijkstra(grid1, start, goal, { allowDiagonal: false });
  const path8Dij = findPathDijkstra(grid1, start, goal, { allowDiagonal: true });
  assertEqual(!!path4Dij, true, "Dijkstra 4 邻接存在路径");
  assertEqual(!!path8Dij, true, "Dijkstra 8 邻接存在路径");
  assertEqual(path4Dij!.length, path4.length, "Dijkstra 与数组 4 邻接路径长度一致");
  assertEqual(path8Dij!.length, path8.length, "Dijkstra 与数组 8 邻接路径长度一致");

  // Dijkstra 全图：从 start 出发的 dist 表应满足 dist[start]=0 且终点距离与最短路一致
  const all = dijkstraAll(grid1, start, { allowDiagonal: true });
  assertEqual(all.dist[start.y][start.x], 0, "dijkstraAll 起点距离为 0");
  const aStarCost = pathCost(path8);
  const dijCost = all.dist[goal.y][goal.x];
  const close = Math.abs(aStarCost - dijCost) < 1e-6;
  assertEqual(close, true, "dijkstraAll 终点距离与 A* 代价一致（容差内）");
}

/**
 * 生成大图用于基准测试：按给定阻挡比例随机放置障碍，并定期留出通道
 */
function generateGrid(width: number, height: number, blockRatio: number, corridorStep = 10): Grid {
  // 简单可复现的 LCG 伪随机
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed & 0xffff) / 0x10000;
  };

  const grid: Grid = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => {
      if (x % corridorStep === 0 || y % corridorStep === 0) return 0; // 周期性通道，保证可达性
      return rand() < blockRatio ? 1 : 0;
    })
  );
  grid[0][0] = 0;
  grid[height - 1][width - 1] = 0;
  return grid;
}

function time<T>(fn: () => T): { result: T; ms: number } {
  const t0 = Date.now();
  const result = fn();
  const ms = Date.now() - t0;
  return { result, ms };
}

/**
 * 在大图上对比数组版与堆版的性能
 */
function runBenchmark(): void {
  const { findPathHeap } = require("./astar_heap");
  const { findPathJPS } = require("./astar_jps");
  const size = 1024; // 约 102K cells，较快体现差异
  const block = 0.05;
  const corridorStep = 12;
  const grid = generateGrid(size, size, block, corridorStep);
  const start = { x: 0, y: 0 };
  const goal = { x: size - 1, y: size - 1 };

  console.log(`\n[Benchmark] ${size}x${size}, block=${block}, allowDiagonal=false`);
  const a1 = time(() => findPath(grid, start, goal, { allowDiagonal: false }));
  const h1 = time(() => findPathHeap(grid, start, goal, { allowDiagonal: false }));
  const j1 = time(() => findPathJPS(grid, start, goal, { allowDiagonal: false }));
  assertEqual((a1.result as Point[] | null) !== null, true, "数组版 4 邻接存在路径");
  assertEqual((h1.result as Point[] | null) !== null, true, "堆版 4 邻接存在路径");
  if (a1.result && h1.result) {
    assertEqual((a1.result as Point[]).length, (h1.result as Point[]).length, "两版路径长度一致 (4 邻接)");
  }
  if (a1.result && j1.result) {
    assertEqual((a1.result as Point[]).length, (j1.result as Point[]).length, "JPS 路径长度一致 (4 邻接)");
  }
  console.log(`数组版 A*（4 邻接）: ${a1.ms} ms`);
  console.log(`堆版  A*（4 邻接）: ${h1.ms} ms`);
  console.log(`JPS    （4 邻接）: ${j1.ms} ms`);

  console.log(`\n[Benchmark] ${size}x${size}, block=${block}, allowDiagonal=true`);
  const a2 = time(() => findPath(grid, start, goal, { allowDiagonal: true }));
  const h2 = time(() => findPathHeap(grid, start, goal, { allowDiagonal: true }));
  const j2 = time(() => findPathJPS(grid, start, goal, { allowDiagonal: true }));
  assertEqual((a2.result as Point[] | null) !== null, true, "数组版 8 邻接存在路径");
  assertEqual((h2.result as Point[] | null) !== null, true, "堆版 8 邻接存在路径");
  if (a2.result && h2.result) {
    assertEqual((a2.result as Point[]).length, (h2.result as Point[]).length, "两版路径长度一致 (8 邻接)");
  }
  if (a2.result && j2.result) {
    assertEqual((a2.result as Point[]).length, (j2.result as Point[]).length, "JPS 路径长度一致 (8 邻接)");
  }
  console.log(`数组版 A*（8 邻接）: ${a2.ms} ms`);
  console.log(`堆版  A*（8 邻接）: ${h2.ms} ms`);
  console.log(`JPS    （8 邻接）: ${j2.ms} ms`);
}

/**
 * 程序入口：运行内置示例
 */
function main(): void {
  try {
    console.log('开始运行算法演示...\n');
    const { runGameMapDFSTests } = require("./test-game-map-dfs");
    runGameMapDFSTests();

    // 先运行KMP算法演示
    // console.log('=== KMP 字符串匹配算法演示 ===');
    // const { demonstrateKMP } = require("./kmp");
    // demonstrateKMP();
    
    // console.log('\n' + '='.repeat(50) + '\n');
    
    // // 然后运行其他算法
    // console.log('=== A* 路径规划算法演示 ===');
    // runExamples();
    // runBenchmark();
    
  } catch (error) {
    console.error('程序执行出错:', error);
  }
}

main();