# 🚀 快速开始指南

## 安装依赖

```bash
# 进入match3目录
cd 游戏设计/match3

# 安装依赖
npm install
```

## 运行测试

### 方式1: 简单演示（无需TypeScript环境）
```bash
npm run simple-demo
```

### 方式2: 直接运行测试脚本
```bash
npm test
```

### 方式3: 使用ts-node直接运行
```bash
npx ts-node test.ts
```

### 方式4: 编译后运行
```bash
npm run build
npm start
```

## 运行演示

```bash
npm run demo
```

## 基本使用示例

```typescript
import { EliminationSystem, GridInitializer, GridVisualizer } from './index';

// 1. 创建消除系统
const eliminationSystem = new EliminationSystem();

// 2. 创建网格
const grid = GridInitializer.createTestGrid();

// 3. 显示网格
console.log(GridVisualizer.gridToString(grid));

// 4. 检测匹配
const matches = eliminationSystem.findMatches(grid);
console.log(`找到 ${matches.length} 个匹配`);

// 5. 执行消除
if (matches.length > 0) {
  const result = await eliminationSystem.executeElimination(grid, matches);
  console.log(`消除结果: 得分 ${result.score}`);
}

// 6. 显示结果
console.log(GridVisualizer.gridToString(grid));
```

## 测试内容

运行测试后，您将看到：

1. **简单功能测试** - 验证基本功能
2. **完整演示** - 展示所有系统功能
3. **性能测试** - 测试不同网格大小的性能

## 预期输出

```
🧪 运行简单功能测试...

初始网格:
  0 1 2 3 4 5 6 7
0: 🔴 🔴 🔴 🔵 🟢 🟡 🟣 🟠
1: 🔵 🔵 🔵 🔴 🔵 🟢 🟡 🟣
...

找到 3 个匹配
消除结果: 得分 150, 消除 9 个宝石

✅ 简单测试完成！
```

## 故障排除

### 如果遇到模块找不到的错误
```bash
# 确保在正确的目录
cd 游戏设计/match3

# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 如果TypeScript编译错误
```bash
# 检查TypeScript版本
npx tsc --version

# 重新编译
npm run build
```

## 下一步

- 查看 `README.md` 了解详细功能
- 查看 `GameDemo.ts` 了解完整用法
- 修改配置参数测试不同效果
- 扩展系统添加新功能
