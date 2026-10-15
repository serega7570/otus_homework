import type { FormikProps } from 'formik';
import type { Ref } from 'react';

export type ProfileFormValues = { name: string; about: string };

export type ProfileFormProps = Readonly<{
  formManager: FormikProps<ProfileFormValues>;
  formElement?: Ref<HTMLFormElement>;
  autoFocusElement?: Ref<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
}>;

export const emptyProfile: ProfileFormValues = { name: '', about: '' };
