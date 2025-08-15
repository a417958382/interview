/**
 * 链表重排问题：将链表 A1 → A2 → A3 → A4 → ... → AN
 * 重排成 A1 → AN → A2 → AN-1 → A3 → AN-2 → ...
 */

/**
 * 链表节点定义
 */
class ListNode {
    val: number;
    next: ListNode | null;
    
    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

/**
 * 解法一：使用数组存储（空间复杂度 O(n)）
 * 
 * 思路：
 * 1. 遍历链表，将所有节点存储到数组中
 * 2. 使用双指针从数组两端取节点重新连接
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */
function reorderListWithArray(head: ListNode | null): void {
    if (!head || !head.next) return;
    
    // 将所有节点存储到数组中
    const nodes: ListNode[] = [];
    let current: ListNode | null = head;
    while (current) {
        nodes.push(current);
        current = current.next;
    }
    
    // 使用双指针重新连接
    let left = 0;
    let right = nodes.length - 1;
    
    while (left < right) {
        // 连接 left -> right -> left+1
        nodes[left].next = nodes[right];
        left++;
        
        if (left >= right) break;
        
        nodes[right].next = nodes[left];
        right--;
    }
    
    // 最后一个节点的next设为null
    nodes[left].next = null;
}

/**
 * 解法二：原地重排（空间复杂度 O(1)）
 * 
 * 思路：
 * 1. 找到链表中点，将链表分成两部分
 * 2. 反转后半部分链表
 * 3. 交替合并两个链表
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(1)
 */
function reorderList(head: ListNode | null): void {
    if (!head || !head.next) return;
    
    // 步骤1：找到链表中点
    const mid = findMiddle(head);
    
    // 步骤2：分割链表并反转后半部分
    const secondHalf = mid.next;
    mid.next = null; // 断开连接
    const reversedSecond = reverseList(secondHalf);
    
    // 步骤3：交替合并两个链表
    mergeLists(head, reversedSecond);
}

/**
 * 使用快慢指针找到链表中点
 */
function findMiddle(head: ListNode): ListNode {
    let slow = head;
    let fast = head;
    
    // 当链表长度为偶数时，slow指向第一个中点
    // 当链表长度为奇数时，slow指向中点
    while (fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }
    
    return slow;
}

/**
 * 反转链表
 */
function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current = head;
    
    while (current) {
        const nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }
    return prev;
}

/**
 * 交替合并两个链表
 */
function mergeLists(first: ListNode, second: ListNode | null): void {
    while (second) {
        const firstNext = first.next;
        const secondNext = second.next;
        
        first.next = second;
        second.next = firstNext;
        
        first = firstNext!;
        second = secondNext;
    }
}

/**
 * 辅助函数：从数组创建链表
 */
function createListFromArray(arr: number[]): ListNode | null {
    if (arr.length === 0) return null;
    
    const head = new ListNode(arr[0]);
    let current = head;
    
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    
    return head;
}

/**
 * 辅助函数：将链表转换为数组（用于测试）
 */
function listToArray(head: ListNode | null): number[] {
    const result: number[] = [];
    let current = head;
    
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    
    return result;
}

/**
 * 测试函数
 */
export function demonstrateReorderList(): void {
    console.log('=== 链表重排算法演示 ===\n');
    
    // 测试用例1：奇数长度链表
    console.log('测试用例1：奇数长度链表 [1,2,3,4,5]');
    let list1 = createListFromArray([1, 2, 3, 4, 5]);
    console.log('原链表:', listToArray(list1));
    reorderList(list1);
    console.log('重排后:', listToArray(list1));
    console.log('期望结果: [1,5,2,4,3]\n');
    
    // 测试用例2：偶数长度链表
    console.log('测试用例2：偶数长度链表 [1,2,3,4,5,6]');
    let list2 = createListFromArray([1, 2, 3, 4, 5, 6]);
    console.log('原链表:', listToArray(list2));
    reorderList(list2);
    console.log('重排后:', listToArray(list2));
    console.log('期望结果: [1,6,2,5,3,4]\n');
    
    // 测试用例3：两个节点
    console.log('测试用例3：两个节点 [1,2]');
    let list3 = createListFromArray([1, 2]);
    console.log('原链表:', listToArray(list3));
    reorderList(list3);
    console.log('重排后:', listToArray(list3));
    console.log('期望结果: [1,2]\n');
    
    // 测试用例4：一个节点
    console.log('测试用例4：一个节点 [1]');
    let list4 = createListFromArray([1]);
    console.log('原链表:', listToArray(list4));
    reorderList(list4);
    console.log('重排后:', listToArray(list4));
    console.log('期望结果: [1]\n');
    
    // 对比两种解法
    console.log('=== 两种解法对比 ===');
    console.log('解法一（数组辅助）：');
    console.log('- 时间复杂度：O(n)');
    console.log('- 空间复杂度：O(n)');
    console.log('- 优点：思路简单，易于理解');
    console.log('- 缺点：需要额外空间');
    
    console.log('\n解法二（原地重排）：');
    console.log('- 时间复杂度：O(n)');
    console.log('- 空间复杂度：O(1)');
    console.log('- 优点：空间效率高');
    console.log('- 缺点：需要掌握链表反转等技巧');
    
    console.log('\n=== 算法步骤详解 ===');
    console.log('原地重排的三个关键步骤：');
    console.log('1. 找中点：使用快慢指针找到链表中点');
    console.log('2. 反转：反转后半部分链表');
    console.log('3. 合并：交替连接两个链表的节点');
    
    console.log('\n=== 演示结束 ===');
}

// 导出主要函数
export { ListNode, reorderList, reorderListWithArray };