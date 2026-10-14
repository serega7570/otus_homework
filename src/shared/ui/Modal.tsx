import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../providers/ThemeProvider';
import './components.css';

let mountedModals = 0;
let bodyOverflow = '';

export type ModalProps = Readonly<{
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
  label?: string;
}>;

export const Modal = ({ visible, children, onClose, label }: ModalProps): JSX.Element | null => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!visible) return;
    const previousFocus = document.activeElement;
    if (mountedModals === 0) bodyOverflow = document.body.style.overflow;
    mountedModals += 1;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent): void => {
      const dialogs = document.querySelectorAll('.ui-modal__dialog');
      if (dialogs[dialogs.length - 1] !== dialogRef.current) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      mountedModals -= 1;
      if (mountedModals === 0) document.body.style.overflow = bodyOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [visible, onClose]);
  if (!visible) return null;

  return createPortal(
    <div className="ui-modal" data-theme={theme} lang={i18n.language} role="presentation">
      <section ref={dialogRef} tabIndex={-1} className="ui-modal__dialog" role="dialog" aria-modal="true" aria-label={label ?? t('modal.label')}>
        <button className="ui-modal__close" type="button" aria-label={t('modal.close')} onClick={onClose}>
          ×
        </button>
        <div className="ui-modal__content">{children}</div>
      </section>
    </div>,
    document.body,
  );
};
