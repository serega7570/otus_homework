import { validateAuth, validateOperation, validateProfile } from './validation';
import { sampleOperation } from './samples';

it('validates profile names after trimming and bounds the optional description', () => {
  expect(validateProfile({ name: '  ', about: '' })).toEqual({ name: 'forms.errors.required' });
  expect(validateProfile({ name: 'A', about: 'x'.repeat(501) })).toEqual({ name: 'forms.errors.nameShort', about: 'forms.errors.descriptionLong' });
  expect(validateProfile({ name: 'x'.repeat(61), about: '' })).toEqual({ name: 'forms.errors.nameLong' });
  expect(validateProfile({ name: '  Anna  ', about: '' })).toEqual({});
});

it.each(['0', '-1', '1.234', '1e3', 'NaN', 'Infinity', '1000000000.01'])('rejects invalid operation amount %s', (amount) => {
  expect(validateOperation({ ...sampleOperation, amount }).amount).toBe('forms.errors.amount');
});

it('validates category, type and real calendar dates', () => {
  expect(validateOperation({ ...sampleOperation, categoryId: 'unknown', type: 'Other' as 'Cost', date: '2026-02-30' })).toEqual({
    categoryId: 'forms.errors.required', type: 'forms.errors.required', date: 'forms.errors.date',
  });
  expect(validateOperation({ ...sampleOperation, date: 'not a date' }).date).toBe('forms.errors.date');
  expect(validateOperation({ ...sampleOperation, date: '2024-02-29', amount: '0.01' })).toEqual({});
  expect(validateOperation({ ...sampleOperation, amount: '1000000000' })).toEqual({});
});

it.each(['not-an-email', 'a@b', 'a b@example.com', 'a@@example.com'])('rejects invalid email %s', (email) => {
  expect(validateAuth({ email, password: 'Password1', confirmPassword: '' }, 'login').email).toBe('forms.errors.email');
});

it('checks password length and registration strength/confirmation without trimming passwords', () => {
  const values = { email: '  anna@example.com  ', password: 'abcdefgh', confirmPassword: 'abcdefgh' };
  expect(validateAuth(values, 'login')).toEqual({});
  expect(validateAuth(values, 'register')).toEqual({ password: 'forms.errors.passwordStrength' });
  expect(validateAuth({ ...values, password: '     ' }, 'login').password).toBe('forms.errors.required');
  expect(validateAuth({ ...values, password: 'Short1' }, 'login').password).toBe('forms.errors.passwordLength');
  expect(validateAuth({ ...values, password: 'x'.repeat(129) }, 'login').password).toBe('forms.errors.passwordLength');
  expect(validateAuth({ ...values, password: ' Пароль1 ', confirmPassword: 'Пароль1' }, 'register').confirmPassword).toBe('forms.errors.passwordMismatch');
  expect(validateAuth({ ...values, password: ' Пароль1 ', confirmPassword: ' Пароль1 ' }, 'register')).toEqual({});
});
