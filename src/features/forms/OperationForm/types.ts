import type { Category } from '../../../homeworks/ts1/3_write';
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
