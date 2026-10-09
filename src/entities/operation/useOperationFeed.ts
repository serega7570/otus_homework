import { useCallback, useState } from 'react';
import { createRandomOperation, type Operation } from '../../homeworks/ts1/3_write';

const createOperations = (count: number): Operation[] => {
  const createdAt = new Date().toISOString();
  return Array.from({ length: count }, () => createRandomOperation(createdAt));
};

export const useOperationFeed = (initialCount: number, batchSize: number) => {
  const [operations, setOperations] = useState(() => createOperations(initialCount));

  const loadMore = useCallback(() => {
    // Keep generation outside the updater, which StrictMode can invoke twice.
    const nextOperations = createOperations(batchSize);
    setOperations((current) => [...current, ...nextOperations]);
  }, [batchSize]);

  return { operations, loadMore };
};
