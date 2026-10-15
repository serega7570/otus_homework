import { useId, type ChangeEventHandler, type FocusEventHandler, type InputHTMLAttributes, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import './forms.css';

type FormFieldProps = Readonly<{
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  error?: string;
  hint?: string;
  multiline?: boolean;
  options?: ReadonlyArray<{ value: string; label: string }>;
  inputRef?: Ref<HTMLInputElement>;
}> & Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'required' | 'disabled' | 'autoComplete' | 'maxLength' | 'min' | 'max' | 'step' | 'inputMode'>;

export const FormField = ({ label, error, hint, multiline, options, inputRef, ...props }: FormFieldProps): JSX.Element => {
  const id = useId();
  const { t } = useTranslation();
  const common = {
    id, name: props.name, value: props.value, onChange: props.onChange, onBlur: props.onBlur,
    required: props.required, disabled: props.disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined,
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label>
      {multiline ? <textarea {...common} rows={4} maxLength={props.maxLength} /> : options ? (
        <select {...common}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      ) : <input {...props} {...common} ref={inputRef} />}
      {hint && <p className="form-field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="form-field__error" id={`${id}-error`} role="alert">{t(error)}</p>}
    </div>
  );
};
