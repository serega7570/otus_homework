export const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object';
export const serverErrors = (data: unknown): Record<string, unknown>[] =>
  isRecord(data) && Array.isArray(data.errors) ? data.errors.filter(isRecord) : [];
export const hasErrorCode = (data: unknown, code: string): boolean =>
  serverErrors(data).some((error) => isRecord(error.extensions) && error.extensions.code === code);

export const getApiErrors = (error: unknown): { fields: Record<string, string>; general: string[] } => {
  const fields: Record<string, string> = {};
  const general: string[] = [];
  for (const entry of serverErrors(isRecord(error) ? error.data : undefined)) {
    const code = isRecord(entry.extensions) ? entry.extensions.code : undefined;
    const message = typeof entry.message === 'string' ? entry.message : '';
    const mongooseField = /Path `([^`]+)`/.exec(message)?.[1];
    const invalidNickname = code === 'ERR_VALIDATION_ERROR' && /is not valid nickname/i.test(message);
    const field = typeof entry.fieldName === 'string' ? entry.fieldName : invalidNickname ? 'name' : mongooseField;
    const text = code === 'ERR_INCORRECT_EMAIL_OR_PASSWORD' ? 'server.errors.credentials' :
      code === 'ERR_AUTH' ? 'server.errors.session' :
      code === 'ERR_INTERNAL_SERVER' ? 'signup.errors.server' :
      code === 'ERR_NOT_ALLOWED' ? 'server.errors.denied' :
      code === 'ERR_NOT_FOUND' ? 'server.errors.notFound' :
      invalidNickname ? 'server.errors.nickname' :
      code === 'ERR_FIELD_REQUIRED' || /is required/i.test(message) ? 'forms.errors.required' :
      message || 'server.errors.unknown';
    if (field) fields[field] ??= text;
    else if (!general.includes(text)) general.push(text);
  }
  if (!Object.keys(fields).length && !general.length) {
    const status = isRecord(error) ? error.status : undefined;
    general.push(status === 'FETCH_ERROR' ? 'signup.errors.network' : status === 'TIMEOUT_ERROR' ? 'signup.errors.timeout' : 'server.errors.unknown');
  }
  return { fields, general };
};
