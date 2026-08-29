import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Modal } from './Modal';

const meta = {
  title: 'Общие компоненты/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    visible: { control: 'boolean', description: 'Показывает или скрывает модальное окно' },
    children: { control: 'text', description: 'Содержимое модального окна' },
  },
  args: {
    visible: true,
    children: 'Здесь может находиться форма, подтверждение или любая другая информация.',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  render: (args) => (
    <Modal {...args}>
      <h2>Новое действие</h2>
      <p>{args.children}</p>
    </Modal>
  ),
};

export const Hidden: Story = {
  args: { visible: false },
};
