import type { FormikErrors } from 'formik';
import type { ProfileFormValues } from './ProfileForm/types';
import type { OperationFormValues } from './OperationForm/types';
import { operationCategories } from './OperationForm/types';
import type { AuthFormValues, AuthMode } from './AuthForm/AuthForm';

const required = 'forms.errors.required';
const nameError = (value: string, max: number): string | undefined => {
  if (!value.trim()) return required;
  if (value.trim().length < 2) return 'forms.errors.nameShort';
  if (value.trim().length > max) return 'forms.errors.nameLong';
};

export const validateProfile = (values: ProfileFormValues): FormikErrors<ProfileFormValues> => {
  const errors: FormikErrors<ProfileFormValues> = {};
  const name = nameError(values.name, 60);
  if (name) errors.name = name;
  if (values.about.length > 500) errors.about = 'forms.errors.descriptionLong';
  return errors;
};

export const validateOperation = (values: OperationFormValues): FormikErrors<OperationFormValues> => {
  const errors: FormikErrors<OperationFormValues> = {};
  const name = nameError(values.name, 100);
  if (name) errors.name = name;
  if (values.desc.length > 500) errors.desc = 'forms.errors.descriptionLong';
  if (!values.amount.trim()) errors.amount = required;
  else if (!/^\d+(?:\.\d{1,2})?$/.test(values.amount) || !Number.isFinite(Number(values.amount)) || Number(values.amount) <= 0 || Number(values.amount) > 1_000_000_000) {
    errors.amount = 'forms.errors.amount';
  }
  if (!operationCategories.some((category) => category.id === values.categoryId)) errors.categoryId = required;
  if (values.type !== 'Cost' && values.type !== 'Profit') errors.type = required;
  if (!values.date) errors.date = required;
  else {
    const date = new Date(`${values.date}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== values.date) errors.date = 'forms.errors.date';
  }
  return errors;
};

export const validateAuth = (values: AuthFormValues, mode: AuthMode): FormikErrors<AuthFormValues> => {
  const errors: FormikErrors<AuthFormValues> = {};
  if (!values.email.trim()) errors.email = required;
  else if (values.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'forms.errors.email';
  if (!values.password.trim()) errors.password = required;
  else if (values.password.length < 8 || values.password.length > 128) errors.password = 'forms.errors.passwordLength';
  else if (mode === 'register' && (!/\p{L}/u.test(values.password) || !/\d/.test(values.password))) errors.password = 'forms.errors.passwordStrength';
  if (mode === 'register') {
    if (!values.confirmPassword) errors.confirmPassword = required;
    else if (values.confirmPassword !== values.password) errors.confirmPassword = 'forms.errors.passwordMismatch';
  }
  return errors;
};
