import type { ReactNode } from 'react';
import type { Operation } from '../../homeworks/ts1/3_write';
import { useIntersectionLoadMore } from '../../shared/lib/useIntersectionLoadMore';
import { OperationList } from './OperationList';
import { OperationFeedView } from './OperationFeedView';
import { useOperationFeed } from './useOperationFeed';

export type OperationFeedProps = Readonly<{
  initialCount?: number;
  batchSize?: number;
  autoLoad?: boolean;
  renderOperations?: (operations: ReadonlyArray<Operation>) => ReactNode;
}>;

export const OperationFeed = ({
  initialCount = 6,
  batchSize = 6,
  autoLoad = true,
  renderOperations,
}: OperationFeedProps): JSX.Element => {
  const { operations, loadMore } = useOperationFeed(initialCount, batchSize);
  const sentinelRef = useIntersectionLoadMore({
    enabled: autoLoad,
    revision: operations.length,
    onLoadMore: loadMore,
  });

  return (
    <OperationFeedView count={operations.length} autoLoad={autoLoad} onLoadMore={loadMore} sentinelRef={sentinelRef}>
      {renderOperations ? renderOperations(operations) : <OperationList operations={operations} />}
    </OperationFeedView>
  );
};
