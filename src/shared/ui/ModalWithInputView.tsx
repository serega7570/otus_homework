import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import './components.css';

export type ModalWithInputViewProps = Readonly<{
  text: string;
  isOpen: boolean;
  onTextChange: (text: string) => void;
  onOpen: () => void;
  onClose: () => void;
}>;

export const ModalWithInputView = ({
  text, isOpen, onTextChange, onOpen, onClose,
}: ModalWithInputViewProps): JSX.Element => {
  const inputId = useId();
  const { t } = useTranslation();

  return (
    <div className="ui-modal-demo">
      <label htmlFor={inputId}>{t('modal.input')}</label>
      <input
        id={inputId}
        type="text"
        value={text}
        placeholder={t('modal.placeholder')}
        onChange={(event) => onTextChange(event.target.value)}
      />
      <button className="ui-button" type="button" onClick={onOpen}>{t('modal.open')}</button>
      <Modal visible={isOpen} onClose={onClose}>
        <h2>{t('modal.title')}</h2>
        <p className="ui-modal-demo__message">{text}</p>
      </Modal>
    </div>
  );
};
