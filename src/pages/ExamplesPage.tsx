import { useTranslation } from 'react-i18next';
import { DiscountManager } from '../features/account/DiscountManager';

export const ExamplesPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel" aria-labelledby="discounts-title">
      <h1 id="discounts-title">{t('discounts.title')}</h1>
      <p>{t('discounts.description')}</p>
      <DiscountManager />
    </section>
  );
};
