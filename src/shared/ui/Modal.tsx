import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import './components.css';

export type ModalProps = Readonly<{
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
}>;

export const Modal = ({ visible, children, onClose }: ModalProps): JSX.Element | null => {
  const { t } = useTranslation();
  if (!visible) return null;

  return (
    <div className="ui-modal" role="presentation">
      <section className="ui-modal__dialog" role="dialog" aria-modal="true" aria-label={t('modal.label')}>
        <button className="ui-modal__close" type="button" aria-label={t('modal.close')} onClick={onClose}>
          ×
        </button>
        <div className="ui-modal__content">{children}</div>
      </section>
    </div>
  );
};
