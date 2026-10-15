import { useTranslation } from 'react-i18next';
import { ProfileEditor } from '../features/forms/ProfileForm/ProfileEditor';
import { useAppDispatch, useAppSelector } from '../app/store/hooks';
import { profileUpdated } from '../app/store/sessionSlice';

export const ProfilePage = (): JSX.Element => {
  const { t } = useTranslation();
  const profile = useAppSelector((state) => state.auth.profile);
  const dispatch = useAppDispatch();
  if (!profile) return <></>;
  return (
    <section className="screen-panel" aria-labelledby="profile-title">
      <h1 id="profile-title">{t('routing.profile')}</h1>
      <p>{t('routing.profileDescription')}</p>
      <dl className="profile-summary">
        <div><dt>{t('session.email')}</dt><dd>{profile.email}</dd></div>
        <div><dt>{t('session.role')}</dt><dd>{t(`session.${profile.role}`)}</dd></div>
      </dl>
      <ProfileEditor initialValues={{ name: profile.name, about: profile.about }} onSave={(values) => dispatch(profileUpdated(values))} />
    </section>
  );
};
