import { useFormik, type FormikConfig, type FormikValues } from 'formik';
import type { FormEvent } from 'react';

type ConsoleFormOptions<Values extends FormikValues> = {
  label: string;
  initialValues: Values;
  emptyValues: Values;
  validate: FormikConfig<Values>['validate'];
  formatValues?: (values: Values) => unknown;
  onValidSubmit?: (values: Values) => void;
};

// Every form follows the homework contract: validate, log, then clear, including edit mode.
export const useConsoleForm = <Values extends FormikValues>({
  label, initialValues, emptyValues, validate, formatValues, onValidSubmit,
}: ConsoleFormOptions<Values>) => {
  const form = useFormik<Values>({
    initialValues,
    enableReinitialize: true,
    validate,
    onSubmit: (values, { resetForm }) => {
      console.log(label, formatValues ? formatValues(values) : values);
      resetForm({ values: { ...emptyValues }, status: 'forms.submitted' });
      onValidSubmit?.(values);
    },
  });
  return {
    ...form,
    handleSubmit: (event?: FormEvent<HTMLFormElement>): void => {
      form.setStatus(undefined);
      form.handleSubmit(event);
    },
  };
};
