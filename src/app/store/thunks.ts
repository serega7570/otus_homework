import { appInitialized } from './sessionSlice';
import { readToken } from './tokenStorage';
import type { AppThunk } from './store';

export const initializeApplication = (): AppThunk => (dispatch, getState, { storage }) => {
  if (getState().auth.initialized) return;
  dispatch(appInitialized(readToken(storage)));
};
