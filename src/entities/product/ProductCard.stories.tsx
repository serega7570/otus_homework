import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProductCard } from './ProductCard';

const productImage =
  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=85';

const meta = {
  title: 'Интернет-магазин/Краткий товар',
  component: ProductCard,
  tags: ['autodocs'],
  args: {
    price: 24990,
    image: productImage,
    name: 'Кресло Mono',
    description: 'Лаконичное рабочее кресло с мягким сиденьем и прочным основанием из массива дерева.',
    count: 0,
  },
  argTypes: {
    price: { control: { type: 'number', min: 0 } },
    image: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    count: { control: { type: 'number', min: 0, step: 1 } },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const InCart: Story = { args: { count: 2 } };
