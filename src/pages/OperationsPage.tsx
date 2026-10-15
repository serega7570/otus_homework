import { useCallback } from 'react';
import { Link, Outlet, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OperationList } from '../entities/operation';
import { useAppSelector } from '../app/store/hooks';
import { useOperationsInfiniteQuery } from '../shared/api/serverApi';
import { Pagination, uniqueItems } from '../features/server/Pagination';

export const OperationsPage = (): JSX.Element => {
  const { t } = useTranslation();
  const token = useAppSelector((state) => state.auth.token)!;
  const query = useOperationsInfiniteQuery(token);
  const operations = uniqueItems(query.currentData?.pages);
  const autoLoad = !!useMatch('/operations');
  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetching) void query.fetchNextPage();
  }, [query.hasNextPage, query.isFetching, query.fetchNextPage]);
  return <section className="screen-panel" aria-labelledby="operations-title">
    <div className="screen-panel__heading">
      <h1 id="operations-title">{t('operationList.title')}</h1>
      <Link className="ui-button" to="/operations/new" state={{ operationModal: true }}>{t('routing.createOperation')}</Link>
    </div>
    <p>{t('server.operationsDescription')}</p>
    {!query.isLoading && <OperationList operations={operations} renderAction={(operation) => (
      <Link to={`/operations/${encodeURIComponent(operation.id)}/edit`} state={{ operationModal: true }} aria-label={`${t('operation.edit')}: ${operation.name}`}>{t('operation.edit')}</Link>
    )} />}
    <Pagination count={operations.length} hasNext={!!query.hasNextPage} pending={query.isFetching} error={query.error} loadMore={loadMore}
      auto={autoLoad} retry={() => { if (query.isFetchNextPageError) void query.fetchNextPage(); else void query.refetch(); }} />
    <Outlet />
  </section>;
};
