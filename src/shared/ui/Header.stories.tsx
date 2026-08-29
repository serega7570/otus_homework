import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Header } from './Header';

const meta = {
  title: 'Общие компоненты/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    brand: 'Secure UI',
    navigation: [
      { label: 'Обзор', href: '#overview' },
      { label: 'Операции', href: '#operations' },
      { label: 'Товары', href: '#products' },
    ],
  },
  argTypes: {
    brand: { control: 'text' },
    navigation: { control: 'object' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sticky: Story = {
  render: (args) => (
    <div style={{ minHeight: '140vh' }}>
      <Header {...args} />
      <div style={{ padding: '48px', color: '#686d64' }}>
        Прокрутите страницу: Header останется у верхней границы.
      </div>
    </div>
  ),
};
