import { useEffect } from 'react';
import { useDisclosure } from '../lib/useDisclosure';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Modal, type ModalProps } from './Modal';
import { useTranslation } from 'react-i18next';

const ModalDemo = ({ visible, children }: ModalProps): JSX.Element => {
  const { isOpen, open, close, setIsOpen } = useDisclosure(visible);
  const { t } = useTranslation();

  useEffect(() => {
    setIsOpen(visible);
  }, [visible, setIsOpen]);

  return (
    <div style={{ minHeight: '420px', padding: '32px' }}>
      <button
        type="button"
        onClick={open}
        className="ui-button"
      >
        {t('modal.open')}
      </button>
      <p style={{ color: 'var(--ui-muted)' }}>
        {t('stories.visibility')}: <strong>{String(isOpen)}</strong>
      </p>
      <Modal visible={isOpen} onClose={close}>
        <h2>{t('stories.action')}</h2>
        <p>{children}</p>
      </Modal>
    </div>
  );
};

const meta = {
  title: 'Общие компоненты/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    visible: { control: 'boolean', description: 'Показывает или скрывает модальное окно' },
    children: { control: 'text', description: 'Содержимое модального окна' },
    onClose: { control: false, table: { disable: true } },
  },
  args: {
    visible: true,
    children: 'Здесь может находиться форма, подтверждение или любая другая информация.',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  render: (args) => <ModalDemo {...args} />,
};

export const Hidden: Story = {
  args: { visible: false },
  render: (args) => <ModalDemo {...args} />,
};
