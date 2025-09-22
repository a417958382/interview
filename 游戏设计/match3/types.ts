/**
 * 消除类游戏核心类型定义
 */

// 位置坐标
export interface Position {
  row: number;
  col: number;
}

// 宝石类型枚举
export enum GemType {
  RED = 'red',           // 红色
  BLUE = 'blue',         // 蓝色
  GREEN = 'green',       // 绿色
  YELLOW = 'yellow',     // 黄色
  PURPLE = 'purple',     // 紫色
  ORANGE = 'orange',     // 橙色

  // 特殊宝石
  SPECIAL_BOMB = 'bomb',       // 炸弹（爆炸消除）
  SPECIAL_LINE_H = 'line_h',   // 水平直线消除
  SPECIAL_LINE_V = 'line_v',   // 垂直直线消除
  SPECIAL_COLOR = 'color',     // 同色消除

  // 特殊状态
  BLOCKER = 'blocker',         // 障碍物
  EMPTY = 'empty'             // 空位置
}

// 宝石对象
export interface Gem {
  id: string;
  type: GemType;
  position: Position;
  baseScore: number;
  isSpecial: boolean;
  effects?: GemEffect[];
}

// 宝石效果
export interface GemEffect {
  type: string;
  value: number;
  duration?: number;
}

// 网格单元格
export interface GridCell {
  gem: Gem | null;
  position: Position;
  isEmpty: boolean;
  isLocked: boolean;
}

// 游戏网格
export interface GameGrid {
  rows: number;
  cols: number;
  cells: GridCell[][];
}

// 匹配结果
export interface MatchResult {
  positions: Position[];
  type: GemType;
  length: number;
  direction: 'horizontal' | 'vertical';
}

// 消除的宝石
export interface EliminatedGem {
  position: Position;
  gem: Gem;
  score: number;
}

// 特殊效果
export interface SpecialEffect {
  type: 'create_special' | 'explode' | 'line_clear' | 'color_clear';
  position: Position;
  gemType?: GemType;
  radius?: number;
  direction?: 'horizontal' | 'vertical';
  targetColor?: GemType;
}

// 消除结果
export interface EliminationResult {
  eliminatedGems: EliminatedGem[];
  specialEffects: SpecialEffect[];
  score: number;
  comboCount: number;
}

// 移动动画
export interface MoveAnimation {
  fromPosition: Position;
  toPosition: Position;
  gem: Gem;
  duration: number;
}

// 生成动画
export interface SpawnAnimation {
  position: Position;
  gem: Gem;
  spawnType: 'fall_in' | 'appear';
  delay: number;
}

// 重力结果
export interface GravityResult {
  animations: MoveAnimation[];
  hasChanges: boolean;
}

// 填充结果
export interface FillResult {
  animations: SpawnAnimation[];
  newGems: Gem[];
  hasChanges: boolean;
}

// 连锁结果
export interface CascadeResult {
  totalEliminations: number;
  totalScore: number;
  chainCount: number;
  animations: (MoveAnimation | SpawnAnimation)[];
}

// 连击结果
export interface ComboResult {
  comboCount: number;
  multiplier: number;
  bonusScore: number;
  isNewRecord: boolean;
}

// 特殊元素结果
export interface SpecialEffectResult {
  effects: SpecialEffect[];
  score: number;
}

// 消除系统配置
export interface EliminationConfig {
  baseScorePerGem: number;
  matchLengthMultiplier: number;
  specialGemMultiplier: number;
  comboTimeWindow: number;
  maxComboMultiplier: number;
  comboDecayRate: number;
  chainReactionMultiplier: number;
  maxChainLength: number;
  chainBonusThreshold: number;
}
