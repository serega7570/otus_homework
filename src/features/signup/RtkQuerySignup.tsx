import { useTranslation } from 'react-i18next';
import { SignupForm } from './SignupForm';
import { useSignupMutation, type SignupValues } from './signupApi';

export const RtkQuerySignup = (): JSX.Element => {
  const { t } = useTranslation();
  const [signup, { isLoading, isSuccess, error, reset }] = useSignupMutation();
  const submit = async (values: SignupValues): Promise<void> => {
    // The hook owns loading, success and error state; failed mutations resolve here.
    await signup(values);
  };
  return <SignupForm label={t('signup.rtkQuery')} pending={isLoading} success={isSuccess} error={error}
    onSubmit={submit} onEdit={reset} />;
};
