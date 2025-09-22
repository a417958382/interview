#!/usr/bin/env node

/**
 * 消除类游戏系统测试脚本
 * 
 * 运行方式:
 * npx ts-node test.ts
 * 或者
 * node test.js (如果编译了)
 */

import { runDemo } from './GameDemo';

async function main() {
  console.log('🚀 启动消除类游戏系统测试...\n');
  
  try {
    await runDemo();
    console.log('\n🎉 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    process.exit(1);
  }
}

// 运行主函数
main();
