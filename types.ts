export enum Gender {
  MALE = '乾',
  FEMALE = '坤',
}

export enum FiveElement {
  WOOD = '木',
  FIRE = '火',
  EARTH = '土',
  METAL = '金',
  WATER = '水',
}

export enum Brightness {
  MIAO = '庙',
  WANG = '旺',
  DE = '得',
  LI = '利',
  PING = '平',
  BU = '不',
  XIAN = '陷',
}

export enum StarType {
  MAJOR = 'MAJOR', // 14 Main
  AUXILIARY = 'AUX', // Ji Xiong
  MINOR = 'MINOR',
}

export interface Star {
  name: string;
  type: StarType;
  brightness?: Brightness;
  siHua?: '禄' | '权' | '科' | '忌';
  isLuck?: boolean; // Lucky star
  isBad?: boolean; // Bad star
  color?: string;
}

export interface PalaceData {
  index: number; // 0-11, 0 is Zi, 1 is Chou...
  earthlyBranch: string; // 子丑寅...
  heavenlyStem: string; // 甲乙...
  name: string; // 命宫, 父母宫...
  majorStars: Star[];
  minorStars: Star[];
  ageRange: string; // 2-11
  yearStar?: string; // For Liu Nian
}

export interface BaZi {
  year: string; // GanZhi
  month: string;
  day: string;
  hour: string;
  fiveElements: Record<FiveElement, number>;
}

export interface UserProfile {
  name: string;
  gender: Gender;
  birthDate: Date;
  isSolar: boolean; // True if input is solar
}

export type ViewMode = 'NATAL' | 'DECADE' | 'YEARLY';
