import { useState } from 'react';
import { useDisclosure } from '../lib/useDisclosure';
import { ModalWithInputView } from './ModalWithInputView';

export const ModalWithInput = (): JSX.Element => {
  const [text, setText] = useState('');
  const { isOpen, open, close } = useDisclosure();

  return (
    <ModalWithInputView
      text={text}
      isOpen={isOpen}
      onTextChange={setText}
      onOpen={open}
      onClose={close}
    />
  );
};
