import { Solar } from 'lunar-typescript';

/**
 * Five Elements mapping for Heavenly Stems and Earthly Branches.
 */
const ELEMENT_MAP: Record<string, string> = {
  // Heavenly Stems (천간)
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
  // Earthly Branches (지지)
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '亥': 'water', '子': 'water',
};

export interface FiveElementsCount {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface SajuResult {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  heavenlyStems: string[];
  earthlyBranches: string[];
  fiveElements: FiveElementsCount;
}

/**
 * Calculates the Four Pillars (Saju) based on birth date, time, and gender.
 * 
 * @param date - YYYY-MM-DD format
 * @param time - HH:mm format
 * @param gender - 'male' | 'female'
 * @returns SajuResult
 */
/**
 * Get color representation for each element for UI
 */
export const getElementColor = (char: string): string => {
  const element = ELEMENT_MAP[char];
  switch (element) {
    case 'wood': return '#2ecc71'; // Green
    case 'fire': return '#e74c3c'; // Red
    case 'earth': return '#f1c40f'; // Yellow
    case 'metal': return '#bdc3c7'; // White/Silver
    case 'water': return '#2c3e50'; // Black/Blue
    default: return '#000';
  }
};

export const calculateSaju = (
  date: string,
  time: string,
  _gender: 'male' | 'female'
): SajuResult => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  // 1. Create Solar instance and convert to EightChar (Saju)
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // 2. Extract pillars (Stem + Branch)
  const pillars = [
    eightChar.getYear(),  // Year
    eightChar.getMonth(), // Month
    eightChar.getDay(),   // Day
    eightChar.getTime()   // Hour (Time)
  ];

  // 3. Extract Stems and Branches separately
  const heavenlyStems = pillars.map(p => p.substring(0, 1));
  const earthlyBranches = pillars.map(p => p.substring(1, 2));

  // 4. Calculate Five Elements distribution
  const fiveElements: FiveElementsCount = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  [...heavenlyStems, ...earthlyBranches].forEach(char => {
    const element = ELEMENT_MAP[char] as keyof FiveElementsCount;
    if (element) {
      fiveElements[element]++;
    }
  });

  return {
    yearPillar: pillars[0],
    monthPillar: pillars[1],
    dayPillar: pillars[2],
    hourPillar: pillars[3],
    heavenlyStems,
    earthlyBranches,
    fiveElements
  };
};

/**
 * 사주 오행 기반 5대 행운의 숫자와 의미 추출
 */
export const getLuckyNumbersWithMeaning = (saju: SajuResult) => {
  const meanings = [
    { type: 'wood', label: '성취(木)', desc: '새로운 시작과 성장을 돕는 기운', base: [3, 8, 13, 18, 23, 28, 33, 38, 43] },
    { type: 'fire', label: '인기(火)', desc: '나를 빛나게 하고 에너지를 주는 기운', base: [2, 7, 12, 17, 22, 27, 32, 37, 42] },
    { type: 'earth', label: '안정(土)', desc: '기반을 튼튼히 하고 중심을 잡는 기운', base: [5, 10, 15, 20, 25, 30, 35, 40, 45] },
    { type: 'metal', label: '재물(金)', desc: '결실을 맺고 실속을 챙기는 명예의 기운', base: [4, 9, 14, 19, 24, 29, 34, 39, 44] },
    { type: 'water', label: '지혜(水)', desc: '위기를 극복하고 흐름을 타는 지혜의 기운', base: [1, 6, 11, 16, 21, 26, 31, 36, 41] },
  ];

  const seed = saju.heavenlyStems.join('') + saju.earthlyBranches.join('');
  
  return meanings.map((m, idx) => {
    const charCodeSum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedNumber = m.base[(charCodeSum + idx) % m.base.length];
    
    return {
      ...m,
      number: selectedNumber
    };
  });
};
