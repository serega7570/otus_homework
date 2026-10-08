import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Header } from './Header';
import { useTranslation } from 'react-i18next';

const meta = {
  title: 'Общие компоненты/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    brand: 'Secure UI',
  },
  argTypes: {
    brand: { control: 'text' },
    navigation: { control: 'object' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sticky: Story = {
  render: function Render(args) {
    const { t } = useTranslation();
    return (
    <div style={{ minHeight: '140vh' }}>
      <Header {...args} />
      <div style={{ padding: '48px', color: 'var(--ui-muted)' }}>
        {t('stories.scroll')}
      </div>
    </div>
    );
  },
};
