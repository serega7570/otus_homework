import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createRandomOperation, type Operation } from '../../homeworks/ts1/3_write';
import { OperationList } from './OperationList';
import '../../shared/ui/components.css';
import './operation.css';

export type OperationFeedProps = Readonly<{
  initialCount?: number;
  batchSize?: number;
  autoLoad?: boolean;
}>;

const createOperations = (count: number): Operation[] => {
  const createdAt = new Date().toISOString();
  return Array.from({ length: count }, () => createRandomOperation(createdAt));
};

export const OperationFeed = ({
  initialCount = 6,
  batchSize = 6,
  autoLoad = true,
}: OperationFeedProps): JSX.Element => {
  const { t } = useTranslation();
  const [operations, setOperations] = useState(() => createOperations(initialCount));
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    // Generate outside the updater: React StrictMode can invoke updaters twice.
    const nextOperations = createOperations(batchSize);
    setOperations((current) => [...current, ...nextOperations]);
  }, [batchSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!autoLoad || !sentinel || typeof IntersectionObserver === 'undefined') return;

    let active = true;
    let requested = false;
    const observer = new IntersectionObserver((entries) => {
      if (!active || requested || !entries.some((entry) => entry.isIntersecting)) return;
      requested = true;
      loadMore();
    }, { rootMargin: '0px 0px 160px 0px' });

    observer.observe(sentinel);
    return () => {
      active = false;
      observer.disconnect();
    };
    // Reobserve the sentinel after a batch moves it below the new cards.
  }, [autoLoad, loadMore, operations.length]);

  return (
    <div className="operation-feed">
      <div className="operation-feed__toolbar">
        <p className="operation-feed__count" role="status">
          {t('operationList.count', { count: operations.length })}
        </p>
        <button className="ui-button" type="button" onClick={loadMore}>
          {t('operationList.showMore')}
        </button>
      </div>
      <OperationList operations={operations} />
      <div ref={sentinelRef} className="operation-feed__sentinel" aria-hidden="true" />
      {autoLoad && <p className="operation-feed__hint">{t('operationList.hint')}</p>}
    </div>
  );
};
