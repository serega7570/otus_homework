import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ModalWithInput } from './ModalWithInput';

const meta = {
  title: 'Управление состоянием/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTranslatedComponent: Story = {
  render: () => (
    <div className="ui-state-preview">
      <LanguageSwitcher />
      <ModalWithInput />
    </div>
  ),
};
