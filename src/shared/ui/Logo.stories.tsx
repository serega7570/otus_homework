import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Logo } from './Logo';

const meta = {
  title: 'Общие компоненты/Logo',
  component: Logo,
  tags: ['autodocs'],
  args: { label: 'Secure UI' },
  argTypes: { label: { control: 'text' } },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
