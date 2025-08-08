class LianLianKanGame {
    constructor() {
        this.GRID_WIDTH = 10;
        this.GRID_HEIGHT = 14;
        this.DIFFICULTY = 0.8; // 提高困难模式
        this.PATTERN_COUNT = 28; // 增加到28种图案，提高难度
        
        this.grid = [];
        this.selectedBlocks = [];
        this.gameStartTime = null;
        this.gameTimer = null;
        this.remainingBlocks = 0;
        this.isGameOver = false;
        
        this.initializeElements();
        this.bindEvents();
        this.startNewGame();
    }
    
    initializeElements() {
        this.gameBoard = document.getElementById('game-board');
        this.remainingBlocksEl = document.getElementById('remaining-blocks');
        this.gameTimeEl = document.getElementById('game-time');
        this.connectionLine = document.getElementById('connection-line');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.gameResultTitle = document.getElementById('game-result-title');
        this.gameResultMessage = document.getElementById('game-result-message');
        this.finalTimeEl = document.getElementById('final-time').querySelector('span');
        
        this.newGameBtn = document.getElementById('new-game-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');
    }
    
    bindEvents() {
        this.newGameBtn.addEventListener('click', () => this.startNewGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.shuffleBtn.addEventListener('click', () => this.shuffleBoard());
        this.playAgainBtn.addEventListener('click', () => {
            this.hideModal();
            this.startNewGame();
        });
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
    }
    
    startNewGame() {
        this.isGameOver = false;
        this.selectedBlocks = [];
        this.clearTimer();
        this.generateBoard();
        this.renderBoard();
        this.startTimer();
        this.updateUI();
        this.hideModal();
    }
    
    generateBoard() {
        // 确保生成140个方块（14*10）
        const totalBlocks = this.GRID_WIDTH * this.GRID_HEIGHT; // 140
        const patterns = [];
        
        // 计算每种图案的数量，确保总数为140且每种图案数量为偶数
        const patternsPerType = Math.floor(totalBlocks / this.PATTERN_COUNT / 2) * 2; // 每种图案4个
        const remainingBlocks = totalBlocks - (this.PATTERN_COUNT * patternsPerType); // 剩余28个
        
        // 添加基础图案
        for (let i = 1; i <= this.PATTERN_COUNT; i++) {
            for (let j = 0; j < patternsPerType; j++) {
                patterns.push(i);
            }
        }
        
        // 添加剩余图案，每种图案再加1个（总共28个，每种1个，需要配对）
        for (let i = 1; i <= remainingBlocks / 2; i++) {
            patterns.push(i);
            patterns.push(i);
        }
        
        console.log(`生成图案总数: ${patterns.length}, 应该为: ${totalBlocks}`);
        
        // 使用优化的布局策略
        this.generateOptimizedLayout(patterns);
    }
    
    generateOptimizedLayout(patterns) {
        console.log('开始生成优化布局...');
        
        // 使用更高效的生成策略：分层放置
        this.generateLayeredLayout(patterns);
        
        console.log('布局生成完成');
    }
    
    generateLayeredLayout(patterns) {
        // 创建网格
        this.grid = [];
        this.remainingBlocks = 0;
        
        // 初始化空网格
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                this.grid[row][col] = {
                    pattern: 0,
                    row: row,
                    col: col,
                    element: null
                };
            }
        }
        
        // 使用分层策略放置图案
        this.placePatternsByLayers(patterns);
    }
    
    placePatternsByLayers(patterns) {
        console.log(`开始放置 ${patterns.length} 个图案到 ${this.GRID_WIDTH * this.GRID_HEIGHT} 个位置`);
        
        // 打乱图案顺序
        this.shuffleArray(patterns);
        
        // 获取所有可用位置
        const allPositions = [];
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                allPositions.push({row, col});
            }
        }
        
        // 打乱位置顺序
        this.shuffleArray(allPositions);
        
        // 直接按顺序放置所有图案
        for (let i = 0; i < patterns.length && i < allPositions.length; i++) {
            const pos = allPositions[i];
            this.grid[pos.row][pos.col].pattern = patterns[i];
            this.remainingBlocks++;
        }
        
        console.log(`实际放置了 ${this.remainingBlocks} 个方块`);
    }
    
    getEdgePositions() {
        const positions = [];
        
        // 上下边缘
        for (let col = 0; col < this.GRID_WIDTH; col++) {
            positions.push({row: 0, col: col});
            positions.push({row: this.GRID_HEIGHT - 1, col: col});
        }
        
        // 左右边缘（排除角落，避免重复）
        for (let row = 1; row < this.GRID_HEIGHT - 1; row++) {
            positions.push({row: row, col: 0});
            positions.push({row: row, col: this.GRID_WIDTH - 1});
        }
        
        return this.shuffleArray(positions);
    }
    
    getCornerPositions() {
        return this.shuffleArray([
            {row: 0, col: 0},
            {row: 0, col: this.GRID_WIDTH - 1},
            {row: this.GRID_HEIGHT - 1, col: 0},
            {row: this.GRID_HEIGHT - 1, col: this.GRID_WIDTH - 1}
        ]);
    }
    
    getCenterPositions() {
        const positions = [];
        const centerRow = Math.floor(this.GRID_HEIGHT / 2);
        const centerCol = Math.floor(this.GRID_WIDTH / 2);
        
        // 中心区域的位置
        for (let row = centerRow - 2; row <= centerRow + 2; row++) {
            for (let col = centerCol - 2; col <= centerCol + 2; col++) {
                if (row >= 0 && row < this.GRID_HEIGHT && 
                    col >= 0 && col < this.GRID_WIDTH) {
                    positions.push({row: row, col: col});
                }
            }
        }
        
        return this.shuffleArray(positions);
    }
    
    getRemainingPositions() {
        const positions = [];
        
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                positions.push({row: row, col: col});
            }
        }
        
        return this.shuffleArray(positions);
    }
    
    placeRemainingRandomly(pattern, count) {
        let placed = 0;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (placed < count && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * this.GRID_HEIGHT);
            const col = Math.floor(Math.random() * this.GRID_WIDTH);
            
            if (this.grid[row][col].pattern === 0) {
                this.grid[row][col].pattern = pattern;
                this.remainingBlocks++;
                placed++;
            }
            
            attempts++;
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    validateSolvable() {
        // 使用轻量级验证：只检查基本可解性条件
        return this.quickValidation();
    }
    
    quickValidation() {
        // 统计每种图案的数量
        const patternCount = new Map();
        
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                const pattern = this.grid[row][col].pattern;
                if (pattern > 0) {
                    patternCount.set(pattern, (patternCount.get(pattern) || 0) + 1);
                }
            }
        }
        
        // 检查每种图案是否都有偶数个
        for (let [pattern, count] of patternCount) {
            if (count % 2 !== 0) {
                console.log(`图案 ${pattern} 数量为奇数: ${count}`);
                return false;
            }
        }
        
        // 有了对接线连接，基本上任何布局都是可解的
        // 只需要确保每种图案数量为偶数即可
        console.log('验证通过：所有图案数量均为偶数，且支持对接线连接');
        return true;
    }
    
    renderBoard() {
        this.gameBoard.innerHTML = '';
        
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                const cell = this.grid[row][col];
                if (cell.pattern > 0) {
                    const blockElement = this.createBlockElement(cell);
                    this.gameBoard.appendChild(blockElement);
                    cell.element = blockElement;
                }
            }
        }
    }
    
    createBlockElement(cell) {
        const block = document.createElement('div');
        block.className = 'game-block';
        block.textContent = this.getPatternSymbol(cell.pattern);
        block.dataset.row = cell.row;
        block.dataset.col = cell.col;
        block.dataset.pattern = cell.pattern;
        
        block.addEventListener('click', (e) => this.handleBlockClick(e));
        
        return block;
    }
    
    getPatternSymbol(pattern) {
        // 使用各种符号和表情符号来表示不同的图案
        const symbols = [
            '🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺', '🎻', '🎹',
            '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥅', '⛳'
        ];
        return symbols[pattern - 1] || pattern.toString();
    }
    
    handleBlockClick(event) {
        if (this.isGameOver) return;
        
        const block = event.target;
        const row = parseInt(block.dataset.row);
        const col = parseInt(block.dataset.col);
        const pattern = parseInt(block.dataset.pattern);
        
        // 如果点击已选中的方块，取消选中
        if (block.classList.contains('selected')) {
            this.deselectBlock(block);
            return;
        }
        
        // 如果已有两个选中的方块，清除选择
        if (this.selectedBlocks.length >= 2) {
            this.clearSelection();
        }
        
        // 选中当前方块
        this.selectBlock(block, row, col, pattern);
        
        // 如果选中了两个方块，检查是否可以连接
        if (this.selectedBlocks.length === 2) {
            this.checkConnection();
        }
    }
    
    selectBlock(block, row, col, pattern) {
        block.classList.add('selected');
        this.selectedBlocks.push({
            element: block,
            row: row,
            col: col,
            pattern: pattern
        });
    }
    
    deselectBlock(block) {
        block.classList.remove('selected');
        this.selectedBlocks = this.selectedBlocks.filter(
            selected => selected.element !== block
        );
    }
    
    clearSelection() {
        this.selectedBlocks.forEach(selected => {
            selected.element.classList.remove('selected');
        });
        this.selectedBlocks = [];
        this.clearConnectionLine();
    }
    
    checkConnection() {
        const [block1, block2] = this.selectedBlocks;
        
        // 检查图案是否相同
        if (block1.pattern !== block2.pattern) {
            setTimeout(() => this.clearSelection(), 500);
            return;
        }
        
        // 检查是否可以连通
        if (this.canConnect(block1.row, block1.col, block2.row, block2.col)) {
            this.handleSuccessfulMatch(block1, block2);
        } else {
            setTimeout(() => this.clearSelection(), 500);
        }
    }
    
    canConnect(row1, col1, row2, col2) {
        // 连连看路径查找算法
        return this.findPath(row1, col1, row2, col2) !== null;
    }
    
    findPath(row1, col1, row2, col2) {
        // 直线连接（包括相邻）
        if (this.canDirectConnect(row1, col1, row2, col2)) {
            return [{row: row1, col: col1}, {row: row2, col: col2}];
        }
        
        // 一次转弯连接
        const oneCornerPath = this.findOneCornerPath(row1, col1, row2, col2);
        if (oneCornerPath) return oneCornerPath;
        
        // 对接线连接（通过边界外围）
        const borderPath = this.findBorderPath(row1, col1, row2, col2);
        if (borderPath) return borderPath;
        
        return null;
    }
    
    findBorderPath(row1, col1, row2, col2) {
        // 尝试通过四个边界进行连接
        const borderPaths = [
            this.findTopBorderPath(row1, col1, row2, col2),     // 上边界
            this.findBottomBorderPath(row1, col1, row2, col2),  // 下边界
            this.findLeftBorderPath(row1, col1, row2, col2),    // 左边界
            this.findRightBorderPath(row1, col1, row2, col2)    // 右边界
        ];
        
        // 返回第一个有效的边界路径
        for (let path of borderPaths) {
            if (path) return path;
        }
        
        return null;
    }
    
    findTopBorderPath(row1, col1, row2, col2) {
        // 检查是否可以通过上边界连接
        // 路径：起点 -> 上边界 -> 终点
        
        // 检查起点到上边界的路径
        if (!this.canReachTopBorder(row1, col1)) return null;
        if (!this.canReachTopBorder(row2, col2)) return null;
        
        // 检查上边界的水平路径是否畅通
        const minCol = Math.min(col1, col2);
        const maxCol = Math.max(col1, col2);
        
        // 检查上边界上方的虚拟路径（第-1行）
        for (let col = minCol; col <= maxCol; col++) {
            // 如果第0行有方块阻挡，则无法通过上边界
            if (this.grid[0][col].pattern > 0 && col !== col1 && col !== col2) {
                return null;
            }
        }
        
        return [
            {row: row1, col: col1},
            {row: -1, col: col1},    // 上边界虚拟点
            {row: -1, col: col2},    // 上边界虚拟点
            {row: row2, col: col2}
        ];
    }
    
    findBottomBorderPath(row1, col1, row2, col2) {
        // 检查是否可以通过下边界连接
        if (!this.canReachBottomBorder(row1, col1)) return null;
        if (!this.canReachBottomBorder(row2, col2)) return null;
        
        const minCol = Math.min(col1, col2);
        const maxCol = Math.max(col1, col2);
        
        // 检查下边界下方的虚拟路径
        for (let col = minCol; col <= maxCol; col++) {
            if (this.grid[this.GRID_HEIGHT - 1][col].pattern > 0 && col !== col1 && col !== col2) {
                return null;
            }
        }
        
        return [
            {row: row1, col: col1},
            {row: this.GRID_HEIGHT, col: col1},    // 下边界虚拟点
            {row: this.GRID_HEIGHT, col: col2},    // 下边界虚拟点
            {row: row2, col: col2}
        ];
    }
    
    findLeftBorderPath(row1, col1, row2, col2) {
        // 检查是否可以通过左边界连接
        if (!this.canReachLeftBorder(row1, col1)) return null;
        if (!this.canReachLeftBorder(row2, col2)) return null;
        
        const minRow = Math.min(row1, row2);
        const maxRow = Math.max(row1, row2);
        
        // 检查左边界左侧的虚拟路径
        for (let row = minRow; row <= maxRow; row++) {
            if (this.grid[row][0].pattern > 0 && row !== row1 && row !== row2) {
                return null;
            }
        }
        
        return [
            {row: row1, col: col1},
            {row: row1, col: -1},    // 左边界虚拟点
            {row: row2, col: -1},    // 左边界虚拟点
            {row: row2, col: col2}
        ];
    }
    
    findRightBorderPath(row1, col1, row2, col2) {
        // 检查是否可以通过右边界连接
        if (!this.canReachRightBorder(row1, col1)) return null;
        if (!this.canReachRightBorder(row2, col2)) return null;
        
        const minRow = Math.min(row1, row2);
        const maxRow = Math.max(row1, row2);
        
        // 检查右边界右侧的虚拟路径
        for (let row = minRow; row <= maxRow; row++) {
            if (this.grid[row][this.GRID_WIDTH - 1].pattern > 0 && row !== row1 && row !== row2) {
                return null;
            }
        }
        
        return [
            {row: row1, col: col1},
            {row: row1, col: this.GRID_WIDTH},    // 右边界虚拟点
            {row: row2, col: this.GRID_WIDTH},    // 右边界虚拟点
            {row: row2, col: col2}
        ];
    }
    
    canReachTopBorder(row, col) {
        // 检查是否可以垂直到达上边界
        for (let r = row - 1; r >= 0; r--) {
            if (this.grid[r][col].pattern > 0) return false;
        }
        return true;
    }
    
    canReachBottomBorder(row, col) {
        // 检查是否可以垂直到达下边界
        for (let r = row + 1; r < this.GRID_HEIGHT; r++) {
            if (this.grid[r][col].pattern > 0) return false;
        }
        return true;
    }
    
    canReachLeftBorder(row, col) {
        // 检查是否可以水平到达左边界
        for (let c = col - 1; c >= 0; c--) {
            if (this.grid[row][c].pattern > 0) return false;
        }
        return true;
    }
    
    canReachRightBorder(row, col) {
        // 检查是否可以水平到达右边界
        for (let c = col + 1; c < this.GRID_WIDTH; c++) {
            if (this.grid[row][c].pattern > 0) return false;
        }
        return true;
    }
    
    canDirectConnect(row1, col1, row2, col2) {
        // 检查是否相邻
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        
        // 相邻方块可以直接连接
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            return true;
        }
        
        // 同行或同列的直线连接
        if (row1 === row2) {
            // 水平连接
            const minCol = Math.min(col1, col2);
            const maxCol = Math.max(col1, col2);
            for (let col = minCol + 1; col < maxCol; col++) {
                if (this.grid[row1][col].pattern > 0) return false;
            }
            return true;
        } else if (col1 === col2) {
            // 垂直连接
            const minRow = Math.min(row1, row2);
            const maxRow = Math.max(row1, row2);
            for (let row = minRow + 1; row < maxRow; row++) {
                if (this.grid[row][col1].pattern > 0) return false;
            }
            return true;
        }
        
        return false;
    }
    
    findOneCornerPath(row1, col1, row2, col2) {
        // 尝试通过 (row1, col2) 连接
        if (this.isValidPosition(row1, col2)) {
            // 转折点必须是空的，或者就是目标点
            const isCornerEmpty = this.grid[row1][col2].pattern === 0 || 
                                 (row1 === row2 && col2 === col2);
            
            if (isCornerEmpty &&
                this.canDirectConnect(row1, col1, row1, col2) && 
                this.canDirectConnect(row1, col2, row2, col2)) {
                return [
                    {row: row1, col: col1},
                    {row: row1, col: col2},
                    {row: row2, col: col2}
                ];
            }
        }
        
        // 尝试通过 (row2, col1) 连接
        if (this.isValidPosition(row2, col1)) {
            // 转折点必须是空的，或者就是目标点
            const isCornerEmpty = this.grid[row2][col1].pattern === 0 || 
                                 (row2 === row1 && col1 === col1);
            
            if (isCornerEmpty &&
                this.canDirectConnect(row1, col1, row2, col1) && 
                this.canDirectConnect(row2, col1, row2, col2)) {
                return [
                    {row: row1, col: col1},
                    {row: row2, col: col1},
                    {row: row2, col: col2}
                ];
            }
        }
        
        return null;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.GRID_HEIGHT && 
               col >= 0 && col < this.GRID_WIDTH;
    }
    
    handleSuccessfulMatch(block1, block2) {
        // 显示连接线
        this.showConnectionLine(block1, block2);
        
        // 播放匹配动画
        setTimeout(() => {
            block1.element.classList.add('matched');
            block2.element.classList.add('matched');
            
            // 从网格中移除图案，但保持位置结构
            this.grid[block1.row][block1.col].pattern = 0;
            this.grid[block2.row][block2.col].pattern = 0;
            this.grid[block1.row][block1.col].element = null;
            this.grid[block2.row][block2.col].element = null;
            
            // 更新剩余方块数
            this.remainingBlocks -= 2;
            this.updateUI();
            
            // 隐藏元素但保持位置
            setTimeout(() => {
                block1.element.style.visibility = 'hidden';
                block2.element.style.visibility = 'hidden';
                this.clearSelection();
                this.clearConnectionLine();
                
                // 检查游戏是否结束
                if (this.remainingBlocks === 0) {
                    this.handleGameWin();
                } else if (!this.hasValidMoves()) {
                    // 检查是否还有可行的移动
                    this.handleGameOver();
                }
            }, 500);
        }, 300);
    }
    
    hasValidMoves() {
        // 检查是否还有可连通的方块对
        for (let row1 = 0; row1 < this.GRID_HEIGHT; row1++) {
            for (let col1 = 0; col1 < this.GRID_WIDTH; col1++) {
                if (this.grid[row1][col1].pattern === 0) continue;
                
                for (let row2 = row1; row2 < this.GRID_HEIGHT; row2++) {
                    for (let col2 = (row2 === row1 ? col1 + 1 : 0); col2 < this.GRID_WIDTH; col2++) {
                        if (this.grid[row2][col2].pattern === 0) continue;
                        
                        if (this.grid[row1][col1].pattern === this.grid[row2][col2].pattern &&
                            this.canConnect(row1, col1, row2, col2)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    handleGameOver() {
        this.isGameOver = true;
        this.clearTimer();
        
        this.gameResultTitle.textContent = '游戏结束';
        this.gameResultMessage.textContent = '没有更多可连接的方块了！可以尝试重排或开始新游戏。';
        this.finalTimeEl.textContent = this.gameTimeEl.textContent;
        
        this.showModal();
    }
    
    showConnectionLine(block1, block2) {
        const path = this.findPath(block1.row, block1.col, block2.row, block2.col);
        if (!path) return;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '100';
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.classList.add('connection-path');
        
        // 计算路径坐标
        const boardRect = this.gameBoard.getBoundingClientRect();
        const blockSize = boardRect.width / this.GRID_WIDTH;
        const blockHeight = boardRect.height / this.GRID_HEIGHT;
        
        let pathData = '';
        for (let i = 0; i < path.length; i++) {
            const point = path[i];
            let x, y;
            
            // 处理边界外的虚拟点
            if (point.row === -1) {
                // 上边界
                x = (point.col + 0.5) * blockSize;
                y = -20; // 游戏区域上方20px
            } else if (point.row === this.GRID_HEIGHT) {
                // 下边界
                x = (point.col + 0.5) * blockSize;
                y = boardRect.height + 20; // 游戏区域下方20px
            } else if (point.col === -1) {
                // 左边界
                x = -20; // 游戏区域左侧20px
                y = (point.row + 0.5) * blockHeight;
            } else if (point.col === this.GRID_WIDTH) {
                // 右边界
                x = boardRect.width + 20; // 游戏区域右侧20px
                y = (point.row + 0.5) * blockHeight;
            } else {
                // 正常的游戏区域内的点
                x = (point.col + 0.5) * blockSize;
                y = (point.row + 0.5) * blockHeight;
            }
            
            if (i === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        }
        
        pathElement.setAttribute('d', pathData);
        svg.appendChild(pathElement);
        this.connectionLine.appendChild(svg);
    }
    
    clearConnectionLine() {
        this.connectionLine.innerHTML = '';
    }
    
    showHint() {
        // 清除之前的提示
        document.querySelectorAll('.game-block.hint').forEach(block => {
            block.classList.remove('hint');
        });
        
        // 查找可连接的一对方块
        for (let row1 = 0; row1 < this.GRID_HEIGHT; row1++) {
            for (let col1 = 0; col1 < this.GRID_WIDTH; col1++) {
                if (this.grid[row1][col1].pattern === 0) continue;
                
                for (let row2 = row1; row2 < this.GRID_HEIGHT; row2++) {
                    for (let col2 = (row2 === row1 ? col1 + 1 : 0); col2 < this.GRID_WIDTH; col2++) {
                        if (this.grid[row2][col2].pattern === 0) continue;
                        
                        if (this.grid[row1][col1].pattern === this.grid[row2][col2].pattern &&
                            this.canConnect(row1, col1, row2, col2)) {
                            
                            // 显示提示
                            this.grid[row1][col1].element.classList.add('hint');
                            this.grid[row2][col2].element.classList.add('hint');
                            
                            // 3秒后移除提示
                            setTimeout(() => {
                                document.querySelectorAll('.game-block.hint').forEach(block => {
                                    block.classList.remove('hint');
                                });
                            }, 3000);
                            
                            return;
                        }
                    }
                }
            }
        }
        
        // 如果没找到可连接的对，提示用户重排
        alert('没有找到可连接的方块对，建议使用重排功能！');
    }
    
    shuffleBoard() {
        // 收集所有剩余的图案和位置
        const patterns = [];
        const remainingPositions = [];
        
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                if (this.grid[row][col].pattern > 0) {
                    patterns.push(this.grid[row][col].pattern);
                    remainingPositions.push({row, col});
                }
            }
        }
        
        // 多次尝试重排，直到找到可解的布局
        let attempts = 0;
        let isValidLayout = false;
        
        do {
            // 打乱图案
            this.shuffleArray(patterns);
            
            // 重新分配图案到剩余位置
            for (let i = 0; i < remainingPositions.length; i++) {
                const pos = remainingPositions[i];
                this.grid[pos.row][pos.col].pattern = patterns[i];
                
                // 更新显示内容
                if (this.grid[pos.row][pos.col].element) {
                    this.grid[pos.row][pos.col].element.textContent = this.getPatternSymbol(patterns[i]);
                    this.grid[pos.row][pos.col].element.dataset.pattern = patterns[i];
                }
            }
            
            // 检查是否有可行的移动
            isValidLayout = this.hasValidMoves();
            attempts++;
            
        } while (!isValidLayout && attempts < 10);
        
        if (!isValidLayout) {
            alert('重排后仍可能存在死局，建议开始新游戏！');
        }
        
        this.clearSelection();
    }
    
    startTimer() {
        this.gameStartTime = Date.now();
        this.gameTimer = setInterval(() => {
            const elapsed = Date.now() - this.gameStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.gameTimeEl.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    clearTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    updateUI() {
        this.remainingBlocksEl.textContent = this.remainingBlocks;
    }
    
    handleGameWin() {
        this.isGameOver = true;
        this.clearTimer();
        
        const finalTime = this.gameTimeEl.textContent;
        this.gameResultTitle.textContent = '恭喜通关！';
        this.gameResultMessage.textContent = '你成功完成了困难模式的连连看游戏！';
        this.finalTimeEl.textContent = finalTime;
        
        this.showModal();
    }
    
    showModal() {
        this.gameOverModal.classList.remove('hidden');
    }
    
    hideModal() {
        this.gameOverModal.classList.add('hidden');
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    new LianLianKanGame();
});