import { useTranslation } from 'react-i18next';
import { useSaveOperationMutation } from '../../shared/api/serverApi';
import type { ServerOperation } from '../../shared/api/types';
import { FormField } from '../forms/FormField';
import { CategoryManager, CategorySelect } from './CategorySelect';
import { FormFeedback } from './Feedback';
import { useApiForm } from './useApiForm';

export const ServerOperationForm = ({ operation, onSaved }: { operation?: ServerOperation; onSaved: () => void }): JSX.Element => {
  const { t } = useTranslation();
  const [save] = useSaveOperationMutation();
  const form = useApiForm({
    name: operation?.name ?? '', desc: operation?.desc ?? '', amount: operation ? String(operation.amount) : '',
    type: operation?.type ?? 'Cost', categoryId: operation?.category.id ?? '', date: operation?.date?.slice(0, 10) ?? '',
  }, async (values) => {
    await save({ id: operation?.id, body: {
      name: values.name, desc: values.desc, amount: Number(values.amount), type: values.type as 'Cost' | 'Profit',
      categoryId: values.categoryId, date: new Date(`${values.date}T00:00:00.000Z`).toISOString(),
    } }).unwrap();
  }, (values) => {
    const errors: Record<string, string> = {};
    for (const field of ['name', 'amount', 'categoryId', 'date'] as const) if (!values[field].trim()) errors[field] = 'forms.errors.required';
    if (values.amount && (!Number.isFinite(Number(values.amount)) || Number(values.amount) <= 0)) errors.amount = 'forms.errors.amount';
    if (values.date && !Number.isFinite(Date.parse(`${values.date}T00:00:00.000Z`))) errors.date = 'forms.errors.date';
    return errors;
  }, onSaved);
  const title = t(operation ? 'forms.operation.editTitle' : 'forms.operation.createTitle');
  return <div className="server-editor">
    <CategoryManager />
    <form className="homework-form" aria-label={title} noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)}>
      <FormField {...form.getFieldProps('name')} label={t('forms.operation.name')} disabled={form.isSubmitting} error={form.errors.name} />
      <div className="homework-form__row">
        <FormField {...form.getFieldProps('type')} label={t('forms.operation.type')} disabled={form.isSubmitting} options={[
          { value: 'Cost', label: t('forms.operation.cost') }, { value: 'Profit', label: t('forms.operation.profit') },
        ]} />
        <FormField {...form.getFieldProps('amount')} onChange={(event) => { void form.setFieldValue('amount', event.target.value); }} label={t('forms.operation.amount')} type="number" step="0.01" min="0.01" disabled={form.isSubmitting} error={form.errors.amount} />
      </div>
      <CategorySelect {...form.getFieldProps('categoryId')} selectedCategory={operation?.category} disabled={form.isSubmitting} error={form.errors.categoryId} />
      <FormField {...form.getFieldProps('date')} label={t('forms.operation.date')} type="date" disabled={form.isSubmitting} error={form.errors.date} />
      <FormField {...form.getFieldProps('desc')} label={t('forms.operation.description')} multiline disabled={form.isSubmitting} error={form.errors.desc} />
      <FormFeedback status={form.status} />
      <button className="ui-button" type="submit" disabled={form.isSubmitting}>{t(form.isSubmitting ? 'signup.sending' : operation ? 'forms.operation.editSubmit' : 'forms.operation.createSubmit')}</button>
    </form>
  </div>;
};
