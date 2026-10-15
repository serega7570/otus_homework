import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { signedOut, type SessionState } from '../../app/store/sessionSlice';
import { SIGNUP_API_URL, SIGNUP_TIMEOUT_MS, isSignupResult, type SignupResult, type SignupValues } from '../../features/signup/signupApi';
import { hasErrorCode, isRecord, serverErrors } from './errors';
import type { Category, OperationBody, Order, OrderBody, Page, Product, ProductBody, Profile, ServerOperation } from './types';

export const PAGE_SIZE = 6;
export const pageParams = (pageNumber: number, pageSize = PAGE_SIZE) => ({
  pagination: JSON.stringify({ pageSize, pageNumber }),
  sorting: JSON.stringify({ type: 'DESC', field: 'createdAt' }),
});
const rawQuery = fetchBaseQuery({
  baseUrl: SIGNUP_API_URL, timeout: SIGNUP_TIMEOUT_MS,
  fetchFn: (input, init) => fetch(input, init),
  validateStatus: (response, data) => response.ok && !serverErrors(data).length,
});
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, options) => {
  const getToken = () => (api.getState() as { auth: SessionState }).auth.token;
  const token = getToken();
  const request = typeof args === 'string' ? { url: args } : args;
  const headers = new Headers(request.headers as HeadersInit | undefined);
  if (token && api.endpoint !== 'signin') headers.set('Authorization', `Bearer ${token}`);
  const result = await rawQuery({ ...request, headers }, api, options);
  if (token !== getToken()) return { error: { status: 'CUSTOM_ERROR', error: 'Session changed' } };
  if (result.error && token && (result.error.status === 401 || hasErrorCode(result.error.data, 'ERR_AUTH'))) api.dispatch(signedOut());
  if ('data' in result) {
    const data = result.data;
    const valid = api.endpoint === 'signin' ? isSignupResult(data) :
      api.endpoint === 'profile' || api.endpoint === 'updateProfile' ? isRecord(data) && typeof data.id === 'string' && typeof data.email === 'string' :
      ['operations', 'products', 'categories', 'orders'].includes(api.endpoint) ? isRecord(data) && Array.isArray(data.data) && isRecord(data.pagination) && typeof data.pagination.total === 'number' :
      isRecord(data) && typeof data.id === 'string';
    if (!valid) return { error: { status: 'CUSTOM_ERROR', error: 'Invalid server response' } };
  }
  return result;
};
const pickProfile = (profile: Profile): Profile => ({
  id: profile.id, name: profile.name ?? '', email: profile.email, commandId: profile.commandId, signUpDate: profile.signUpDate,
});
const nextPage = <T,>(last: Page<T>, _pages: Page<T>[], page: number) =>
  last.data.length && page * last.pagination.pageSize < last.pagination.total ? page + 1 : undefined;

export const serverApi = createApi({
  reducerPath: 'serverApi', baseQuery,
  tagTypes: ['Profile', 'Operations', 'Categories', 'Products', 'Orders'],
  endpoints: (build) => ({
    signin: build.mutation<SignupResult, SignupValues>({
      query: (body) => ({ url: 'signin', method: 'POST', body }),
      transformResponse: (data: SignupResult) => ({ token: data.token }),
    }),
    profile: build.query<Profile, string>({ query: () => 'profile', transformResponse: pickProfile, providesTags: ['Profile'] }),
    updateProfile: build.mutation<Profile, { name: string }>({
      query: (body) => ({ url: 'profile', method: 'PUT', body }), transformResponse: pickProfile,
      invalidatesTags: (_result, error) => error ? [] : ['Profile'],
    }),
    categories: build.infiniteQuery<Page<Category>, string, number>({
      infiniteQueryOptions: { initialPageParam: 1, getNextPageParam: nextPage },
      query: ({ pageParam }) => ({ url: 'categories', params: pageParams(pageParam, 50) }), providesTags: ['Categories'],
    }),
    createCategory: build.mutation<Category, { name: string }>({
      query: (body) => ({ url: 'categories', method: 'POST', body }), invalidatesTags: (_result, error) => error ? [] : ['Categories'],
    }),
    operations: build.infiniteQuery<Page<ServerOperation>, string, number>({
      infiniteQueryOptions: { initialPageParam: 1, getNextPageParam: nextPage },
      query: ({ pageParam }) => ({ url: 'operations', params: pageParams(pageParam) }), providesTags: ['Operations'],
    }),
    operation: build.query<ServerOperation, { id: string; token: string }>({
      query: ({ id }) => `operations/${encodeURIComponent(id)}`, providesTags: ['Operations'],
    }),
    saveOperation: build.mutation<ServerOperation, { body: OperationBody; id?: string }>({
      query: ({ body, id }) => ({ url: id ? `operations/${encodeURIComponent(id)}` : 'operations', method: id ? 'PUT' : 'POST', body }),
      invalidatesTags: (_result, error) => error ? [] : ['Operations'],
    }),
    products: build.infiniteQuery<Page<Product>, string, number>({
      infiniteQueryOptions: { initialPageParam: 1, getNextPageParam: nextPage },
      query: ({ pageParam }) => ({ url: 'products', params: pageParams(pageParam) }), providesTags: ['Products'],
    }),
    saveProduct: build.mutation<Product, { body: ProductBody; id?: string }>({
      query: ({ body, id }) => ({ url: id ? `products/${encodeURIComponent(id)}` : 'products', method: id ? 'PUT' : 'POST', body }),
      invalidatesTags: (_result, error) => error ? [] : ['Products'],
    }),
    createOrder: build.mutation<Order, OrderBody>({
      query: (body) => ({ url: 'orders', method: 'POST', body }), invalidatesTags: (_result, error) => error ? [] : ['Orders'],
    }),
    orders: build.infiniteQuery<Page<Order>, { token: string; userId: string }, number>({
      infiniteQueryOptions: { initialPageParam: 1, getNextPageParam: nextPage },
      query: ({ pageParam, queryArg }) => ({ url: 'orders', params: { ...pageParams(pageParam), userId: JSON.stringify(queryArg.userId) } }), providesTags: ['Orders'],
    }),
  }),
});
export const {
  useSigninMutation, useProfileQuery, useUpdateProfileMutation,
  useCategoriesInfiniteQuery, useCreateCategoryMutation,
  useOperationsInfiniteQuery, useOperationQuery, useSaveOperationMutation,
  useProductsInfiniteQuery, useSaveProductMutation, useCreateOrderMutation, useOrdersInfiniteQuery,
} = serverApi;
