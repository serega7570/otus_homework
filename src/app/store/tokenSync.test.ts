/** @jest-environment jsdom */
import { createAppStore } from './store';
import { startTokenSync } from './tokenSync';
import { TOKEN_STORAGE_KEY } from './tokenStorage';
import { profileUpdated, signedOut } from './sessionSlice';

describe('token storage synchronization', () => {
  let stop: (() => void) | undefined;
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  afterEach(() => { stop?.(); stop = undefined; jest.restoreAllMocks(); localStorage.clear(); });
  const emit = (key: string | null, newValue: string | null, storageArea = localStorage) => {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea }));
  };

  it('restores startup state, applies another tab token change and does not write it back', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'first');
    const store = createAppStore(localStorage);
    stop = startTokenSync(store, window);
    expect(store.getState().auth.token).toBe('first');
    store.dispatch(profileUpdated({ name: 'Анна', about: '' }));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'second');
    const write = jest.spyOn(Storage.prototype, 'setItem');
    emit(TOKEN_STORAGE_KEY, 'second');
    expect(store.getState().auth).toMatchObject({ token: 'second', profile: { name: 'Сергей' } });
    expect(write).not.toHaveBeenCalled();
  });

  it.each(['removeItem', 'clear'] as const)('clears token and profile on another tab %s', (method) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'first');
    const store = createAppStore(localStorage);
    stop = startTokenSync(store, window);
    if (method === 'clear') localStorage.clear();
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
    emit(method === 'clear' ? null : TOKEN_STORAGE_KEY, null);
    expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
  });

  it('ignores other keys and sessionStorage events', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'first');
    const store = createAppStore(localStorage);
    stop = startTokenSync(store, window);
    localStorage.setItem(TOKEN_STORAGE_KEY, 'second');
    emit('unrelated-key', 'other');
    sessionStorage.setItem(TOKEN_STORAGE_KEY, 'session-token');
    emit(TOKEN_STORAGE_KEY, 'session-token', sessionStorage);
    expect(store.getState().auth.token).toBe('first');
  });

  it('reads the latest stored value rather than applying a stale queued event', () => {
    const store = createAppStore(localStorage);
    stop = startTokenSync(store, window);
    localStorage.setItem(TOKEN_STORAGE_KEY, 'latest');
    emit(TOKEN_STORAGE_KEY, 'outdated');
    expect(store.getState().auth.token).toBe('latest');
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    emit(TOKEN_STORAGE_KEY, 'latest');
    expect(store.getState().auth.profile).toBeNull();
  });

  it('cleans up its listener and reconciles on reconnect without resetting initialization', () => {
    localStorage.setItem(TOKEN_STORAGE_KEY, 'first');
    const store = createAppStore(localStorage);
    stop = startTokenSync(store, window);
    stop();
    localStorage.setItem(TOKEN_STORAGE_KEY, 'second');
    emit(TOKEN_STORAGE_KEY, 'second');
    expect(store.getState().auth.token).toBe('first');
    stop = startTokenSync(store, window);
    expect(store.getState().auth).toMatchObject({ token: 'second', initialized: true });
    store.dispatch(signedOut());
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });
});
