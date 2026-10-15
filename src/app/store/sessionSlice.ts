import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'user' | 'admin';
export type Profile = { name: string; about: string; email: string; role: UserRole };
export type SessionState = { token: string | null; initialized: boolean; profile: Profile | null };
const initialState: SessionState = { token: null, initialized: false, profile: null };

export const normalizeToken = (token: string | null): string | null => token?.trim() || null;

export const createDemoToken = (email: string, mode: 'login' | 'register'): string => JSON.stringify({
  kind: 'otus-demo', email: email.trim().toLowerCase(),
  role: mode === 'login' && email.trim().toLowerCase() === 'admin@example.com' ? 'admin' : 'user',
  id: crypto.randomUUID(),
});

const createFakeProfile = (token: string): Profile => {
  let email = 'user@example.com';
  let role: UserRole = 'user';
  try {
    const data: unknown = JSON.parse(token);
    if (data && typeof data === 'object' && 'kind' in data && data.kind === 'otus-demo' && 'email' in data && typeof data.email === 'string') {
      email = data.email;
      if ('role' in data && data.role === 'admin' && email === 'admin@example.com') role = 'admin';
    }
  } catch { /* An arbitrary nonempty token still represents a fake regular user. */ }
  return { name: 'Сергей', about: 'Изучаю React и разрабатываю интерфейсы.', email, role };
};

const applyToken = (state: SessionState, value: string | null): void => {
  const token = normalizeToken(value);
  if (state.token === token) return;
  state.token = token;
  state.profile = token ? createFakeProfile(token) : null;
};

export const sessionSlice = createSlice({
  name: 'auth', initialState,
  reducers: {
    appInitialized: (state, action: PayloadAction<string | null>) => {
      if (state.initialized) return;
      applyToken(state, action.payload);
      state.initialized = true;
    },
    signedIn: (state, action: PayloadAction<string>) => { applyToken(state, action.payload); },
    signedOut: (state) => { applyToken(state, null); },
    tokenReceived: (state, action: PayloadAction<string | null>) => { applyToken(state, action.payload); },
    profileUpdated: (state, action: PayloadAction<Pick<Profile, 'name' | 'about'>>) => {
      if (state.profile) {
        state.profile.name = action.payload.name;
        state.profile.about = action.payload.about;
      }
    },
  },
});

export const { appInitialized, signedIn, signedOut, tokenReceived, profileUpdated } = sessionSlice.actions;
