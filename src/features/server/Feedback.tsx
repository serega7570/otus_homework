import { useTranslation } from 'react-i18next';
import { getApiErrors } from '../../shared/api/errors';
import '../forms/forms.css';

export const ApiError = ({ error, retry }: { error?: unknown; retry?: () => void }): JSX.Element | null => {
  const { t } = useTranslation();
  if (!error) return null;
  const { fields, general } = getApiErrors(error);
  return <div className="server-feedback">
    {[...general, ...Object.values(fields)].map((message, index) => <p className="form-field__error" role="alert" key={index}>{t(message)}</p>)}
    {retry && <button className="ui-button" type="button" onClick={retry}>{t('server.retry')}</button>}
  </div>;
};

export const FormFeedback = ({ status }: { status?: { messages?: string[]; success?: boolean } }): JSX.Element => {
  const { t } = useTranslation();
  return <>
    {status?.messages?.map((message, index) => <p key={index} className="form-field__error" role="alert">{t(message)}</p>)}
    {status?.success && <p className="homework-form__status" role="status">{t('server.saved')}</p>}
  </>;
};
