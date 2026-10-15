import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ModalWithInput } from './ModalWithInput';

const meta = {
  title: 'Управление состоянием/ThemeSwitcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPreview: Story = {
  render: () => (
    <div className="ui-state-preview">
      <ThemeSwitcher />
      <ModalWithInput />
    </div>
  ),
};
