import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ModalWithInput } from './ModalWithInput';
import { useState } from 'react';
import { useDisclosure } from '../lib/useDisclosure';
import { ModalWithInputView } from './ModalWithInputView';

const meta = {
  title: 'Управление состоянием/ModalWithInput',
  component: ModalWithInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ModalWithInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const ControlledDemo = (): JSX.Element => {
  const [text, setText] = useState('Controlled message');
  const { isOpen, open, close } = useDisclosure();

  return <ModalWithInputView text={text} isOpen={isOpen} onTextChange={setText} onOpen={open} onClose={close} />;
};

export const Controlled: Story = {
  parameters: {
    docs: { description: { story: 'ModalWithInputView получает текст, видимость и обработчики от родителя. Для открытия и закрытия используется общий хук useDisclosure.' } },
  },
  render: () => <ControlledDemo />,
};

export const InsideClippedContainer: Story = {
  parameters: {
    docs: { description: { story: 'Модальное окно монтируется в body и выходит за границы контейнера с overflow: hidden и transform.' } },
  },
  render: () => (
    <div style={{ height: 180, maxWidth: 460, padding: 16, overflow: 'hidden', transform: 'translateX(0)', border: '1px solid var(--ui-line)' }}>
      <ModalWithInput />
    </div>
  ),
};
