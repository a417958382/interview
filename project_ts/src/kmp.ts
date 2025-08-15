/**
 * KMP (Knuth-Morris-Pratt) 字符串匹配算法
 * 
 * KMP算法是一种高效的字符串匹配算法，用于在文本字符串中搜索模式字符串的出现位置。
 * 它使用失效函数（也称为前缀函数）来避免在不匹配时进行不必要的字符比较。
 * 
 * 时间复杂度: O(n + m) 其中 n 是文本长度，m 是模式长度
 * 空间复杂度: O(m) 用于存储失效函数数组
 */

export class KMP {
    /**
     * 构建失效函数（前缀函数）
     * 失效函数表示对于模式字符串的每个位置，最长的既是前缀又是后缀的子串长度
     * 
     * @param pattern - 要构建失效函数的模式字符串
     * @returns 失效函数值数组
     */
    private static buildFailureFunction(pattern: string): number[] {
        const m = pattern.length;
        const failure = new Array(m).fill(0);
        let j = 0; // 前缀指针
        
        // 从第二个字符开始计算失效函数
        for (let i = 1; i < m; i++) {
            // 如果字符不匹配，回退到前一个可能的匹配位置
            while (j > 0 && pattern[i] !== pattern[j]) {
                j = failure[j - 1];
            }
            
            // 如果字符匹配，增加前缀长度
            if (pattern[i] === pattern[j]) {
                j++;
            }
            
            failure[i] = j;
        }
        
        return failure;
    }
    
    /**
     * 使用KMP算法在文本中搜索模式字符串
     * 
     * @param text - 要搜索的文本字符串
     * @param pattern - 要查找的模式字符串
     * @returns 所有匹配位置的数组，如果没有找到则返回空数组
     */
    public static search(text: string, pattern: string): number[] {
        if (!pattern || pattern.length === 0) {
            return [];
        }
        
        if (!text || text.length === 0) {
            return [];
        }
        
        const n = text.length;
        const m = pattern.length;
        const matches: number[] = [];
        
        // 构建失效函数
        const failure = this.buildFailureFunction(pattern);
        
        let j = 0; // 模式字符串的指针
        
        // 遍历文本字符串
        for (let i = 0; i < n; i++) {
            // 如果字符不匹配，使用失效函数回退
            while (j > 0 && text[i] !== pattern[j]) {
                j = failure[j - 1];
            }
            
            // 如果字符匹配，移动模式指针
            if (text[i] === pattern[j]) {
                j++;
            }
            
            // 如果完全匹配，记录匹配位置并准备寻找下一个匹配
            if (j === m) {
                matches.push(i - m + 1);
                j = failure[j - 1]; // 继续寻找重叠的匹配
            }
        }
        
        return matches;
    }
    
    /**
     * 查找第一个匹配位置
     * 
     * @param text - 要搜索的文本字符串
     * @param pattern - 要查找的模式字符串
     * @returns 第一个匹配的位置，如果没有找到则返回-1
     */
    public static indexOf(text: string, pattern: string): number {
        const matches = this.search(text, pattern);
        return matches.length > 0 ? matches[0] : -1;
    }
    
    /**
     * 检查文本是否包含模式字符串
     * 
     * @param text - 要搜索的文本字符串
     * @param pattern - 要查找的模式字符串
     * @returns 如果找到匹配则返回true，否则返回false
     */
    public static contains(text: string, pattern: string): boolean {
        return this.indexOf(text, pattern) !== -1;
    }
    
    /**
     * 计算匹配次数
     * 
     * @param text - 要搜索的文本字符串
     * @param pattern - 要查找的模式字符串
     * @returns 匹配的总次数
     */
    public static count(text: string, pattern: string): number {
        return this.search(text, pattern).length;
    }
    
    /**
     * 获取失效函数（用于调试和学习）
     * 
     * @param pattern - 模式字符串
     * @returns 失效函数数组
     */
    public static getFailureFunction(pattern: string): number[] {
        return this.buildFailureFunction(pattern);
    }
}

/**
 * 使用示例和测试函数
 */
export function demonstrateKMP(): void {
    console.log('=== KMP算法演示 ===\n');
    
    // 示例1: 基本搜索
    const text1 = "ABABABABCABAB";
    const pattern1 = "ABABCABAB";
    
    console.log(`文本: ${text1}`);
    console.log(`模式: ${pattern1}`);
    console.log(`匹配位置: ${KMP.search(text1, pattern1)}`);
    console.log(`第一个匹配位置: ${KMP.indexOf(text1, pattern1)}`);
    console.log(`是否包含: ${KMP.contains(text1, pattern1)}`);
    console.log(`匹配次数: ${KMP.count(text1, pattern1)}\n`);
    
    // 示例2: 重叠匹配
    const text2 = "AAAAAAA";
    const pattern2 = "AAA";
    
    console.log(`文本: ${text2}`);
    console.log(`模式: ${pattern2}`);
    console.log(`所有匹配位置: ${KMP.search(text2, pattern2)}`);
    console.log(`匹配次数: ${KMP.count(text2, pattern2)}\n`);
    
    // 示例3: 失效函数演示
    const pattern3 = "ABABCABAB";
    console.log(`模式: ${pattern3}`);
    console.log(`失效函数: ${KMP.getFailureFunction(pattern3)}`);
    
    // 解释失效函数
    console.log('\n失效函数解释:');
    const failure = KMP.getFailureFunction(pattern3);
    for (let i = 0; i < pattern3.length; i++) {
        console.log(`位置 ${i} (字符 '${pattern3[i]}'): ${failure[i]}`);
    }
    
    console.log('\n=== 演示结束 ===');
}