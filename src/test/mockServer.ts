import type { Profile, Product, ServerOperation, Order, Category } from '../shared/api/types';

export const testProfile: Profile = { id: 'user-1', name: 'Анна', email: 'user@example.com', commandId: 'test-team', signUpDate: '2026-10-15T00:00:00.000Z' };
export const testCategory: Category = { id: 'category-1', name: 'Покупки' };
export const testOperations = Array.from({ length: 7 }, (_, index): ServerOperation => ({
  id: `operation-${index + 1}`, name: `Операция ${index + 1}`, amount: 100 + index, type: 'Cost', desc: 'Описание',
  date: '2026-10-14T00:00:00.000Z', createdAt: '2026-10-15T00:00:00.000Z', category: testCategory,
}));
export const testProducts = Array.from({ length: 7 }, (_, index): Product => ({ id: `product-${index + 1}`, name: `Товар ${index + 1}`, price: 100 + index, category: testCategory }));
export const errorResponse = (code: string, message: string, fieldName?: string) => Response.json({
  errors: [{ extensions: { code }, message, fieldName, stack: 'PRIVATE STACK' }],
}, { status: 400 });

export const createMockServer = () => {
  const state = { profile: { ...testProfile }, operations: [...testOperations], products: [...testProducts], categories: [testCategory], orders: [] as Order[] };
  const requests: Request[] = [];
  const overrides = new Map<string, (request: Request) => Response | Promise<Response>>();
  const transport: typeof fetch = async (input, init) => {
    const request = input instanceof Request ? input.clone() : new Request(input, init);
    requests.push(request.clone());
    const url = new URL(request.url);
    const route = url.pathname.replace('/api/', '');
    const override = overrides.get(`${request.method} ${route}`);
    if (override) return override(request);
    if (route === 'signin') {
      const body = await request.json();
      return body.email === 'user@example.com' && body.password === 'password8' ? Response.json({ token: 'server-token', profile: { password: 'SECRET_HASH' } }) : errorResponse('ERR_INCORRECT_EMAIL_OR_PASSWORD', 'Wrong credentials');
    }
    if (request.headers.get('Authorization') !== 'Bearer server-token' && request.headers.get('Authorization') !== 'Bearer second-token') return errorResponse('ERR_AUTH', 'Invalid token');
    if (route === 'profile') {
      if (request.method === 'PUT') state.profile = { ...state.profile, ...(await request.json()) };
      return Response.json(request.headers.get('Authorization') === 'Bearer second-token' ? { ...state.profile, id: 'user-2', email: 'second@example.com' } : state.profile);
    }
    const [collection, id] = route.split('/');
    if (!['operations', 'products', 'categories', 'orders'].includes(collection)) return errorResponse('ERR_NOT_FOUND', 'Unknown route');
    const items = state[collection as 'operations' | 'products' | 'categories' | 'orders'];
    if (request.method === 'GET') {
      if (id) return Response.json(items.find((item) => item.id === id) ?? {});
      const pagination = JSON.parse(url.searchParams.get('pagination') ?? '{"pageSize":6,"pageNumber":1}');
      const start = (pagination.pageNumber - 1) * pagination.pageSize;
      return Response.json({ data: items.slice(start, start + pagination.pageSize), pagination: { ...pagination, total: items.length } });
    }
    const body = await request.json();
    const entity = { ...body, id: id ?? `${collection}-new`, category: testCategory, createdAt: '2026-10-15T00:00:00.000Z' };
    if (collection === 'orders') entity.products = body.products.map((line: { id: string; quantity: number }) => ({ product: state.products.find((p) => p.id === line.id), quantity: line.quantity }));
    // This fixture emulates a server; endpoint tests inspect exact wire payloads.
    const mutable = items as { id: string }[];
    const index = mutable.findIndex((item) => item.id === id);
    if (id && index !== -1) mutable[index] = entity;
    else mutable.unshift(entity);
    return Response.json(entity);
  };
  return { state, requests, overrides, fetch: transport };
};
