/**
 * Simple hash function to convert string seed to a number
 */
const cyrb128 = (str: string) => {
  let h1 = 1779033703, h2 = 3144134277,
      h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
      k = str.charCodeAt(i);
      h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
      h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
      h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
      h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1>>>0), (h2>>>0), (h3>>>0), (h4>>>0)];
};

const mulberry32 = (a: number) => {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/**
 * 토요일 오전 6시 기준 주차 식별자 생성
 * 매주 토요일 오전 6시에 새로운 주차가 시작됨
 */
export const getWeekId = (date: Date = new Date()): string => {
  const d = new Date(date);
  // 토요일 오전 6시 이전이면 이전 주로 간주 (6시간 뒤로 밀어서 계산)
  d.setHours(d.getHours() - 6);
  
  // 해당 시점 기준 '가장 최근 지난 토요일' 찾기
  const lastSaturday = new Date(d);
  lastSaturday.setDate(d.getDate() - ((d.getDay() + 1) % 7));
  lastSaturday.setHours(0, 0, 0, 0);
  
  return `${lastSaturday.getFullYear()}-${lastSaturday.getMonth() + 1}-${lastSaturday.getDate()}`;
};

export interface FortuneResult {
  totalScore: number;
  percentile: number;
  scores: {
    wealth: number;
    love: number;
    work: number;
    health: number;
  };
  luckyColor: string;
  lottoSets: number[][];
  dailyFluctuation: number;
}

/**
 * 개인화된 주간 운세 및 로또 생성
 * 생년월일, 성별, 주차 ID를 조합하여 고정된 결과 생성
 */
export const generateWeeklyFortune = (
  birth: string, 
  gender: string, 
  weekId: string
): FortuneResult => {
  const seedStr = `${birth}-${gender}-${weekId}`;
  const seed = cyrb128(seedStr)[0];
  const rand = mulberry32(seed);

  // 1. 세부 운세 점수 생성 (0~100)
  const wealth = Math.floor(rand() * 101);
  const love = Math.floor(rand() * 101);
  const work = Math.floor(rand() * 101);
  const health = Math.floor(rand() * 101);
  const totalScore = Math.floor((wealth + love + work + health) / 4);

  // 2. 전국 상위 % 계산 (점수가 높을수록 낮은 % = 상위권)
  const percentile = Math.max(1, 100 - Math.floor(totalScore * 0.95 + rand() * 5));

  // 3. 행운의 색상 추출
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', 
    '#FFFD33', '#33FFF3', '#000000', '#FFFFFF',
    '#8E44AD', '#E67E22', '#16A085', '#2C3E50'
  ];
  const luckyColor = colors[Math.floor(rand() * colors.length)];

  // 4. 로또 세트 수 결정 (재물운 기반)
  const setCount = wealth >= 90 ? 5 : (wealth >= 70 ? 3 : 1);
  const lottoSets: number[][] = [];
  
  for (let i = 0; i < setCount; i++) {
    const set: number[] = [];
    while (set.length < 6) {
      const n = Math.floor(rand() * 45) + 1;
      if (!set.includes(n)) set.push(n);
    }
    lottoSets.push(set.sort((a, b) => a - b));
  }

  // 5. 오늘의 미세 변동 (+/- 5%) - 주간 시드 + 오늘 날짜 조합
  const todayStr = new Date().toISOString().split('T')[0];
  const dailySeed = cyrb128(seedStr + todayStr)[0];
  const dailyRand = mulberry32(dailySeed);
  const dailyFluctuation = Math.floor(dailyRand() * 11) - 5;

  return {
    totalScore,
    percentile,
    scores: { wealth, love, work, health },
    luckyColor,
    lottoSets,
    dailyFluctuation
  };
};

/**
 * 기존 로또 번호 생성 함수 (하위 호환성 유지)
 */
export const generateLottoNumbers = (seedStr: string): number[] => {
  const seed = cyrb128(seedStr)[0];
  const rand = mulberry32(seed);
  
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const n = Math.floor(rand() * 45) + 1;
    if (!numbers.includes(n)) {
      numbers.push(n);
    }
  }
  return numbers.sort((a, b) => a - b);
};
