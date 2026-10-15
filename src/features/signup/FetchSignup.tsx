import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SignupForm } from './SignupForm';
import { createSignupBody, isSignupResult, SIGNUP_API_URL, SIGNUP_TIMEOUT_MS, type SignupValues } from './signupApi';

export const FetchSignup = (): JSX.Element => {
  const { t } = useTranslation();
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<unknown>();
  const activeRequest = useRef<AbortController>();
  useEffect(() => () => { activeRequest.current?.abort(); }, []);

  const submit = async (values: SignupValues): Promise<void> => {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, SIGNUP_TIMEOUT_MS);
    setPending(true);
    setError(undefined);
    setSuccess(false);
    try {
      // This implementation sends the request directly from a functional component.
      const response = await fetch(`${SIGNUP_API_URL}signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSignupBody(values)), signal: controller.signal,
      });
      const data: unknown = await response.json().catch((cause: unknown) => {
        if (controller.signal.aborted) throw cause;
        return undefined;
      });
      if (controller.signal.aborted) return;
      if (!response.ok || !isSignupResult(data)) setError({ status: response.status, data });
      else setSuccess(true);
    } catch {
      if (!controller.signal.aborted || timedOut) setError({ status: timedOut ? 'TIMEOUT_ERROR' : 'FETCH_ERROR' });
    } finally {
      clearTimeout(timeout);
      activeRequest.current = undefined;
      if (!controller.signal.aborted || timedOut) setPending(false);
    }
  };

  return <SignupForm label={t('signup.fetch')} pending={pending} success={success} error={error}
    onSubmit={submit} onEdit={() => { setError(undefined); setSuccess(false); }} />;
};
