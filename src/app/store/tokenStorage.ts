import { normalizeToken } from './sessionSlice';

export const TOKEN_STORAGE_KEY = 'otus-homework-token';
export type TokenStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export const getBrowserStorage = (target: Window): Storage | undefined => {
  try { return target.localStorage; } catch { return undefined; }
};

export const readToken = (storage?: TokenStorage): string | null => {
  try { return normalizeToken(storage?.getItem(TOKEN_STORAGE_KEY) ?? null); } catch { return null; }
};
