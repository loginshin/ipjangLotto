import { type UserData } from '../types';

export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  LAST_WEEK_ID: 'last_week_id',
  PREV_WEEK_SCORE: 'prev_week_score',
} as const;

export const storage = {
  getUserData: (): UserData | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  setUserData: (user: UserData) => {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },
  getLastWeekId: () => localStorage.getItem(STORAGE_KEYS.LAST_WEEK_ID),
  setLastWeekId: (id: string) => localStorage.setItem(STORAGE_KEYS.LAST_WEEK_ID, id),
  getPrevWeekScore: () => {
    const score = localStorage.getItem(STORAGE_KEYS.PREV_WEEK_SCORE);
    return score ? Number(score) : null;
  },
  setPrevWeekScore: (score: number) => {
    localStorage.setItem(STORAGE_KEYS.PREV_WEEK_SCORE, score.toString());
  },
  clear: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};
