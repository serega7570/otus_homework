import type { Operation } from '../../homeworks/ts1/3_write';

export const initialOperations: Operation[] = [
  { id: 'groceries', name: 'Продукты на неделю', amount: 2400, type: 'Cost', category: { id: 'food', name: 'Food' }, createdAt: '2026-10-01T00:00:00.000Z' },
  { id: 'salary', name: 'Зарплата', amount: 85000, type: 'Profit', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-02T00:00:00.000Z' },
  { id: 'headphones', name: 'Наушники', amount: 6500, type: 'Cost', category: { id: 'tech', name: 'Technology' }, createdAt: '2026-10-03T00:00:00.000Z' },
  { id: 'lunch', name: 'Обед', amount: 650, type: 'Cost', category: { id: 'food', name: 'Food' }, createdAt: '2026-10-04T00:00:00.000Z' },
  { id: 'freelance', name: 'Разработка сайта', amount: 18000, type: 'Profit', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-05T00:00:00.000Z' },
  { id: 'internet', name: 'Интернет', amount: 900, type: 'Cost', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-06T00:00:00.000Z' },
];
