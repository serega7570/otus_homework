import { useFormik, type FormikErrors } from 'formik';
import { useEffect, useRef } from 'react';
import { getApiErrors } from '../../shared/api/errors';

export const useApiForm = <T extends Record<string, string>>(
  initialValues: T,
  save: (values: T) => Promise<void>,
  validate?: (values: T) => FormikErrors<T>,
  onSuccess?: () => void,
) => {
  const active = useRef(false);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  return useFormik<T>({
    initialValues, validate,
    onSubmit: async (values, helpers) => {
      helpers.setStatus(undefined);
      try {
        await save(values);
        if (!active.current) return;
        helpers.setStatus({ success: true });
        onSuccess?.();
      } catch (error) {
        if (!active.current) return;
        const { fields, general } = getApiErrors(error);
        const errors: Record<string, string> = {};
        for (const [field, message] of Object.entries(fields)) {
          if (field in values) errors[field] = message;
          else general.push(message);
        }
        helpers.setErrors(errors as FormikErrors<T>);
        helpers.setStatus({ messages: general });
      }
    },
  });
};
