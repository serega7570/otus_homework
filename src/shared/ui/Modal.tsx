import type { ReactNode } from 'react';
import './components.css';

export type ModalProps = Readonly<{
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
}>;

export const Modal = ({ visible, children, onClose }: ModalProps): JSX.Element | null => {
  if (!visible) return null;

  return (
    <div className="ui-modal" role="presentation">
      <section className="ui-modal__dialog" role="dialog" aria-modal="true" aria-label="Модальное окно">
        <button className="ui-modal__close" type="button" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        <div className="ui-modal__content">{children}</div>
      </section>
    </div>
  );
};
