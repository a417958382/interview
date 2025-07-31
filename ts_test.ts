// const heapUseCases = {
//     "优先队列": "只需要获取最高优先级的元素",
//     "堆排序": "逐个取出最小/最大值进行排序", 
//     "图算法": "Dijkstra等算法只需要最短距离的节点",
//     "任务调度": "总是处理优先级最高的任务"
// };

class PriorityItem<T> {
    value: T;
    priority: number;
    
    constructor(value: T, priority: number) {
        this.value = value;
        this.priority = priority;
    }
}

class MinHeap<T> {
    private heap: PriorityItem<T>[] = [];
    
    // 获取父节点、左右子节点的索引
    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }
    
    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }
    
    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }
    
    // 交换两个元素
    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }
    
    // 向上调整（插入后）
    private heapifyUp(index: number): void {
        const parentIndex = this.getParentIndex(index);
        
        if (parentIndex >= 0 && 
            this.heap[parentIndex].priority > this.heap[index].priority) {
            this.swap(parentIndex, index);
            this.heapifyUp(parentIndex);
        }
    }
    
    // 向下调整（删除后）
    private heapifyDown(index: number): void {
        const leftIndex = this.getLeftChildIndex(index);
        const rightIndex = this.getRightChildIndex(index);
        let minIndex = index;
        
        if (leftIndex < this.heap.length && 
            this.heap[leftIndex].priority < this.heap[minIndex].priority) {
            minIndex = leftIndex;
        }
        
        if (rightIndex < this.heap.length && 
            this.heap[rightIndex].priority < this.heap[minIndex].priority) {
            minIndex = rightIndex;
        }
        
        if (minIndex !== index) {
            this.swap(index, minIndex);
            this.heapifyDown(minIndex);
        }
    }
    
    // 入队：O(log n)
    enqueue(value: T, priority: number): void {
        const newItem: PriorityItem<T> = { value, priority };
        this.heap.push(newItem);
        this.heapifyUp(this.heap.length - 1);
        console.log(`插入 "${value}" (优先级${priority})`);
    }
    
    // 出队：O(log n)
    dequeue(): T | undefined {
        if (this.heap.length === 0) return undefined;
        
        const min = this.heap[0];
        const last = this.heap.pop()!;
        
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.heapifyDown(0);
        }
        
        return min.value;
    }
    
    // 查看最高优先级元素：O(1)
    peek(): T | undefined {
        return this.heap.length > 0 ? this.heap[0].value : undefined;
    }
    
    size(): number {
        return this.heap.length;
    }
}

// 堆实现的优先队列演示
const heapQueue = new MinHeap<string>();
heapQueue.enqueue("任务D", 4);
heapQueue.enqueue("任务A", 1);  // 最高优先级
heapQueue.enqueue("任务C", 3);
heapQueue.enqueue("任务B", 2);

console.log("出队顺序:");
while (heapQueue.size() > 0) {
    console.log(heapQueue.dequeue()); // A, B, C, D
}