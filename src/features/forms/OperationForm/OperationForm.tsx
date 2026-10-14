import { useTranslation } from 'react-i18next';
import { FormField } from '../FormField';
import { FormActions } from '../FormActions';
import { useConsoleForm } from '../useConsoleForm';
import { validateOperation } from '../validation';
import { emptyOperation, operationCategories, toOperationDraft, type OperationDraft, type OperationFormValues } from './types';

export type OperationFormProps = Readonly<{
  mode?: 'create' | 'edit'; initialValues?: OperationFormValues; disabled?: boolean;
  onSave?: (operation: OperationDraft) => void;
}>;

export const OperationForm = ({ mode = 'create', initialValues = emptyOperation, disabled, onSave }: OperationFormProps): JSX.Element => {
  const { t } = useTranslation();
  const form = useConsoleForm({
    label: 'OperationForm', initialValues, emptyValues: emptyOperation, validate: validateOperation,
    formatValues: (values) => ({ mode, ...toOperationDraft(values) }),
    onValidSubmit: onSave ? (values) => onSave(toOperationDraft(values)) : undefined,
  });
  const error = (field: keyof OperationFormValues): string | undefined => form.touched[field] || form.submitCount > 0 ? form.errors[field] : undefined;
  const locked = disabled || form.isSubmitting;
  return (
    <form className="homework-form" noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)} aria-label={t(`forms.operation.${mode}Title`)}>
      <FormField {...form.getFieldProps('name')} label={t('forms.operation.name')} required maxLength={100} disabled={locked} error={error('name')} />
      <div className="homework-form__row">
        <FormField {...form.getFieldProps('type')} label={t('forms.operation.type')} required disabled={locked} error={error('type')} options={[
          { value: 'Cost', label: t('forms.operation.cost') }, { value: 'Profit', label: t('forms.operation.profit') },
        ]} />
        <FormField {...form.getFieldProps('amount')} onChange={(event) => { void form.setFieldValue('amount', event.target.value); }} label={t('forms.operation.amount')} required type="number" inputMode="decimal" min="0.01" max="1000000000" step="0.01" disabled={locked} error={error('amount')} />
      </div>
      <div className="homework-form__row">
        <FormField {...form.getFieldProps('categoryId')} label={t('forms.operation.category')} required disabled={locked} error={error('categoryId')} options={[
          { value: '', label: t('forms.operation.chooseCategory') },
          ...operationCategories.map((category) => ({ value: category.id, label: t(`forms.categories.${category.id}`) })),
        ]} />
        <FormField {...form.getFieldProps('date')} label={t('forms.operation.date')} required type="date" disabled={locked} error={error('date')} />
      </div>
      <FormField {...form.getFieldProps('desc')} label={t('forms.operation.description')} multiline maxLength={500} disabled={locked} error={error('desc')} />
      <FormActions label={t(`forms.operation.${mode}Submit`)} disabled={locked} status={form.status} />
    </form>
  );
};
