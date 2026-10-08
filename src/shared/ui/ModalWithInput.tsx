import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';
import './components.css';

export const ModalWithInput = (): JSX.Element => {
  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputId = useId();
  const { t } = useTranslation();

  return (
    <div className="ui-modal-demo">
      <label htmlFor={inputId}>{t('modal.input')}</label>
      <input id={inputId} type="text" value={text} placeholder={t('modal.placeholder')} onChange={(event) => setText(event.target.value)} />
      <button className="ui-button" type="button" onClick={() => setIsOpen(true)}>{t('modal.open')}</button>
      <Modal visible={isOpen} onClose={() => setIsOpen(false)}>
        <h2>{t('modal.title')}</h2>
        <p className="ui-modal-demo__message">{text}</p>
      </Modal>
    </div>
  );
};
