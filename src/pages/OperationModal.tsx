import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '../shared/ui';
import { useAppSelector } from '../app/store/hooks';
import { useOperationQuery } from '../shared/api/serverApi';
import { ApiError } from '../features/server/Feedback';
import { ServerOperationForm } from '../features/server/ServerOperationForm';

export const OperationModal = ({ mode }: { mode: 'create' | 'edit' }): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const token = useAppSelector((state) => state.auth.token)!;
  const query = useOperationQuery({ id: id ?? '', token }, { skip: mode === 'create' || !id });
  const location = useLocation();
  const navigate = useNavigate();
  const close = useCallback(() => {
    if (location.state?.operationModal === true) navigate(-1);
    else navigate('/operations', { replace: true });
  }, [location.state, navigate]);
  const title = t(`forms.operation.${mode}Title`);
  return <Modal visible onClose={close} label={title}>
    <h2>{title}</h2>
    {mode === 'edit' && query.isLoading && <p role="status">{t('session.loading')}</p>}
    <ApiError error={query.error} retry={() => { void query.refetch(); }} />
    {(mode === 'create' || query.currentData) && <ServerOperationForm key={`${mode}:${id ?? 'new'}`} operation={query.currentData} onSaved={close} />}
  </Modal>;
};
