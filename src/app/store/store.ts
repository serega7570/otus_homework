import { configureStore, createListenerMiddleware, isAnyOf, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import { normalizeToken, sessionSlice, signedIn, signedOut } from './sessionSlice';
import { operationsSlice } from './operationsSlice';
import { TOKEN_STORAGE_KEY, type TokenStorage } from './tokenStorage';
import { signupApi } from '../../features/signup/signupApi';

export const createAppStore = (storage?: TokenStorage) => {
  const persistence = createListenerMiddleware();
  persistence.startListening({
    matcher: isAnyOf(signedIn, signedOut),
    effect: (action) => {
      if (!storage) return;
      try {
        const token = signedIn.match(action) ? normalizeToken(action.payload) : null;
        if (token) storage.setItem(TOKEN_STORAGE_KEY, token);
        else storage.removeItem(TOKEN_STORAGE_KEY);
      } catch {
        // A browser without storage can still run the in-memory demo.
      }
    },
  });
  return configureStore({
    reducer: { auth: sessionSlice.reducer, operations: operationsSlice.reducer, [signupApi.reducerPath]: signupApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: { storage } } }).prepend(persistence.middleware).concat(signupApi.middleware),
  });
};

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk = ThunkAction<void, RootState, { storage?: TokenStorage }, UnknownAction>;
