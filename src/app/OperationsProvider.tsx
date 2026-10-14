import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { Operation } from '../homeworks/ts1/3_write';
import { useOperationFeed } from '../entities/operation/useOperationFeed';

// Stable IDs make demo edit URLs usable even after a page reload.
const initialOperations: Operation[] = [
  { id: 'groceries', name: 'Продукты на неделю', amount: 2400, type: 'Cost', category: { id: 'food', name: 'Food' }, createdAt: '2026-10-01T00:00:00.000Z' },
  { id: 'salary', name: 'Зарплата', amount: 85000, type: 'Profit', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-02T00:00:00.000Z' },
  { id: 'headphones', name: 'Наушники', amount: 6500, type: 'Cost', category: { id: 'tech', name: 'Technology' }, createdAt: '2026-10-03T00:00:00.000Z' },
  { id: 'lunch', name: 'Обед', amount: 650, type: 'Cost', category: { id: 'food', name: 'Food' }, createdAt: '2026-10-04T00:00:00.000Z' },
  { id: 'freelance', name: 'Разработка сайта', amount: 18000, type: 'Profit', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-05T00:00:00.000Z' },
  { id: 'internet', name: 'Интернет', amount: 900, type: 'Cost', category: { id: 'services', name: 'Services' }, createdAt: '2026-10-06T00:00:00.000Z' },
];

const OperationsContext = createContext<ReturnType<typeof useOperationFeed> | null>(null);

export const OperationsProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { operations, loadMore, addOperation, updateOperation } = useOperationFeed(6, 6, initialOperations);
  const value = useMemo(() => ({ operations, loadMore, addOperation, updateOperation }), [operations, loadMore, addOperation, updateOperation]);
  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
};

export const useOperations = () => {
  const context = useContext(OperationsContext);
  if (!context) throw new Error('useOperations must be used inside OperationsProvider');
  return context;
};
