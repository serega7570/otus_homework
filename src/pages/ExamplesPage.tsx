import { useTranslation } from 'react-i18next';
import { FormsWorkspace } from '../features/forms/FormsWorkspace';
import { DiscountManager } from '../features/account/DiscountManager';

export const ExamplesPage = ({ section }: { section: 'forms' | 'discounts' }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel" aria-labelledby={`${section}-title`}>
      <h1 id={`${section}-title`}>{t(`${section}.title`)}</h1>
      <p>{t(`${section}.description`)}</p>
      {section === 'forms' ? <FormsWorkspace /> : <DiscountManager />}
    </section>
  );
};
