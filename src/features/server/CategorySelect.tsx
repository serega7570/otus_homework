import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/store/hooks';
import { useCategoriesInfiniteQuery, useCreateCategoryMutation } from '../../shared/api/serverApi';
import { useApiForm } from './useApiForm';
import { FormField } from '../forms/FormField';
import { ApiError, FormFeedback } from './Feedback';
import { uniqueItems } from './Pagination';
import type { Category } from '../../shared/api/types';

// Kept outside the entity form: creating a category must not submit its parent.
export const CategoryManager = (): JSX.Element => {
  const { t } = useTranslation();
  const [create] = useCreateCategoryMutation();
  const form = useApiForm({ name: '' }, async (values) => { await create(values).unwrap(); });
  return <details className="server-category">
    <summary>{t('server.categories.create')}</summary>
    <form className="homework-form" aria-label={t('server.categories.create')} noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)}>
      <FormField {...form.getFieldProps('name')} label={t('server.categories.name')} disabled={form.isSubmitting} error={form.errors.name} />
      <FormFeedback status={form.status} />
      <button type="submit" className="ui-button" disabled={form.isSubmitting}>{t('server.categories.create')}</button>
    </form>
  </details>;
};

export const CategorySelect = ({ value, onChange, onBlur, error, disabled, selectedCategory }: {
  value: string; onChange: React.ChangeEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>; error?: string; disabled?: boolean; selectedCategory?: Category;
}): JSX.Element => {
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.auth.token)!;
  const query = useCategoriesInfiniteQuery(token);
  const categories = uniqueItems(query.currentData?.pages);
  if (selectedCategory && !categories.some((category) => category.id === selectedCategory.id)) categories.push(selectedCategory);
  return <div>
    <FormField name="categoryId" value={value} onChange={onChange} onBlur={onBlur} error={error} disabled={disabled || query.isLoading}
      label={t('forms.operation.category')} options={[
        { value: '', label: t('forms.operation.chooseCategory') },
        ...categories.map((category) => ({ value: category.id, label: category.name })),
      ]} />
    <ApiError error={query.error} retry={() => { void query.refetch(); }} />
    {query.hasNextPage && <button type="button" className="ui-button" disabled={query.isFetching} onClick={() => { void query.fetchNextPage(); }}>{t('server.categories.more')}</button>}
  </div>;
};
