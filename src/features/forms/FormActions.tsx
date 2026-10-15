import { useTranslation } from 'react-i18next';
import '../../shared/ui/components.css';

export const FormActions = ({ label, disabled, status }: { label: string; disabled?: boolean; status?: string }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className="homework-form__actions">
      <button className="ui-button" type="submit" disabled={disabled}>{label}</button>
      {status && <p className="homework-form__status" role="status">{t(status)}</p>}
    </div>
  );
};
