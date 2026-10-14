import { useCallback, useState } from 'react';
import { createRandomOperation, type Operation } from '../../homeworks/ts1/3_write';

const createOperations = (count: number): Operation[] => {
  const createdAt = new Date().toISOString();
  return Array.from({ length: count }, () => createRandomOperation(createdAt));
};

export const useOperationFeed = (initialCount: number, batchSize: number, initialOperations?: ReadonlyArray<Operation>) => {
  const [operations, setOperations] = useState(() => initialOperations ? [...initialOperations] : createOperations(initialCount));

  const loadMore = useCallback(() => {
    // Keep generation outside the updater, which StrictMode can invoke twice.
    const nextOperations = createOperations(batchSize);
    setOperations((current) => [...current, ...nextOperations]);
  }, [batchSize]);

  const addOperation = useCallback((operation: Operation) => {
    setOperations((current) => [operation, ...current]);
  }, []);

  const updateOperation = useCallback((operation: Operation) => {
    setOperations((current) => current.map((item) => item.id === operation.id ? operation : item));
  }, []);

  return { operations, loadMore, addOperation, updateOperation };
};
