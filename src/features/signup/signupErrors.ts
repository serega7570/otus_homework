type SignupField = 'email' | 'password';
export type SignupErrors = {
  fields: Partial<Record<SignupField, string>>;
  general: string[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object';

// Both transports supply { status, data }. Never render server stacks or HTML.
export const getSignupErrors = (error: unknown): SignupErrors => {
  const result: SignupErrors = { fields: {}, general: [] };
  const data = isRecord(error) ? error.data : undefined;
  const errors = isRecord(data) && Array.isArray(data.errors) ? data.errors : [];

  for (const item of errors) {
    if (!isRecord(item)) continue;
    const code = isRecord(item.extensions) ? item.extensions.code : undefined;
    const message = typeof item.message === 'string' ? item.message : '';
    let field: SignupField | undefined = item.fieldName === 'email' || item.fieldName === 'password' ? item.fieldName : undefined;
    // The deployed server omits fieldName on Mongoose validation errors.
    if (!field && code === 'ERR_VALIDATION_ERROR') {
      if (/is not valid email|Path `email`/i.test(message)) field = 'email';
      else if (/Path `password`/i.test(message)) field = 'password';
    }
    let text = message || 'signup.errors.unknown';
    if (code === 'ERR_ACCOUNT_ALREADY_EXIST') {
      field = 'email';
      text = 'signup.errors.emailExists';
    } else if (code === 'ERR_INVALID_PASSWORD') {
      field = 'password';
      text = 'signup.errors.password';
    } else if (code === 'ERR_FIELD_REQUIRED' || (code === 'ERR_VALIDATION_ERROR' && /is required/i.test(message))) {
      text = 'signup.errors.required';
    } else if (code === 'ERR_VALIDATION_ERROR' && field === 'email') {
      text = 'signup.errors.email';
    } else if (code === 'ERR_INTERNAL_SERVER') {
      text = 'signup.errors.server';
    }
    if (field) result.fields[field] ??= text;
    else if (!result.general.includes(text)) result.general.push(text);
  }

  if (!Object.keys(result.fields).length && !result.general.length) {
    const status = isRecord(error) ? error.status : undefined;
    result.general.push(status === 'FETCH_ERROR' ? 'signup.errors.network' :
      status === 'TIMEOUT_ERROR' ? 'signup.errors.timeout' : 'signup.errors.unknown');
  }
  return result;
};
