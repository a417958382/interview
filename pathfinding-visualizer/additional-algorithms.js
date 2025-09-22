/**
 * 额外的路径查找算法实现
 * 包含 BFS、DFS、GBFS 和双向搜索算法
 */

// BFS (广度优先搜索) 算法
function* findPathBFS(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    const visited = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );
    const parent = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
    );

    const queue = [{ position: start, parent: null }];
    visited[start.y][start.x] = true;
    let visitedCount = 0;

    while (queue.length > 0) {
        const current = queue.shift();
        const { x, y } = current.position;

        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            // 重构路径
            const path = [];
            let node = current;
            while (node) {
                path.push(node.position);
                node = node.parent;
            }
            path.reverse();
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
        }

        const neighbors = getNeighbors(current.position, grid, allowDiagonal);
        for (const neighbor of neighbors) {
            if (!visited[neighbor.y][neighbor.x]) {
                visited[neighbor.y][neighbor.x] = true;
                parent[neighbor.y][neighbor.x] = current.position;
                queue.push({ position: neighbor, parent: current });
                yield { type: 'visited', position: neighbor };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}

// DFS (深度优先搜索) 算法
function* findPathDFS(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    const visited = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );

    const stack = [{ position: start, parent: null }];
    let visitedCount = 0;

    while (stack.length > 0) {
        const current = stack.pop();
        const { x, y } = current.position;

        if (visited[y][x]) continue;
        visited[y][x] = true;

        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            // 重构路径
            const path = [];
            let node = current;
            while (node) {
                path.push(node.position);
                node = node.parent;
            }
            path.reverse();
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
        }

        const neighbors = getNeighbors(current.position, grid, allowDiagonal);
        // DFS 通常反向添加邻居以保持探索顺序
        for (let i = neighbors.length - 1; i >= 0; i--) {
            const neighbor = neighbors[i];
            if (!visited[neighbor.y][neighbor.x]) {
                stack.push({ position: neighbor, parent: current });
                yield { type: 'visited', position: neighbor };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}

// GBFS (贪婪最佳优先搜索) 算法
function* findPathGBFS(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    const visited = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );

    const open = new PriorityQueue((a, b) => {
        const hA = heuristic(a.position, goal, allowDiagonal);
        const hB = heuristic(b.position, goal, allowDiagonal);
        return hA - hB;
    });

    open.push({ position: start, parent: null });
    let visitedCount = 0;

    while (!open.isEmpty()) {
        const current = open.pop();
        const { x, y } = current.position;

        if (visited[y][x]) continue;
        visited[y][x] = true;

        yield { 
            type: 'current', 
            position: { x, y },
            visitedCount: ++visitedCount
        };

        if (x === goal.x && y === goal.y) {
            // 重构路径
            const path = [];
            let node = current;
            while (node) {
                path.push(node.position);
                node = node.parent;
            }
            path.reverse();
            yield { type: 'path', path };
            yield { type: 'complete', path, visitedCount };
            return;
        }

        const neighbors = getNeighbors(current.position, grid, allowDiagonal);
        for (const neighbor of neighbors) {
            if (!visited[neighbor.y][neighbor.x]) {
                open.push({ position: neighbor, parent: current });
                yield { type: 'visited', position: neighbor };
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}

// 双向搜索算法
function* findPathBidirectional(grid, start, goal, allowDiagonal = false) {
    if (!isWalkable(grid, start.x, start.y) || !isWalkable(grid, goal.x, goal.y)) {
        yield { type: 'error', message: '起点或终点不可达' };
        return;
    }

    const height = grid.length;
    const width = grid[0]?.length ?? 0;
    
    // 从起点开始的搜索
    const visitedFromStart = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );
    const parentFromStart = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
    );
    
    // 从终点开始的搜索
    const visitedFromGoal = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => false)
    );
    const parentFromGoal = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
    );

    const queueFromStart = [{ position: start, parent: null }];
    const queueFromGoal = [{ position: goal, parent: null }];
    
    visitedFromStart[start.y][start.x] = true;
    visitedFromGoal[goal.y][goal.x] = true;
    
    let visitedCount = 0;
    let currentFromStart = null;
    let currentFromGoal = null;

    while (queueFromStart.length > 0 && queueFromGoal.length > 0) {
        // 从起点扩展
        if (queueFromStart.length > 0) {
            currentFromStart = queueFromStart.shift();
            const { x, y } = currentFromStart.position;

            yield { 
                type: 'current', 
                position: { x, y },
                visitedCount: ++visitedCount
            };

            // 检查是否与从终点的搜索相遇
            if (visitedFromGoal[y][x]) {
                // 找到交点，重构路径
                const path = [];
                let node = currentFromStart;
                while (node) {
                    path.push(node.position);
                    node = node.parent;
                }
                path.reverse();
                
                // 从交点向终点重构
                let goalNode = null;
                for (let gy = 0; gy < height; gy++) {
                    for (let gx = 0; gx < width; gx++) {
                        if (visitedFromGoal[gy][gx] && parentFromGoal[gy][gx] && 
                            parentFromGoal[gy][gx].x === x && parentFromGoal[gy][gx].y === y) {
                            goalNode = { position: { x: gx, y: gy }, parent: { position: { x, y } } };
                            break;
                        }
                    }
                    if (goalNode) break;
                }
                
                if (goalNode) {
                    const goalPath = [];
                    let node = goalNode;
                    while (node && node.position.x !== goal.x || node.position.y !== goal.y) {
                        goalPath.push(node.position);
                        node = node.parent;
                    }
                    if (node) goalPath.push(node.position);
                    path.push(...goalPath);
                }

                yield { type: 'path', path };
                yield { type: 'complete', path, visitedCount };
                return;
            }

            const neighbors = getNeighbors(currentFromStart.position, grid, allowDiagonal);
            for (const neighbor of neighbors) {
                if (!visitedFromStart[neighbor.y][neighbor.x]) {
                    visitedFromStart[neighbor.y][neighbor.x] = true;
                    parentFromStart[neighbor.y][neighbor.x] = currentFromStart.position;
                    queueFromStart.push({ position: neighbor, parent: currentFromStart });
                    yield { type: 'visited', position: neighbor };
                }
            }
        }

        // 从终点扩展
        if (queueFromGoal.length > 0) {
            currentFromGoal = queueFromGoal.shift();
            const { x, y } = currentFromGoal.position;

            yield { 
                type: 'current', 
                position: { x, y },
                visitedCount: ++visitedCount
            };

            // 检查是否与从起点的搜索相遇
            if (visitedFromStart[y][x]) {
                // 找到交点，重构路径
                const path = [];
                let node = currentFromGoal;
                while (node) {
                    path.push(node.position);
                    node = node.parent;
                }
                path.reverse();
                
                // 从交点向起点重构
                let startNode = null;
                for (let sy = 0; sy < height; sy++) {
                    for (let sx = 0; sx < width; sx++) {
                        if (visitedFromStart[sy][sx] && parentFromStart[sy][sx] && 
                            parentFromStart[sy][sx].x === x && parentFromStart[sy][sx].y === y) {
                            startNode = { position: { x: sx, y: sy }, parent: { position: { x, y } } };
                            break;
                        }
                    }
                    if (startNode) break;
                }
                
                if (startNode) {
                    const startPath = [];
                    let node = startNode;
                    while (node && node.position.x !== start.x || node.position.y !== start.y) {
                        startPath.push(node.position);
                        node = node.parent;
                    }
                    if (node) startPath.push(node.position);
                    path.unshift(...startPath);
                }

                yield { type: 'path', path };
                yield { type: 'complete', path, visitedCount };
                return;
            }

            const neighbors = getNeighbors(currentFromGoal.position, grid, allowDiagonal);
            for (const neighbor of neighbors) {
                if (!visitedFromGoal[neighbor.y][neighbor.x]) {
                    visitedFromGoal[neighbor.y][neighbor.x] = true;
                    parentFromGoal[neighbor.y][neighbor.x] = currentFromGoal.position;
                    queueFromGoal.push({ position: neighbor, parent: currentFromGoal });
                    yield { type: 'visited', position: neighbor };
                }
            }
        }
    }

    yield { type: 'error', message: '未找到路径' };
}
