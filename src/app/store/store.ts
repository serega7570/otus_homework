import { configureStore, createListenerMiddleware, isAnyOf, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';
import { normalizeToken, sessionSlice, signedIn, signedOut, tokenReceived } from './sessionSlice';
import { TOKEN_STORAGE_KEY, type TokenStorage } from './tokenStorage';
import { signupApi } from '../../features/signup/signupApi';
import { serverApi } from '../../shared/api/serverApi';

export const createAppStore = (storage?: TokenStorage) => {
  const persistence = createListenerMiddleware();
  persistence.startListening({
    matcher: isAnyOf(signedIn, signedOut, tokenReceived),
    effect: (_action, api) => {
      const previous = api.getOriginalState() as { auth: { token: string | null } };
      const current = api.getState() as { auth: { token: string | null } };
      if (previous.auth.token !== current.auth.token) {
        api.dispatch(serverApi.util.resetApiState());
        api.dispatch(signupApi.util.resetApiState());
      }
    },
  });
  persistence.startListening({
    matcher: isAnyOf(signedIn, signedOut),
    effect: (action) => {
      if (!storage) return;
      try {
        const token = signedIn.match(action) ? normalizeToken(action.payload) : null;
        if (token) storage.setItem(TOKEN_STORAGE_KEY, token);
        else storage.removeItem(TOKEN_STORAGE_KEY);
      } catch {
        // Storage failure must not prevent using the current in-memory session.
      }
    },
  });
  return configureStore({
    reducer: { auth: sessionSlice.reducer, [signupApi.reducerPath]: signupApi.reducer, [serverApi.reducerPath]: serverApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: { storage } } }).prepend(persistence.middleware).concat(signupApi.middleware, serverApi.middleware),
  });
};

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk = ThunkAction<void, RootState, { storage?: TokenStorage }, UnknownAction>;
