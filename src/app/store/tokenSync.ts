import { tokenReceived } from './sessionSlice';
import { getBrowserStorage, readToken, TOKEN_STORAGE_KEY } from './tokenStorage';
import { initializeApplication } from './thunks';
import type { AppStore } from './store';

export const startTokenSync = (store: AppStore, target: Window): (() => void) => {
  const storage = getBrowserStorage(target);
  const receive = (event: StorageEvent): void => {
    if (!storage || event.storageArea !== storage || (event.key !== TOKEN_STORAGE_KEY && event.key !== null)) return;
    // Read the current value: queued events from concurrent tab updates can be stale.
    store.dispatch(tokenReceived(readToken(storage)));
  };
  target.addEventListener('storage', receive);
  if (!store.getState().auth.initialized) store.dispatch(initializeApplication());
  else store.dispatch(tokenReceived(readToken(storage)));
  return () => target.removeEventListener('storage', receive);
};
