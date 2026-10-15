import { useTranslation } from 'react-i18next';
import { useIntersectionLoadMore } from '../../shared/lib/useIntersectionLoadMore';
import { ApiError } from './Feedback';

export const Pagination = ({ count, hasNext, pending, error, loadMore, retry, auto = true }: {
  count: number; hasNext: boolean; pending: boolean; error?: unknown; loadMore: () => void; retry: () => void; auto?: boolean;
}): JSX.Element => {
  const { t } = useTranslation();
  const sentinel = useIntersectionLoadMore({ enabled: auto && hasNext && !pending && !error, revision: count, onLoadMore: loadMore });
  return <div className="server-pagination">
    <ApiError error={error} retry={pending ? undefined : retry} />
    {pending && <p role="status">{t('session.loading')}</p>}
    {hasNext && <button className="ui-button" type="button" disabled={pending} onClick={loadMore}>{t('operationList.showMore')}</button>}
    {!hasNext && !pending && !error && <p>{t('server.end')}</p>}
    <div ref={sentinel} aria-hidden="true" />
  </div>;
};

export const uniqueItems = <T extends { id: string },>(pages?: { data: T[] }[]): T[] =>
  [...new Map((pages ?? []).flatMap((page) => page.data).map((item) => [item.id, item])).values()];
