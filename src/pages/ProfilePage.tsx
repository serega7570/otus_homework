import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../app/store/hooks';
import { useUpdateProfileMutation } from '../shared/api/serverApi';
import { FormField } from '../features/forms/FormField';
import { FormFeedback } from '../features/server/Feedback';
import { useApiForm } from '../features/server/useApiForm';

export const ProfilePage = (): JSX.Element => {
  const { t } = useTranslation();
  const profile = useAppSelector((state) => state.auth.profile)!;
  const [update] = useUpdateProfileMutation();
  const form = useApiForm({ name: profile.name }, async (values) => { await update(values).unwrap(); });
  return <section className="screen-panel" aria-labelledby="profile-title">
    <h1 id="profile-title">{t('routing.profile')}</h1>
    <p>{t('server.profileDescription')}</p>
    <dl className="profile-summary"><div><dt>{t('session.email')}</dt><dd>{profile.email}</dd></div></dl>
    <form className="homework-form" aria-label={t('forms.profile.title')} noValidate onSubmit={form.handleSubmit} onChange={() => form.setStatus(undefined)}>
      <FormField {...form.getFieldProps('name')} label={t('forms.profile.name')} hint={t('server.errors.nickname')} disabled={form.isSubmitting} error={form.errors.name} />
      <FormFeedback status={form.status} />
      <button className="ui-button" type="submit" disabled={form.isSubmitting}>{t(form.isSubmitting ? 'signup.sending' : 'forms.profile.save')}</button>
    </form>
  </section>;
};
