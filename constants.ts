import { FiveElement } from "./types";

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

export const PALACE_NAMES_BASE = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', 
  '迁移', '交友', '官禄', '田宅', '福德', '父母'
];

export const PALACE_ICONS = [
  '👑', // Ming - Crown/Self
  '🤝', // Siblings - Handshake
  '💍', // Spouse - Ring
  '👶', // Children - Baby
  '💰', // Wealth - Money Bag
  '💊', // Health - Pill
  '✈️', // Travel - Plane
  '👯', // Friends - People
  '💼', // Career - Briefcase
  '🏠', // Property - House
  '🍀', // Fortune - Clover
  '👴', // Parents - Old Man
];

// Simplified mapping for Five Elements of Stems/Branches
export const STEM_ELEMENTS: Record<string, FiveElement> = {
  '甲': FiveElement.WOOD, '乙': FiveElement.WOOD,
  '丙': FiveElement.FIRE, '丁': FiveElement.FIRE,
  '戊': FiveElement.EARTH, '己': FiveElement.EARTH,
  '庚': FiveElement.METAL, '辛': FiveElement.METAL,
  '壬': FiveElement.WATER, '癸': FiveElement.WATER,
};

export const BRANCH_ELEMENTS: Record<string, FiveElement> = {
  '寅': FiveElement.WOOD, '卯': FiveElement.WOOD,
  '巳': FiveElement.FIRE, '午': FiveElement.FIRE,
  '申': FiveElement.METAL, '酉': FiveElement.METAL,
  '亥': FiveElement.WATER, '子': FiveElement.WATER,
  '辰': FiveElement.EARTH, '戌': FiveElement.EARTH, 
  '丑': FiveElement.EARTH, '未': FiveElement.EARTH,
};
