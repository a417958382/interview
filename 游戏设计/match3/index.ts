/**
 * 消除类游戏核心系统
 * 
 * 这个模块包含了消除类游戏的核心系统实现，包括：
 * - EliminationSystem: 核心消除引擎
 * - MatchDetector: 匹配检测器
 * - GravitySystem: 重力系统
 * - FillSystem: 填充系统
 * - 相关类型定义
 */

// 导出核心系统
export { EliminationSystem } from './EliminationSystem';
export { MatchDetector } from './MatchDetector';
export { GravitySystem } from './GravitySystem';
export { FillSystem } from './FillSystem';

// 导出工具类
export { GridInitializer } from './GridInitializer';
export { GridVisualizer } from './GridVisualizer';
export { GameDemo, runDemo } from './GameDemo';

// 导出类型定义
export * from './types';

// 导出默认配置
export const DEFAULT_ELIMINATION_CONFIG = {
  baseScorePerGem: 10,
  matchLengthMultiplier: 1.5,
  specialGemMultiplier: 2.0,
  comboTimeWindow: 3.0,
  maxComboMultiplier: 5.0,
  comboDecayRate: 0.1,
  chainReactionMultiplier: 1.2,
  maxChainLength: 10,
  chainBonusThreshold: 3
} as const;
