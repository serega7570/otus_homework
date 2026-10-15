/** @jest-environment jsdom */
import { createAppStore } from './store';
import { appInitialized, profileReceived, signedIn, signedOut, tokenReceived, type Profile } from './sessionSlice';
import { initializeApplication } from './thunks';
import { TOKEN_STORAGE_KEY } from './tokenStorage';

const profile: Profile = { id: '1', name: 'Анна', email: 'user@example.com', commandId: 'test', signUpDate: '' };
const fakeStorage = (initial: string | null = null) => {
  let value = initial;
  return {
    getItem: jest.fn(() => value),
    setItem: jest.fn((_key: string, token: string) => { value = token; }),
    removeItem: jest.fn(() => { value = null; }),
  };
};
describe('server session store', () => {
  it('starts without a fabricated profile or local operations', () => {
    const store = createAppStore();
    expect(store.getState().auth).toEqual({ initialized: false, token: null, profile: null });
    expect(store.getState()).not.toHaveProperty('operations');
  });
  it('restores a token once and waits for the server profile', () => {
    const storage = fakeStorage('server-token');
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    expect(store.getState().auth).toEqual({ initialized: true, token: 'server-token', profile: null });
    store.dispatch(profileReceived({ token: 'server-token', profile }));
    store.dispatch(initializeApplication());
    store.dispatch(appInitialized(null));
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.profile).toEqual(profile);
    expect(storage.setItem).not.toHaveBeenCalled();
  });
  it.each([null, '', '   '])('initializes as a guest for an absent token: %p', (token) => {
    const store = createAppStore(fakeStorage(token));
    store.dispatch(initializeApplication());
    expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
  });
  it('persists only the real token and clears the previous profile on token changes', () => {
    const storage = fakeStorage();
    const store = createAppStore(storage);
    store.dispatch(signedIn('first'));
    store.dispatch(profileReceived({ token: 'first', profile }));
    store.dispatch(signedIn('second'));
    expect(storage.setItem).toHaveBeenLastCalledWith(TOKEN_STORAGE_KEY, 'second');
    expect(store.getState().auth.profile).toBeNull();
    store.dispatch(profileReceived({ token: 'first', profile }));
    expect(store.getState().auth.profile).toBeNull();
  });
  it('preserves the profile for an identical token but clears it on cross-tab replacement', () => {
    const storage = fakeStorage('first');
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    store.dispatch(profileReceived({ token: 'first', profile }));
    store.dispatch(tokenReceived('first'));
    expect(store.getState().auth.profile).toEqual(profile);
    store.dispatch(tokenReceived('second'));
    expect(store.getState().auth.profile).toBeNull();
    expect(storage.setItem).not.toHaveBeenCalled();
  });
  it('clears credentials and the persisted key on sign-out', () => {
    const storage = fakeStorage('first');
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    store.dispatch(profileReceived({ token: 'first', profile }));
    store.dispatch(signedOut());
    expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
    expect(storage.removeItem).toHaveBeenCalledWith(TOKEN_STORAGE_KEY);
  });
  it('handles unavailable storage', () => {
    const fail = () => { throw new Error('Storage unavailable'); };
    const store = createAppStore({ getItem: fail, setItem: fail, removeItem: fail });
    expect(() => store.dispatch(initializeApplication())).not.toThrow();
    expect(() => store.dispatch(signedIn('server-token'))).not.toThrow();
    expect(store.getState().auth.token).toBe('server-token');
    expect(() => store.dispatch(signedOut())).not.toThrow();
  });
});
