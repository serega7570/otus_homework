/** @jest-environment jsdom */
import { createAppStore } from './store';
import { appInitialized, createDemoToken, profileUpdated, signedIn, signedOut, tokenReceived } from './sessionSlice';
import { initializeApplication, loadMoreOperations, saveOperation, signIn } from './thunks';
import { TOKEN_STORAGE_KEY } from './tokenStorage';
import type { OperationDraft } from '../../features/forms/OperationForm/types';

const fakeStorage = (initial: string | null = null) => {
  let value = initial;
  return {
    getItem: jest.fn(() => value),
    setItem: jest.fn((_key: string, token: string) => { value = token; }),
    removeItem: jest.fn(() => { value = null; }),
  };
};
const draft: OperationDraft = { name: 'Покупка', desc: 'Продукты', amount: 123.45, type: 'Cost', category: { id: 'food', name: 'Food' }, createdAt: '2026-10-14T00:00:00.000Z' };

describe('Redux application store', () => {
  it('starts uninitialized with no session and a list of operations', () => {
    const store = createAppStore();
    expect(store.getState().auth).toEqual({ initialized: false, token: null, profile: null });
    expect(store.getState().operations.items).toHaveLength(6);
  });

  it('restores a stored token and initializes only once, preserving profile updates', () => {
    const storage = fakeStorage('arbitrary-token');
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    expect(store.getState().auth).toMatchObject({ initialized: true, token: 'arbitrary-token', profile: { role: 'user' } });
    store.dispatch(profileUpdated({ name: 'Анна', about: 'React' }));
    store.dispatch(initializeApplication());
    store.dispatch(appInitialized(null));
    expect(storage.getItem).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.profile?.name).toBe('Анна');
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it.each([null, '', '   '])('initializes as a guest for an absent or blank token: %p', (token) => {
    const store = createAppStore(fakeStorage(token));
    store.dispatch(initializeApplication());
    expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
  });

  it('creates unique demo tokens, persists them and derives profiles without storing passwords', () => {
    const storage = fakeStorage();
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    store.dispatch(signIn(' USER@Example.com ', 'login'));
    const firstToken = store.getState().auth.token;
    expect(store.getState().auth.profile).toMatchObject({ email: 'user@example.com', role: 'user' });
    expect(storage.setItem).toHaveBeenLastCalledWith(TOKEN_STORAGE_KEY, firstToken);
    store.dispatch(signIn(' ADMIN@EXAMPLE.COM ', 'login'));
    expect(store.getState().auth.profile).toMatchObject({ email: 'admin@example.com', role: 'admin' });
    expect(store.getState().auth.token).not.toBe(firstToken);
    expect(Object.keys(JSON.parse(store.getState().auth.token!))).not.toContain('password');
  });

  it('registration never grants administrator privileges, including the demo administrator email', () => {
    const store = createAppStore();
    store.dispatch(signIn('admin@example.com', 'register'));
    expect(store.getState().auth.profile?.role).toBe('user');
  });

  it('clears the token, profile and persisted key on sign-out without resetting initialization', () => {
    const storage = fakeStorage('old');
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    store.dispatch(signedOut());
    expect(store.getState().auth).toEqual({ initialized: true, token: null, profile: null });
    expect(storage.removeItem).toHaveBeenCalledWith(TOKEN_STORAGE_KEY);
  });

  it('applies received tokens atomically, recreates the profile and does not write back to storage', () => {
    const storage = fakeStorage();
    const store = createAppStore(storage);
    store.dispatch(initializeApplication());
    store.dispatch(tokenReceived(createDemoToken('admin@example.com', 'login')));
    store.dispatch(profileUpdated({ name: 'Изменённое имя', about: '' }));
    store.dispatch(tokenReceived(createDemoToken('other@example.com', 'login')));
    expect(store.getState().auth.profile).toMatchObject({ name: 'Сергей', email: 'other@example.com', role: 'user' });
    store.dispatch(tokenReceived(null));
    expect(store.getState().auth.profile).toBeNull();
    expect(store.getState().auth.token).toBeNull();
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it('keeps edited profile data when receiving the same token again', () => {
    const store = createAppStore();
    store.dispatch(appInitialized('token'));
    store.dispatch(profileUpdated({ name: 'Анна', about: 'React' }));
    const before = store.getState().auth;
    store.dispatch(tokenReceived('token'));
    expect(store.getState().auth).toBe(before);
  });

  it.each(['invalid-json', 'null', '123', '{"role":"admin"}', '{"kind":"otus-demo","role":"admin","email":"user@example.com"}'])('handles arbitrary tokens without granting admin access: %s', (token) => {
    const store = createAppStore();
    store.dispatch(appInitialized(token));
    expect(store.getState().auth.profile?.role).toBe('user');
  });

  it('does not create a profile by submitting profile updates as a guest', () => {
    const store = createAppStore();
    store.dispatch(profileUpdated({ name: 'Анна', about: '' }));
    expect(store.getState().auth.profile).toBeNull();
  });

  it('handles storage failures while keeping the in-memory session usable', () => {
    const fail = () => { throw new Error('Storage unavailable'); };
    const store = createAppStore({ getItem: fail, setItem: fail, removeItem: fail });
    expect(() => store.dispatch(initializeApplication())).not.toThrow();
    expect(() => store.dispatch(signIn('user@example.com', 'login'))).not.toThrow();
    expect(store.getState().auth.profile?.role).toBe('user');
    expect(() => store.dispatch(signedOut())).not.toThrow();
    expect(store.getState().auth.profile).toBeNull();
  });

  it('appends generated operations without modifying existing records', () => {
    const store = createAppStore();
    const before = store.getState().operations.items;
    store.dispatch(loadMoreOperations());
    const after = store.getState().operations.items;
    expect(after).toHaveLength(12);
    expect(after.slice(0, 6)).toEqual(before);
    expect(new Set(after.map((item) => item.id)).size).toBe(12);
    for (const item of after.slice(6)) {
      expect(item.amount).toBeGreaterThan(0);
      expect(['Cost', 'Profit']).toContain(item.type);
      expect(Number.isFinite(Date.parse(item.createdAt))).toBe(true);
    }
  });

  it.each([null, 'regular-token'])('blocks saving operations without admin rights: %p', (token) => {
    const store = createAppStore();
    store.dispatch(appInitialized(token));
    const before = store.getState().operations.items;
    store.dispatch(saveOperation(draft));
    store.dispatch(saveOperation(draft, 'groceries'));
    expect(store.getState().operations.items).toBe(before);
  });

  it('saves administrator changes, preserves IDs and does not create duplicates when editing', () => {
    const store = createAppStore();
    store.dispatch(appInitialized(createDemoToken('admin@example.com', 'login')));
    store.dispatch(saveOperation(draft));
    expect(store.getState().operations.items).toHaveLength(7);
    const created = store.getState().operations.items[0];
    expect(created).toMatchObject(draft);
    expect(created.id).toBeTruthy();
    store.dispatch(saveOperation({ ...draft, name: 'Обновлённая покупка' }, created.id));
    expect(store.getState().operations.items).toHaveLength(7);
    expect(store.getState().operations.items[0]).toMatchObject({ id: created.id, name: 'Обновлённая покупка' });
    const before = store.getState().operations.items;
    store.dispatch(saveOperation(draft, 'missing'));
    expect(store.getState().operations.items).toBe(before);
  });
});
