/**
 * 路径查找算法实现
 * 包含 Dijkstra、A* 和 Jump Point Search (JPS) 算法
 */

class PriorityQueue {
    constructor(compare) {
        this.heap = [];
        this.compare = compare;
    }

    push(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }
        return top;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp(idx) {
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

    bubbleDown(idx) {
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

    swap(i, j) {
        const tmp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = tmp;
    }
}

// 工具函数
function isInside(grid, x, y) {
    return y >= 0 && y < grid.length && x >= 0 && x < (grid[0]?.length ?? 0);
}

function isWalkable(grid, x, y) {
    return isInside(grid, x, y) && grid[y][x] === 0;
}

function heuristic(a, b, allowDiagonal) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    if (allowDiagonal) {
        const D = 1;
        const D2 = Math.SQRT2;
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
    return dx + dy;
}

function stepCost(a, b) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return dx === 1 && dy === 1 ? Math.SQRT2 : 1;
}

function getNeighbors(p, grid, allowDiagonal) {
    const { x, y } = p;
    const candidates = [
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

function reconstructPath(endNode) {
    const path = [];
    let cur = endNode;
    while (cur) {
        path.push(cur.position);
        cur = cur.parent;
    }
    return path.reverse();
}

// Dijkstra 算法
function* findPathDijkstra(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;

    const gScore = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
    );
    const closed = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );

    const open = new PriorityQueue((a, b) => a.gCost - b.gCost);

    const startNode = { position: start, gCost: 0 };
    open.push(startNode);
    gScore[start.y][start.x] = 0;

    let visitedCount = 0;

    while (!open.isEmpty()) {
        const current = open.pop();
        const { x, y } = current.position;

        if (current.gCost !== gScore[y][x]) continue; // 过期条目
        
        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            const path = reconstructPath(current);
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
        }

        closed[y][x] = true;

        const neighbors = getNeighbors(current.position, grid, allowDiagonal);
        for (const nb of neighbors) {
            if (closed[nb.y][nb.x]) continue;
            const tentative = current.gCost + stepCost(current.position, nb);
            if (tentative < gScore[nb.y][nb.x]) {
                gScore[nb.y][nb.x] = tentative;
                open.push({ position: nb, gCost: tentative, parent: current });
                yield { type: 'visited', position: nb };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}

// A* 算法
function* findPathAStar(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;

    const gScore = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
    );
    const closed = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );

    const open = new PriorityQueue((a, b) => {
        if (a.fCost !== b.fCost) return a.fCost - b.fCost;
        return b.gCost - a.gCost; // tie-break
    });

    const startNode = {
        position: start,
        gCost: 0,
        fCost: heuristic(start, goal, allowDiagonal),
    };
    open.push(startNode);
    gScore[start.y][start.x] = 0;

    let visitedCount = 0;

    while (!open.isEmpty()) {
        const current = open.pop();
        const { x, y } = current.position;

        if (current.gCost !== gScore[y][x]) continue; // 过期条目
        
        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            const path = reconstructPath(current);
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
        }

        closed[y][x] = true;

        const neighbors = getNeighbors(current.position, grid, allowDiagonal);
        for (const neighbor of neighbors) {
            if (closed[neighbor.y][neighbor.x]) continue;

            const tentativeG = current.gCost + stepCost(current.position, neighbor);
            if (tentativeG < gScore[neighbor.y][neighbor.x]) {
                gScore[neighbor.y][neighbor.x] = tentativeG;
                const f = tentativeG + heuristic(neighbor, goal, allowDiagonal);
                const nextNode = {
                    position: neighbor,
                    gCost: tentativeG,
                    fCost: f,
                    parent: current,
                };
                open.push(nextNode);
                yield { type: 'visited', position: neighbor };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}

// JPS 算法辅助函数
function getDirectionsFromParent(curr, parent, allowDiagonal) {
    if (!parent) {
        const dirs = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
        ];
        if (allowDiagonal) dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
        return dirs;
    }
    const dx = Math.sign(curr.x - parent.x);
    const dy = Math.sign(curr.y - parent.y);

    const dirs = [];

    if (allowDiagonal && dx !== 0 && dy !== 0) {
        dirs.push([dx, dy], [dx, 0], [0, dy]);
    } else {
        dirs.push([dx, dy]);
        if (allowDiagonal) {
            if (dx !== 0) {
                dirs.push([dx, 1], [dx, -1]);
            } else if (dy !== 0) {
                dirs.push([1, dy], [-1, dy]);
            }
        }
    }
    return dirs.filter(([sx, sy]) => !(sx === 0 && sy === 0));
}

function hasForcedNeighbor(grid, x, y, dx, dy, allowDiagonal) {
    if (allowDiagonal && dx !== 0 && dy !== 0) {
        if (!isWalkable(grid, x - dx, y + dy) && isWalkable(grid, x, y + dy)) return true;
        if (!isWalkable(grid, x + dx, y - dy) && isWalkable(grid, x + dx, y)) return true;
    } else if (dx !== 0 || dy !== 0) {
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

function jump(grid, x, y, dx, dy, goal, allowDiagonal) {
    const nx = x + dx;
    const ny = y + dy;
    if (!isWalkable(grid, nx, ny)) return null;

    if (nx === goal.x && ny === goal.y) return { x: nx, y: ny };

    if (hasForcedNeighbor(grid, nx, ny, dx, dy, allowDiagonal)) {
        return { x: nx, y: ny };
    }

    if (allowDiagonal && dx !== 0 && dy !== 0) {
        if (jump(grid, nx, ny, dx, 0, goal, allowDiagonal)) return { x: nx, y: ny };
        if (jump(grid, nx, ny, 0, dy, goal, allowDiagonal)) return { x: nx, y: ny };
    }

    return jump(grid, nx, ny, dx, dy, goal, allowDiagonal);
}

function expandPath(jumpPoints) {
    if (jumpPoints.length === 0) return [];
    const expanded = [jumpPoints[0]];
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

// JPS 算法
function* findPathJPS(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }
    if (start.x === goal.x && start.y === goal.y) {
        yield { type: 'path', path: [start] };
        yield { type: 'complete', path: [start], visitedCount: 0 };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;

    const gScore = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => Number.POSITIVE_INFINITY)
    );
    const closed = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );

    const open = new PriorityQueue((a, b) => {
        if (a.fCost !== b.fCost) return a.fCost - b.fCost;
        return b.gCost - a.gCost; // tie-break
    });

    const startNode = {
        position: start,
        gCost: 0,
        fCost: heuristic(start, goal, allowDiagonal),
    };
    open.push(startNode);
    gScore[start.y][start.x] = 0;

    const parentMap = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => undefined)
    );

    let visitedCount = 0;

    while (!open.isEmpty()) {
        const current = open.pop();
        const { x, y } = current.position;

        if (current.gCost !== gScore[y][x]) continue; // 过期条目
        
        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            const jumpSeq = [];
            let cx = x, cy = y;
            while (true) {
                jumpSeq.push({ x: cx, y: cy });
                const p = parentMap[cy][cx];
                if (!p) break;
                cx = p.x; cy = p.y;
            }
            const path = expandPath(jumpSeq.reverse());
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
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
                yield { type: 'visited', position: { x: jx, y: jy } };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}
