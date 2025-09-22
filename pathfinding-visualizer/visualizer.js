/**
 * 路径查找算法可视化器
 */

class PathfindingVisualizer {
    constructor() {
        this.canvas = document.getElementById('gridCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 状态变量
        this.grid = [];
        this.gridSize = 30;
        this.cellSize = 15;
        this.start = { x: 5, y: 5 };
        this.goal = { x: 24, y: 24 };
        this.currentMode = 'wall';
        this.isRunning = false;
        this.isPaused = false;
        this.algorithmGenerator = null;
        this.animationSpeed = 10;
        this.allowDiagonal = true;
        
        // 可视化状态
        this.visited = new Set();
        this.path = [];
        this.currentNode = null;
        this.visitedCount = 0;
        this.startTime = 0;
        
        this.initializeGrid();
        this.setupEventListeners();
        this.draw();
    }

    initializeGrid() {
        this.grid = Array.from({ length: this.gridSize }, () => 
            Array.from({ length: this.gridSize }, () => 0)
        );
        
        // 添加一些随机障碍物
        this.addRandomWalls();
        
        this.updateCanvasSize();
    }

    addRandomWalls() {
        const wallCount = Math.floor(this.gridSize * this.gridSize * 0.2);
        for (let i = 0; i < wallCount; i++) {
            const x = Math.floor(Math.random() * this.gridSize);
            const y = Math.floor(Math.random() * this.gridSize);
            if ((x !== this.start.x || y !== this.start.y) && 
                (x !== this.goal.x || y !== this.goal.y)) {
                this.grid[y][x] = 1;
            }
        }
    }

    updateCanvasSize() {
        const size = this.gridSize * this.cellSize;
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
    }

    setupEventListeners() {
        // 算法选择
        document.getElementById('algorithmSelect').addEventListener('change', (e) => {
            if (!this.isRunning) {
                this.reset();
            }
        });

        // 速度控制
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            speedValue.textContent = this.animationSpeed;
        });

        // 网格大小
        document.getElementById('gridSize').addEventListener('change', (e) => {
            if (!this.isRunning) {
                this.gridSize = parseInt(e.target.value);
                this.cellSize = Math.max(10, Math.min(20, Math.floor(600 / this.gridSize)));
                this.start = { x: Math.floor(this.gridSize * 0.1), y: Math.floor(this.gridSize * 0.1) };
                this.goal = { x: Math.floor(this.gridSize * 0.8), y: Math.floor(this.gridSize * 0.8) };
                this.initializeGrid();
                this.draw();
            }
        });

        // 对角线移动
        document.getElementById('allowDiagonal').addEventListener('change', (e) => {
            this.allowDiagonal = e.target.checked;
        });

        // 控制按钮
        document.getElementById('startBtn').addEventListener('click', () => this.startAlgorithm());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseAlgorithm());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('clearWallsBtn').addEventListener('click', () => this.clearWalls());

        // 模式选择
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentMode = e.target.id.replace('Mode', '');
            });
        });

        // 画布交互
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    handleMouseDown(e) {
        if (this.isRunning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;
        
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
        
        this.handleCellClick(x, y, e.button === 2);
    }

    handleMouseMove(e) {
        if (!this.isDrawing || this.isRunning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / this.cellSize);
        const y = Math.floor((e.clientY - rect.top) / this.cellSize);
        
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;
        if (x === this.lastX && y === this.lastY) return;
        
        this.lastX = x;
        this.lastY = y;
        this.handleCellClick(x, y, e.button === 2);
    }

    handleMouseUp() {
        this.isDrawing = false;
    }

    handleCellClick(x, y, isRightClick) {
        if (this.currentMode === 'wall') {
            if (isRightClick) {
                this.grid[y][x] = 0;
            } else {
                this.grid[y][x] = 1;
            }
        } else if (this.currentMode === 'start') {
            this.start = { x, y };
        } else if (this.currentMode === 'end') {
            this.goal = { x, y };
        }
        
        this.draw();
    }

    startAlgorithm() {
        if (this.isRunning) return;
        
        const algorithm = document.getElementById('algorithmSelect').value;
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        
        // 重置可视化状态
        this.visited.clear();
        this.path = [];
        this.currentNode = null;
        this.visitedCount = 0;
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('algorithmStatus').textContent = '运行中';
        
        // 选择算法
        switch (algorithm) {
            case 'dijkstra':
                this.algorithmGenerator = findPathDijkstra(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'astar':
                this.algorithmGenerator = findPathAStar(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'jps':
                this.algorithmGenerator = findPathJPS(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'bfs':
                this.algorithmGenerator = findPathBFS(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'dfs':
                this.algorithmGenerator = findPathDFS(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'gbfs':
                this.algorithmGenerator = findPathGBFS(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
            case 'bidirectional':
                this.algorithmGenerator = findPathBidirectional(this.grid, this.start, this.goal, this.allowDiagonal);
                break;
        }
        
        this.runAlgorithm();
    }

    pauseAlgorithm() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '继续' : '暂停';
        document.getElementById('algorithmStatus').textContent = this.isPaused ? '已暂停' : '运行中';
        
        if (!this.isPaused) {
            this.runAlgorithm();
        }
    }

    async runAlgorithm() {
        while (this.isRunning && !this.isPaused && this.algorithmGenerator) {
            const result = this.algorithmGenerator.next();
            
            if (result.done) {
                this.finishAlgorithm();
                break;
            }
            
            this.handleAlgorithmStep(result.value);
            
            // 控制动画速度
            await new Promise(resolve => setTimeout(resolve, 1000 / this.animationSpeed));
        }
    }

    handleAlgorithmStep(step) {
        switch (step.type) {
            case 'current':
                this.currentNode = step.position;
                this.visitedCount = step.visitedCount;
                this.updateStats();
                break;
                
            case 'visited':
                this.visited.add(`${step.position.x},${step.position.y}`);
                break;
                
            case 'path':
                this.path = step.path;
                break;
                
            case 'complete':
                this.path = step.path;
                this.visitedCount = step.visitedCount;
                this.finishAlgorithm();
                return;
                
            case 'error':
                this.showError(step.message);
                this.finishAlgorithm();
                return;
        }
        
        this.draw();
    }

    finishAlgorithm() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentNode = null;
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        const executionTime = Date.now() - this.startTime;
        document.getElementById('executionTime').textContent = `${executionTime}ms`;
        document.getElementById('algorithmStatus').textContent = this.path.length > 0 ? '完成' : '失败';
        
        this.draw();
    }

    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.algorithmGenerator = null;
        
        // 重置可视化状态
        this.visited.clear();
        this.path = [];
        this.currentNode = null;
        this.visitedCount = 0;
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 重置统计
        this.updateStats();
        document.getElementById('executionTime').textContent = '-';
        document.getElementById('algorithmStatus').textContent = '就绪';
        
        this.draw();
    }

    clearWalls() {
        if (this.isRunning) return;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = 0;
            }
        }
        
        this.draw();
    }

    updateStats() {
        document.getElementById('visitedCount').textContent = this.visitedCount;
        document.getElementById('pathLength').textContent = this.path.length > 0 ? this.path.length : '-';
    }

    showError(message) {
        document.getElementById('algorithmStatus').textContent = `错误: ${message}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格背景
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        this.ctx.strokeStyle = '#e1e5e9';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * this.cellSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
        
        // 绘制已访问的节点
        this.ctx.fillStyle = '#2196F3';
        this.visited.forEach(pos => {
            const [x, y] = pos.split(',').map(Number);
            this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, 
                            this.cellSize - 2, this.cellSize - 2);
        });
        
        // 绘制路径
        if (this.path.length > 0) {
            this.ctx.fillStyle = '#ff9800';
            this.path.forEach(point => {
                this.ctx.fillRect(point.x * this.cellSize + 2, point.y * this.cellSize + 2, 
                                this.cellSize - 4, this.cellSize - 4);
            });
        }
        
        // 绘制障碍物
        this.ctx.fillStyle = '#333';
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x] === 1) {
                    this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, 
                                    this.cellSize - 2, this.cellSize - 2);
                }
            }
        }
        
        // 绘制当前节点
        if (this.currentNode) {
            this.ctx.fillStyle = '#9C27B0';
            this.ctx.fillRect(this.currentNode.x * this.cellSize + 3, this.currentNode.y * this.cellSize + 3, 
                            this.cellSize - 6, this.cellSize - 6);
        }
        
        // 绘制起点
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.start.x * this.cellSize + 2, this.start.y * this.cellSize + 2, 
                        this.cellSize - 4, this.cellSize - 4);
        
        // 绘制终点
        this.ctx.fillStyle = '#f44336';
        this.ctx.fillRect(this.goal.x * this.cellSize + 2, this.goal.y * this.cellSize + 2, 
                        this.cellSize - 4, this.cellSize - 4);
        
        // 添加起点和终点的标识
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${this.cellSize * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.fillText('S', 
            this.start.x * this.cellSize + this.cellSize / 2, 
            this.start.y * this.cellSize + this.cellSize / 2);
        
        this.ctx.fillText('E', 
            this.goal.x * this.cellSize + this.cellSize / 2, 
            this.goal.y * this.cellSize + this.cellSize / 2);
    }
}

// 初始化可视化器
document.addEventListener('DOMContentLoaded', () => {
    new PathfindingVisualizer();
});
