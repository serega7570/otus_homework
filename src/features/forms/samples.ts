import type { ProfileFormValues } from './ProfileForm/types';
import type { OperationFormValues } from './OperationForm/types';

export const sampleProfile: ProfileFormValues = { name: 'Сергей', about: 'Изучаю React и разрабатываю интерфейсы.' };
export const sampleOperation: OperationFormValues = {
  name: 'Покупка продуктов', desc: 'Продукты на неделю', amount: '1250.50', categoryId: 'food', type: 'Cost', date: '2026-10-13',
};
