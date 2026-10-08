import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeProvider';
import './components.css';

export type ModalProps = Readonly<{
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
}>;

export const Modal = ({ visible, children, onClose }: ModalProps): JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  if (!visible) return null;

  return createPortal(
    <div className="ui-modal" data-theme={theme} lang={i18n.language} role="presentation">
      <section className="ui-modal__dialog" role="dialog" aria-modal="true" aria-label={t('modal.label')}>
        <button className="ui-modal__close" type="button" aria-label={t('modal.close')} onClick={onClose}>
          ×
        </button>
        <div className="ui-modal__content">{children}</div>
      </section>
    </div>,
    document.body,
  );
};
