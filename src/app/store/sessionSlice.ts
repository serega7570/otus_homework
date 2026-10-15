import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Profile = { id: string; name: string; email: string; signUpDate: string; commandId: string };
export type SessionState = { token: string | null; initialized: boolean; profile: Profile | null };
const initialState: SessionState = { token: null, initialized: false, profile: null };

export const normalizeToken = (token: string | null): string | null => token?.trim() || null;

const applyToken = (state: SessionState, value: string | null): void => {
  const token = normalizeToken(value);
  if (state.token === token) return;
  state.token = token;
  state.profile = null;
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
    profileReceived: (state, action: PayloadAction<{ token: string; profile: Profile }>) => {
      if (state.token === action.payload.token) state.profile = action.payload.profile;
    },
  },
});

export const { appInitialized, signedIn, signedOut, tokenReceived, profileReceived } = sessionSlice.actions;
