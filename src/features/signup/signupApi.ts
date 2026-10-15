import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// The course server also supports HTTPS, so registration works on GitHub Pages.
export const SIGNUP_API_URL = 'https://19429ba06ff2.vps.myjino.ru/api/';
export const SIGNUP_COMMAND_ID = 'otus-serega7570';
export const SIGNUP_TIMEOUT_MS = 15000;

export type SignupValues = { email: string; password: string };
export type SignupResult = { token: string };

export const createSignupBody = (values: SignupValues) => ({ ...values, commandId: SIGNUP_COMMAND_ID });

export const isSignupResult = (data: unknown): data is SignupResult =>
  typeof data === 'object' && data !== null && 'token' in data &&
  typeof data.token === 'string' && data.token.trim().length > 0 && !('errors' in data);

export const signupApi = createApi({
  reducerPath: 'signupApi',
  baseQuery: fetchBaseQuery({
    baseUrl: SIGNUP_API_URL,
    timeout: SIGNUP_TIMEOUT_MS,
    fetchFn: (input, init) => fetch(input, init),
    // Keep malformed successes and error envelopes out of the success state.
    validateStatus: (response, data) => response.ok && isSignupResult(data),
  }),
  endpoints: (build) => ({
    signup: build.mutation<SignupResult, SignupValues>({
      query: (values) => ({ url: 'signup', method: 'POST', body: createSignupBody(values) }),
      // The live server also returns a profile. Keep only the documented token.
      transformResponse: (response: SignupResult): SignupResult => ({ token: response.token }),
    }),
  }),
});

export const { useSignupMutation } = signupApi;
