import { useCallback } from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OperationList } from '../entities/operation';
import { OperationFeedView } from '../entities/operation/OperationFeedView';
import { useIntersectionLoadMore } from '../shared/lib/useIntersectionLoadMore';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { loadMoreOperations } from '../app/store/thunks';

export const OperationsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const operations = useAppSelector((state) => state.operations.items);
  const isAdmin = useAppSelector((state) => state.auth.profile?.role === 'admin');
  const dispatch = useAppDispatch();
  const loadMore = useCallback(() => { dispatch(loadMoreOperations()); }, [dispatch]);
  const autoLoad = !!useMatch('/operations');
  const sentinelRef = useIntersectionLoadMore({ enabled: autoLoad, revision: operations.length, onLoadMore: loadMore });
  return (
    <section className="screen-panel" aria-labelledby="operations-title">
      <div className="screen-panel__heading">
        <h1 id="operations-title">{t('operationList.title')}</h1>
        {isAdmin && <Link className="ui-button" to="/operations/new" state={{ operationModal: true }}>{t('routing.createOperation')}</Link>}
      </div>
      <p>{t('operationList.description')}</p>
      <OperationFeedView count={operations.length} autoLoad={autoLoad} onLoadMore={loadMore} sentinelRef={sentinelRef}>
        <OperationList operations={operations} renderAction={isAdmin ? (operation) => (
          <Link to={`/operations/${encodeURIComponent(operation.id)}/edit`} state={{ operationModal: true }} aria-label={`${t('operation.edit')}: ${operation.name}`}>
            {t('operation.edit')}
          </Link>
        ) : undefined} />
      </OperationFeedView>
      <Outlet />
    </section>
  );
};
