import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ForbiddenPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel">
      <h1>{t('session.forbidden')}</h1>
      <p>{t('session.forbiddenDescription')}</p>
      <Link className="ui-button" to="/operations">{t('session.backToOperations')}</Link>
    </section>
  );
};
