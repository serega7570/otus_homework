import type { ReactNode } from 'react';
import './components.css';

export type ModalProps = {
  visible: boolean;
  children: ReactNode;
};

export const Modal = ({ visible, children }: ModalProps): JSX.Element | null => {
  if (!visible) return null;

  return (
    <div className="ui-modal" role="presentation">
      <section className="ui-modal__dialog" role="dialog" aria-modal="true" aria-label="Модальное окно">
        <button className="ui-modal__close" type="button" aria-label="Закрыть">
          ×
        </button>
        <div className="ui-modal__content">{children}</div>
      </section>
    </div>
  );
};
