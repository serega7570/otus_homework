import type { Category, Operation } from '../../../homeworks/ts1/3_write';
import type { OperationType } from '../../../entities/operation';

export type OperationFormValues = {
  name: string;
  desc: string;
  amount: string;
  categoryId: string;
  type: OperationType;
  date: string;
};

export const emptyOperation: OperationFormValues = { name: '', desc: '', amount: '', categoryId: '', type: 'Cost', date: '' };

export const operationCategories: ReadonlyArray<Category> = [
  { id: 'food', name: 'Food' },
  { id: 'tech', name: 'Technology' },
  { id: 'services', name: 'Services' },
];

export type OperationDraft = Omit<Operation, 'id'>;

// Called only after validateOperation has checked all required fields.
export const toOperationDraft = (values: OperationFormValues): OperationDraft => {
  const category = operationCategories.find((item) => item.id === values.categoryId);
  if (!category) throw new RangeError('Unknown operation category');
  return {
    name: values.name.trim(), desc: values.desc.trim(), amount: Number(values.amount),
    type: values.type, category, createdAt: `${values.date}T00:00:00.000Z`,
  };
};

export const toOperationFormValues = (operation: Operation): OperationFormValues => ({
  name: operation.name, desc: operation.desc ?? '', amount: String(operation.amount),
  categoryId: operation.category.id, type: operation.type, date: operation.createdAt.slice(0, 10),
});
