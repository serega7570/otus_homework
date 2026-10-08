import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ModalWithInput } from './ModalWithInput';

const meta = {
  title: 'Управление состоянием/ModalWithInput',
  component: ModalWithInput,
  tags: ['autodocs'],
} satisfies Meta<typeof ModalWithInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
