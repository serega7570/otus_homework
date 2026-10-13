import type { ReactNode, RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import '../../shared/ui/components.css';
import './operation.css';

export type OperationFeedViewProps = Readonly<{
  count: number;
  autoLoad: boolean;
  onLoadMore: () => void;
  sentinelRef: RefObject<HTMLDivElement>;
  children: ReactNode;
}>;

export const OperationFeedView = ({
  count, autoLoad, onLoadMore, sentinelRef, children,
}: OperationFeedViewProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="operation-feed">
      <div className="operation-feed__toolbar">
        <p className="operation-feed__count" role="status">
          {t('operationList.count', { count })}
        </p>
        <button className="ui-button" type="button" onClick={onLoadMore}>
          {t('operationList.showMore')}
        </button>
      </div>
      {children}
      <div ref={sentinelRef} className="operation-feed__sentinel" aria-hidden="true" />
      {autoLoad && <p className="operation-feed__hint">{t('operationList.hint')}</p>}
    </div>
  );
};
