/** @jest-environment ./src/test/FetchEnvironment.cjs */
import { createAppStore } from '../../app/store/store';
import { appInitialized, tokenReceived } from '../../app/store/sessionSlice';
import { serverApi } from './serverApi';
import { createMockServer, errorResponse, testProfile } from '../../test/mockServer';

const nativeFetch = globalThis.fetch;
let backend: ReturnType<typeof createMockServer>;
let store: ReturnType<typeof createAppStore>;
beforeEach(() => { backend = createMockServer(); globalThis.fetch = backend.fetch; store = createAppStore(); store.dispatch(appInitialized('server-token')); });
afterEach(() => { store.dispatch(serverApi.util.resetApiState()); globalThis.fetch = nativeFetch; });

it('ignores a stale profile response after another tab replaces the session', async () => {
  let complete!: (response: Response) => void;
  backend.overrides.set('GET profile', () => new Promise((resolve) => { complete = resolve; }));
  const oldRequest = store.dispatch(serverApi.endpoints.profile.initiate('server-token'));
  while (!complete) await Promise.resolve();
  store.dispatch(tokenReceived('second-token'));
  backend.overrides.delete('GET profile');
  const next = await store.dispatch(serverApi.endpoints.profile.initiate('second-token')).unwrap();
  complete(Response.json(testProfile));
  await oldRequest;
  expect(next.email).toBe('second@example.com');
  expect(store.getState().auth.token).toBe('second-token');
  expect(JSON.stringify(store.getState().serverApi)).not.toContain('user@example.com');
});
it('does not log out a new session when an old request fails with ERR_AUTH', async () => {
  let complete!: (response: Response) => void;
  backend.overrides.set('GET profile', () => new Promise((resolve) => { complete = resolve; }));
  const oldRequest = store.dispatch(serverApi.endpoints.profile.initiate('server-token'));
  while (!complete) await Promise.resolve();
  store.dispatch(tokenReceived('second-token'));
  complete(errorResponse('ERR_AUTH', 'Old token expired'));
  await oldRequest;
  expect(store.getState().auth.token).toBe('second-token');
});
it('rejects malformed login success and strips the server password hash from valid success', async () => {
  backend.overrides.set('POST signin', () => Response.json({ token: '' }));
  const invalid = await store.dispatch(serverApi.endpoints.signin.initiate({ email: 'user@example.com', password: 'password8' }));
  expect(invalid).toHaveProperty('error');
  backend.overrides.delete('POST signin');
  const valid = await store.dispatch(serverApi.endpoints.signin.initiate({ email: 'user@example.com', password: 'password8' })).unwrap();
  expect(valid).toEqual({ token: 'server-token' });
  expect(JSON.stringify(store.getState())).not.toMatch(/password8|SECRET_HASH/);
});
it('treats an error envelope with HTTP 200 as an error', async () => {
  backend.overrides.set('GET profile', () => Response.json({ errors: [{ extensions: { code: 'ERR_INTERNAL_SERVER' }, message: 'Internal error' }] }));
  const result = await store.dispatch(serverApi.endpoints.profile.initiate('server-token'));
  expect(result.isError).toBe(true);
  expect(store.getState().auth.token).toBe('server-token');
});
it('clears private caches on a received token and retains them for an identical token', async () => {
  await store.dispatch(serverApi.endpoints.operations.initiate('server-token')).unwrap();
  expect(JSON.stringify(store.getState().serverApi)).toContain('Операция 1');
  store.dispatch(tokenReceived('server-token'));
  expect(JSON.stringify(store.getState().serverApi)).toContain('Операция 1');
  store.dispatch(tokenReceived('second-token'));
  expect(JSON.stringify(store.getState().serverApi)).not.toContain('Операция 1');
});
