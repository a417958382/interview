/**
 * 游戏地图DFS实现 - 模拟角色在2D地图中的探索
 * 常见于游戏公司面试题
 */

// 地图单元格类型
enum CellType {
    EMPTY = 0,      // 空地，可通行
    WALL = 1,       // 墙壁，不可通行
    TREASURE = 2,   // 宝藏
    ENEMY = 3,      // 敌人
    VISITED = 4     // 已访问标记
}

// 坐标点
interface Point {
    x: number;
    y: number;
}

// 游戏地图类
class GameMap {
    private map: CellType[][];
    private rows: number;
    private cols: number;
    private visited: boolean[][] = [];
    
    // 四个方向：上、右、下、左
    private directions: Point[] = [
        { x: -1, y: 0 },  // 上
        { x: 0, y: 1 },   // 右
        { x: 1, y: 0 },   // 下
        { x: 0, y: -1 }   // 左
    ];

    constructor(mapData: number[][]) {
        this.map = mapData as CellType[][];
        this.rows = mapData.length;
        this.cols = mapData[0].length;
        this.resetVisited();
    }

    // 重置访问状态
    private resetVisited(): void {
        this.visited = Array(this.rows).fill(null).map(() => Array(this.cols).fill(false));
    }

    // 检查坐标是否有效且可通行
    private isValidAndPassable(x: number, y: number): boolean {
        return x >= 0 && x < this.rows && 
               y >= 0 && y < this.cols && 
               this.map[x][y] !== CellType.WALL && 
               !this.visited[x][y];
    }

    // 打印地图状态
    private printMap(title: string, currentPos?: Point): void {
        console.log(`\n=== ${title} ===`);
        for (let i = 0; i < this.rows; i++) {
            let row = '';
            for (let j = 0; j < this.cols; j++) {
                if (currentPos && currentPos.x === i && currentPos.y === j) {
                    row += '[P]'; // 玩家当前位置
                } else if (this.visited[i][j]) {
                    row += ' ✓ '; // 已访问
                } else {
                    switch (this.map[i][j]) {
                        case CellType.EMPTY: row += ' . '; break;
                        case CellType.WALL: row += ' # '; break;
                        case CellType.TREASURE: row += ' $ '; break;
                        case CellType.ENEMY: row += ' E '; break;
                    }
                }
            }
            console.log(row);
        }
    }

    /**
     * DFS递归实现 - 探索整个可达区域
     * 常用于：区域探索、连通性检测
     */
    exploreAreaDFS(startX: number, startY: number): {
        visitedCells: Point[],
        treasuresFound: Point[],
        enemiesEncountered: Point[]
    } {
        console.log(`\n🎮 开始DFS探索，起始位置: (${startX}, ${startY})`);
        
        this.resetVisited();
        const visitedCells: Point[] = [];
        const treasuresFound: Point[] = [];
        const enemiesEncountered: Point[] = [];

        const dfsRecursive = (x: number, y: number): void => {
            // 标记当前位置为已访问
            this.visited[x][y] = true;
            visitedCells.push({ x, y });
            
            console.log(`📍 访问位置: (${x}, ${y})`);
            this.printMap(`探索进度 - 当前位置: (${x}, ${y})`, { x, y });

            // 检查当前位置的内容
            switch (this.map[x][y]) {
                case CellType.TREASURE:
                    treasuresFound.push({ x, y });
                    console.log(`💰 发现宝藏！位置: (${x}, ${y})`);
                    break;
                case CellType.ENEMY:
                    enemiesEncountered.push({ x, y });
                    console.log(`⚔️ 遭遇敌人！位置: (${x}, ${y})`);
                    break;
            }

            // 探索四个方向
            for (const dir of this.directions) {
                const newX = x + dir.x;
                const newY = y + dir.y;
                
                if (this.isValidAndPassable(newX, newY)) {
                    console.log(`🔍 从 (${x}, ${y}) 深入探索 (${newX}, ${newY})`);
                    dfsRecursive(newX, newY);
                    console.log(`🔙 从 (${newX}, ${newY}) 回溯到 (${x}, ${y})`);
                }
            }
        };

        if (this.isValidAndPassable(startX, startY)) {
            dfsRecursive(startX, startY);
        }

        return { visitedCells, treasuresFound, enemiesEncountered };
    }

    /**
     * DFS路径查找 - 寻找从起点到终点的路径
     * 常用于：寻路算法、任务导航
     */
    findPathDFS(startX: number, startY: number, targetX: number, targetY: number): Point[] | null {
        console.log(`\n🎯 DFS寻路：从 (${startX}, ${startY}) 到 (${targetX}, ${targetY})`);
        
        this.resetVisited();
        const path: Point[] = [];

        const dfsPathFind = (x: number, y: number): boolean => {
            // 添加当前位置到路径
            path.push({ x, y });
            this.visited[x][y] = true;
            
            console.log(`🚶 当前路径长度: ${path.length}, 位置: (${x}, ${y})`);

            // 检查是否到达目标
            if (x === targetX && y === targetY) {
                console.log(`🎉 找到目标！路径长度: ${path.length}`);
                return true;
            }

            // 尝试四个方向
            for (const dir of this.directions) {
                const newX = x + dir.x;
                const newY = y + dir.y;
                
                if (this.isValidAndPassable(newX, newY)) {
                    if (dfsPathFind(newX, newY)) {
                        return true; // 找到路径，直接返回
                    }
                }
            }

            // 回溯：从路径中移除当前位置
            path.pop();
            console.log(`⬅️ 回溯，移除位置: (${x}, ${y})`);
            return false;
        };

        if (this.isValidAndPassable(startX, startY)) {
            const found = dfsPathFind(startX, startY);
            return found ? path : null;
        }

        return null;
    }

    /**
     * DFS连通分量检测 - 找到所有连通的区域
     * 常用于：地图分析、区域划分
     */
    findConnectedComponents(): Point[][] {
        console.log(`\n🗺️ DFS连通分量分析`);
        
        this.resetVisited();
        const components: Point[][] = [];

        const dfsComponent = (x: number, y: number, component: Point[]): void => {
            this.visited[x][y] = true;
            component.push({ x, y });

            // 探索相邻的可通行区域
            for (const dir of this.directions) {
                const newX = x + dir.x;
                const newY = y + dir.y;
                
                if (this.isValidAndPassable(newX, newY)) {
                    dfsComponent(newX, newY, component);
                }
            }
        };

        // 遍历整个地图，寻找未访问的连通分量
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.isValidAndPassable(i, j)) {
                    const component: Point[] = [];
                    dfsComponent(i, j, component);
                    if (component.length > 0) {
                        components.push(component);
                        console.log(`🏝️ 发现连通区域 ${components.length}，大小: ${component.length}`);
                    }
                }
            }
        }

        return components;
    }

    /**
     * DFS迭代实现 - 使用显式栈
     * 常用于：避免递归栈溢出的场景
     */
    exploreAreaIterativeDFS(startX: number, startY: number): Point[] {
        console.log(`\n🔄 迭代DFS探索，起始位置: (${startX}, ${startY})`);
        
        this.resetVisited();
        const visitedCells: Point[] = [];
        const stack: Point[] = [{ x: startX, y: startY }];

        while (stack.length > 0) {
            const current = stack.pop()!;
            const { x, y } = current;

            // 跳过已访问或不可通行的位置
            if (!this.isValidAndPassable(x, y)) {
                continue;
            }

            // 访问当前位置
            this.visited[x][y] = true;
            visitedCells.push(current);
            console.log(`📍 迭代访问: (${x}, ${y}), 栈大小: ${stack.length}`);

            // 将相邻位置加入栈（注意：后进先出的特性）
            for (const dir of this.directions) {
                const newX = x + dir.x;
                const newY = y + dir.y;
                
                if (this.isValidAndPassable(newX, newY)) {
                    stack.push({ x: newX, y: newY });
                }
            }
        }

        return visitedCells;
    }
}

// 导出类和接口
export { GameMap, CellType, Point };