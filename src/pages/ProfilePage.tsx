import { useTranslation } from 'react-i18next';
import { ProfileEditor } from '../features/forms/ProfileForm/ProfileEditor';
import { sampleProfile } from '../features/forms/samples';

export const ProfilePage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="screen-panel" aria-labelledby="profile-title">
      <h1 id="profile-title">{t('routing.profile')}</h1>
      <p>{t('routing.profileDescription')}</p>
      <ProfileEditor initialValues={sampleProfile} />
    </section>
  );
};
