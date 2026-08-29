import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CartItem } from './CartItem';

const meta = {
  title: 'Интернет-магазин/Товар в корзине',
  component: CartItem,
  tags: ['autodocs'],
  args: {
    price: 24990,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=85',
    name: 'Кресло Mono',
    count: 2,
  },
  argTypes: {
    price: { control: { type: 'number', min: 0 } },
    image: { control: 'text' },
    name: { control: 'text' },
    count: { control: { type: 'number', min: 1, step: 1 } },
  },
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
