/**
 * 算法可视化演示系统
 * 支持多种排序和查找算法的动画演示
 */

class AlgorithmVisualizer {
    constructor() {
        this.array = [];
        this.originalArray = [];
        this.isRunning = false;
        this.isPaused = false;
        this.animationSpeed = 500; // 毫秒
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = 0;
        this.animationQueue = [];
        this.currentAnimation = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateNewArray();
    }

    initializeElements() {
        this.arrayContainer = document.getElementById('array-container');
        this.algorithmSelect = document.getElementById('algorithm-select');
        this.arraySizeSlider = document.getElementById('array-size');
        this.sizeValue = document.getElementById('size-value');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speed-value');
        this.targetValue = document.getElementById('target-value');
        this.generateBtn = document.getElementById('generate-btn');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.algorithmName = document.getElementById('algorithm-name');
        this.algorithmDescription = document.getElementById('algorithm-description');
        this.comparisonsDisplay = document.getElementById('comparisons');
        this.swapsDisplay = document.getElementById('swaps');
        this.executionTimeDisplay = document.getElementById('execution-time');
    }

    setupEventListeners() {
        this.arraySizeSlider.addEventListener('input', (e) => {
            this.sizeValue.textContent = e.target.value;
        });

        this.speedSlider.addEventListener('input', (e) => {
            this.speedValue.textContent = e.target.value;
            this.animationSpeed = 1100 - (e.target.value * 100); // 1-10 映射到 1000-100ms
        });

        this.algorithmSelect.addEventListener('change', () => {
            this.updateAlgorithmInfo();
        });

        this.generateBtn.addEventListener('click', () => {
            this.generateNewArray();
        });

        this.startBtn.addEventListener('click', () => {
            this.startVisualization();
        });

        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });

        this.resetBtn.addEventListener('click', () => {
            this.resetVisualization();
        });

        // 初始化算法信息
        this.updateAlgorithmInfo();
    }

    generateNewArray() {
        const size = parseInt(this.arraySizeSlider.value);
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 100) + 1);
        }
        this.originalArray = [...this.array];
        this.renderArray();
        this.resetStats();
    }

    renderArray() {
        this.arrayContainer.innerHTML = '';
        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element default';
            element.style.height = `${(value / maxValue) * 200 + 40}px`;
            element.textContent = value;
            element.setAttribute('data-value', value);
            element.setAttribute('data-index', index);
            this.arrayContainer.appendChild(element);
        });
    }

    updateElementState(index, state, value = null) {
        const element = this.arrayContainer.children[index];
        if (element) {
            // 移除所有状态类
            element.className = 'array-element';
            // 添加新状态类
            element.classList.add(state);
            
            if (value !== null) {
                element.textContent = value;
                element.setAttribute('data-value', value);
            }
        }
    }

    updateArray(newArray) {
        this.array = [...newArray];
        this.renderArray();
    }

    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.comparisonsDisplay.textContent = '0';
        this.swapsDisplay.textContent = '0';
        this.executionTimeDisplay.textContent = '0ms';
    }

    updateStats() {
        this.comparisonsDisplay.textContent = this.comparisons;
        this.swapsDisplay.textContent = this.swaps;
        if (this.startTime > 0) {
            const elapsed = Date.now() - this.startTime;
            this.executionTimeDisplay.textContent = `${elapsed}ms`;
        }
    }

    updateAlgorithmInfo() {
        const algorithm = this.algorithmSelect.value;
        const info = this.getAlgorithmInfo(algorithm);
        this.algorithmName.textContent = info.name;
        this.algorithmDescription.textContent = info.description;
    }

    getAlgorithmInfo(algorithm) {
        const info = {
            bubbleSort: {
                name: '冒泡排序 (Bubble Sort)',
                description: '通过重复遍历数组，比较相邻元素并交换位置，将较大的元素逐渐"冒泡"到数组末尾。时间复杂度：O(n²)'
            },
            selectionSort: {
                name: '选择排序 (Selection Sort)',
                description: '每次从未排序部分选择最小元素，与未排序部分的第一个元素交换位置。时间复杂度：O(n²)'
            },
            insertionSort: {
                name: '插入排序 (Insertion Sort)',
                description: '将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的正确位置。时间复杂度：O(n²)'
            },
            quickSort: {
                name: '快速排序 (Quick Sort)',
                description: '选择一个基准元素，将数组分为小于基准和大于基准的两部分，然后递归排序。时间复杂度：平均O(n log n)'
            },
            mergeSort: {
                name: '归并排序 (Merge Sort)',
                description: '将数组递归地分成两半，分别排序后再合并。时间复杂度：O(n log n)'
            },
            linearSearch: {
                name: '线性查找 (Linear Search)',
                description: '从数组的第一个元素开始，逐个检查每个元素直到找到目标值。时间复杂度：O(n)'
            },
            binarySearch: {
                name: '二分查找 (Binary Search)',
                description: '在有序数组中，通过比较中间元素来缩小搜索范围。时间复杂度：O(log n)'
            },
            interpolationSearch: {
                name: '插值查找 (Interpolation Search)',
                description: '基于目标值在数组中的位置进行插值计算，适用于均匀分布的有序数组。时间复杂度：平均O(log log n)'
            },
            jumpSearch: {
                name: '跳跃查找 (Jump Search)',
                description: '通过固定步长跳跃搜索，找到可能包含目标值的块，然后在该块内进行线性搜索。时间复杂度：O(√n)'
            }
        };
        return info[algorithm] || { name: '未知算法', description: '请选择一个算法' };
    }

    async startVisualization() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.resetStats();
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.generateBtn.disabled = true;
        this.algorithmSelect.disabled = true;
        
        const algorithm = this.algorithmSelect.value;
        
        try {
            if (algorithm.includes('Search')) {
                await this.runSearchAlgorithm(algorithm);
            } else {
                await this.runSortAlgorithm(algorithm);
            }
        } catch (error) {
            console.error('算法执行错误:', error);
        } finally {
            this.finishVisualization();
        }
    }

    async runSortAlgorithm(algorithm) {
        const array = [...this.array];
        
        switch (algorithm) {
            case 'bubbleSort':
                await this.bubbleSort(array);
                break;
            case 'selectionSort':
                await this.selectionSort(array);
                break;
            case 'insertionSort':
                await this.insertionSort(array);
                break;
            case 'quickSort':
                await this.quickSort(array, 0, array.length - 1);
                break;
            case 'mergeSort':
                await this.mergeSort(array, 0, array.length - 1);
                break;
        }
    }

    async runSearchAlgorithm(algorithm) {
        const target = parseInt(this.targetValue.value);
        let result = -1;
        
        // 对于需要有序数组的搜索算法，先排序
        if (['binarySearch', 'interpolationSearch', 'jumpSearch'].includes(algorithm)) {
            const sortedArray = [...this.array].sort((a, b) => a - b);
            this.updateArray(sortedArray);
            await this.delay(1000);
        }
        
        switch (algorithm) {
            case 'linearSearch':
                result = await this.linearSearch(target);
                break;
            case 'binarySearch':
                result = await this.binarySearch(target);
                break;
            case 'interpolationSearch':
                result = await this.interpolationSearch(target);
                break;
            case 'jumpSearch':
                result = await this.jumpSearch(target);
                break;
        }
        
        if (result !== -1) {
            this.updateElementState(result, 'found');
        }
    }

    // 排序算法实现
    async bubbleSort(arr) {
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                
                // 高亮比较的元素
                this.updateElementState(j, 'comparing');
                this.updateElementState(j + 1, 'comparing');
                this.comparisons++;
                this.updateStats();
                await this.delay();
                
                if (arr[j] > arr[j + 1]) {
                    // 交换元素
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    this.swaps++;
                    
                    // 显示交换动画
                    this.updateElementState(j, 'swapping');
                    this.updateElementState(j + 1, 'swapping');
                    await this.delay();
                    
                    this.updateArray(arr);
                    swapped = true;
                }
                
                // 重置比较状态
                this.updateElementState(j, 'default');
                this.updateElementState(j + 1, 'default');
            }
            
            // 标记已排序的元素
            this.updateElementState(n - 1 - i, 'sorted');
            
            if (!swapped) break;
        }
        
        // 标记所有元素为已排序
        for (let i = 0; i < n; i++) {
            this.updateElementState(i, 'sorted');
        }
    }

    async selectionSort(arr) {
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            // 标记当前最小值
            this.updateElementState(i, 'comparing');
            
            for (let j = i + 1; j < n; j++) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                
                this.updateElementState(j, 'comparing');
                this.comparisons++;
                this.updateStats();
                await this.delay();
                
                if (arr[j] < arr[minIndex]) {
                    this.updateElementState(minIndex, 'default');
                    minIndex = j;
                    this.updateElementState(minIndex, 'comparing');
                } else {
                    this.updateElementState(j, 'default');
                }
            }
            
            if (minIndex !== i) {
                // 交换元素
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                this.swaps++;
                
                this.updateElementState(i, 'swapping');
                this.updateElementState(minIndex, 'swapping');
                await this.delay();
                
                this.updateArray(arr);
            }
            
            this.updateElementState(i, 'sorted');
            this.updateElementState(minIndex, 'default');
        }
        
        this.updateElementState(n - 1, 'sorted');
    }

    async insertionSort(arr) {
        const n = arr.length;
        
        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;
            
            this.updateElementState(i, 'comparing');
            await this.delay();
            
            while (j >= 0 && arr[j] > key) {
                if (this.isPaused) {
                    await this.waitForResume();
                }
                
                this.updateElementState(j, 'comparing');
                this.comparisons++;
                this.updateStats();
                await this.delay();
                
                arr[j + 1] = arr[j];
                this.updateElementState(j + 1, 'swapping');
                await this.delay();
                
                this.updateArray(arr);
                this.updateElementState(j, 'default');
                j--;
            }
            
            arr[j + 1] = key;
            this.updateElementState(j + 1, 'sorted');
            this.updateArray(arr);
        }
        
        // 标记所有元素为已排序
        for (let i = 0; i < n; i++) {
            this.updateElementState(i, 'sorted');
        }
    }

    async quickSort(arr, low, high) {
        if (low < high) {
            const pi = await this.partition(arr, low, high);
            
            await this.quickSort(arr, low, pi - 1);
            await this.quickSort(arr, pi + 1, high);
        }
    }

    async partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;
        
        // 标记基准元素
        this.updateElementState(high, 'pivot');
        
        for (let j = low; j < high; j++) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            this.updateElementState(j, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    this.swaps++;
                    
                    this.updateElementState(i, 'swapping');
                    this.updateElementState(j, 'swapping');
                    await this.delay();
                    
                    this.updateArray(arr);
                }
            }
            
            this.updateElementState(j, 'default');
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.swaps++;
        
        this.updateElementState(i + 1, 'swapping');
        this.updateElementState(high, 'swapping');
        await this.delay();
        
        this.updateArray(arr);
        this.updateElementState(i + 1, 'sorted');
        this.updateElementState(high, 'default');
        
        return i + 1;
    }

    async mergeSort(arr, left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSort(arr, left, mid);
            await this.mergeSort(arr, mid + 1, right);
            await this.merge(arr, left, mid, right);
        }
    }

    async merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;
        
        while (i < leftArr.length && j < rightArr.length) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            this.updateElementState(left + i, 'comparing');
            this.updateElementState(mid + 1 + j, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                this.updateElementState(k, 'swapping');
                await this.delay();
                this.updateArray(arr);
                i++;
            } else {
                arr[k] = rightArr[j];
                this.updateElementState(k, 'swapping');
                await this.delay();
                this.updateArray(arr);
                j++;
            }
            
            this.updateElementState(k, 'sorted');
            k++;
        }
        
        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            this.updateElementState(k, 'sorted');
            i++;
            k++;
        }
        
        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            this.updateElementState(k, 'sorted');
            j++;
            k++;
        }
        
        this.updateArray(arr);
    }

    // 搜索算法实现
    async linearSearch(target) {
        for (let i = 0; i < this.array.length; i++) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            this.updateElementState(i, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (this.array[i] === target) {
                this.updateElementState(i, 'target');
                return i;
            }
            
            this.updateElementState(i, 'default');
        }
        return -1;
    }

    async binarySearch(target) {
        let left = 0;
        let right = this.array.length - 1;
        
        while (left <= right) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            const mid = Math.floor((left + right) / 2);
            
            this.updateElementState(mid, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (this.array[mid] === target) {
                this.updateElementState(mid, 'target');
                return mid;
            } else if (this.array[mid] < target) {
                // 高亮左半部分
                for (let i = left; i < mid; i++) {
                    this.updateElementState(i, 'default');
                }
                left = mid + 1;
            } else {
                // 高亮右半部分
                for (let i = mid + 1; i <= right; i++) {
                    this.updateElementState(i, 'default');
                }
                right = mid - 1;
            }
            
            this.updateElementState(mid, 'default');
        }
        return -1;
    }

    async interpolationSearch(target) {
        let left = 0;
        let right = this.array.length - 1;
        
        while (left <= right && target >= this.array[left] && target <= this.array[right]) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            if (left === right) {
                this.updateElementState(left, 'comparing');
                this.comparisons++;
                this.updateStats();
                await this.delay();
                
                if (this.array[left] === target) {
                    this.updateElementState(left, 'target');
                    return left;
                }
                return -1;
            }
            
            const pos = left + Math.floor(((target - this.array[left]) * (right - left)) / (this.array[right] - this.array[left]));
            
            this.updateElementState(pos, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (this.array[pos] === target) {
                this.updateElementState(pos, 'target');
                return pos;
            } else if (this.array[pos] < target) {
                left = pos + 1;
            } else {
                right = pos - 1;
            }
            
            this.updateElementState(pos, 'default');
        }
        return -1;
    }

    async jumpSearch(target) {
        const n = this.array.length;
        const step = Math.floor(Math.sqrt(n));
        let prev = 0;
        
        // 跳跃阶段
        while (prev < n && this.array[Math.min(prev + step, n) - 1] < target) {
            this.updateElementState(prev, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            prev += step;
            if (prev >= n) {
                return -1;
            }
        }
        
        // 线性搜索阶段
        let current = prev;
        while (current < Math.min(prev + step, n) && this.array[current] <= target) {
            if (this.isPaused) {
                await this.waitForResume();
            }
            
            this.updateElementState(current, 'comparing');
            this.comparisons++;
            this.updateStats();
            await this.delay();
            
            if (this.array[current] === target) {
                this.updateElementState(current, 'target');
                return current;
            }
            
            this.updateElementState(current, 'default');
            current++;
        }
        
        return -1;
    }

    // 工具方法
    delay() {
        return new Promise(resolve => setTimeout(resolve, this.animationSpeed));
    }

    async waitForResume() {
        return new Promise(resolve => {
            const checkResume = () => {
                if (!this.isPaused) {
                    resolve();
                } else {
                    setTimeout(checkResume, 100);
                }
            };
            checkResume();
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '继续' : '暂停';
    }

    resetVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        this.array = [...this.originalArray];
        this.renderArray();
        this.resetStats();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.generateBtn.disabled = false;
        this.algorithmSelect.disabled = false;
    }

    finishVisualization() {
        this.isRunning = false;
        this.isPaused = false;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.generateBtn.disabled = false;
        this.algorithmSelect.disabled = false;
        
        // 最终统计
        const totalTime = Date.now() - this.startTime;
        this.executionTimeDisplay.textContent = `${totalTime}ms`;
    }
}

// 初始化可视化器
document.addEventListener('DOMContentLoaded', () => {
    new AlgorithmVisualizer();
});
