import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const NotFoundPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel">
      <h1>{t('routing.notFound')}</h1>
      <p>{t('routing.notFoundDescription')}</p>
      <Link className="ui-button" to="/">{t('routing.goHome')}</Link>
    </section>
  );
};
