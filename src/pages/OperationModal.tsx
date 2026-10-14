import { useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '../shared/ui';
import { useOperations } from '../app/OperationsProvider';
import { OperationForm } from '../features/forms/OperationForm/OperationForm';
import { toOperationFormValues, type OperationDraft } from '../features/forms/OperationForm/types';

export const OperationModal = ({ mode }: { mode: 'create' | 'edit' }): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { operations, addOperation, updateOperation } = useOperations();
  const operation = mode === 'edit' ? operations.find((item) => item.id === id) : undefined;
  const close = useCallback(() => {
    if (location.state?.operationModal === true) navigate(-1);
    else navigate('/operations', { replace: true });
  }, [location.state, navigate]);
  const save = (draft: OperationDraft): void => {
    if (mode === 'edit' && operation) updateOperation({ ...draft, id: operation.id });
    else if (mode === 'create') addOperation({ ...draft, id: crypto.randomUUID() });
    close();
  };
  const missing = mode === 'edit' && !operation;
  const title = t(missing ? 'routing.operationNotFound' : `forms.operation.${mode}Title`);
  return (
    <Modal visible onClose={close} label={title}>
      <h2>{title}</h2>
      {missing ? <p>{t('routing.operationNotFoundDescription')}</p> : (
        <OperationForm key={`${mode}:${id ?? 'new'}`} mode={mode} initialValues={operation ? toOperationFormValues(operation) : undefined} onSave={save} />
      )}
    </Modal>
  );
};
