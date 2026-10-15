import { useTranslation } from 'react-i18next';
import { useSaveProductMutation } from '../../shared/api/serverApi';
import type { Product } from '../../shared/api/types';
import { FormField } from '../forms/FormField';
import { CategoryManager, CategorySelect } from './CategorySelect';
import { FormFeedback } from './Feedback';
import { useApiForm } from './useApiForm';

export const ProductEditor = ({ product, onSaved }: { product?: Product; onSaved: () => void }): JSX.Element => {
  const { t } = useTranslation();
  const [save] = useSaveProductMutation();
  const form = useApiForm({ name: product?.name ?? '', desc: product?.desc ?? '', price: product ? String(product.price) : '', categoryId: product?.category.id ?? '' }, async (values) => {
    await save({ id: product?.id, body: { ...values, price: Number(values.price) } }).unwrap();
  }, (values) => {
    const errors: Record<string, string> = {};
    for (const field of ['name', 'price', 'categoryId'] as const) if (!values[field].trim()) errors[field] = 'forms.errors.required';
    if (values.price && (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0)) errors.price = 'forms.errors.amount';
    return errors;
  }, onSaved);
  const title = t(product ? 'server.shop.edit' : 'server.shop.create');
  return <div className="server-editor">
    <CategoryManager />
    <form className="homework-form" noValidate aria-label={title} onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)}>
      <FormField {...form.getFieldProps('name')} label={t('server.shop.name')} disabled={form.isSubmitting} error={form.errors.name} />
      <FormField {...form.getFieldProps('price')} onChange={(event) => { void form.setFieldValue('price', event.target.value); }} label={t('server.shop.price')} type="number" min="0.01" step="0.01" disabled={form.isSubmitting} error={form.errors.price} />
      <CategorySelect {...form.getFieldProps('categoryId')} selectedCategory={product?.category} disabled={form.isSubmitting} error={form.errors.categoryId} />
      <FormField {...form.getFieldProps('desc')} label={t('forms.operation.description')} multiline disabled={form.isSubmitting} error={form.errors.desc} />
      <FormFeedback status={form.status} />
      <button className="ui-button" type="submit" disabled={form.isSubmitting}>{form.isSubmitting ? t('signup.sending') : title}</button>
    </form>
  </div>;
};
