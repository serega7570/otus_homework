import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProductDetails } from './ProductDetails';

const productImage =
  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=90';

const meta = {
  title: 'Интернет-магазин/Полный товар',
  component: ProductDetails,
  tags: ['autodocs'],
  args: {
    price: 24990,
    image: productImage,
    category: 'Мебель / Кресла',
    name: 'Кресло Mono',
    description:
      'Удобное кресло для дома и рабочего пространства. Натуральные материалы, спокойная геометрия и нейтральный оттенок легко сочетаются с современным интерьером.',
    count: 0,
  },
  argTypes: {
    price: { control: { type: 'number', min: 0 } },
    image: { control: 'text' },
    category: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    count: { control: { type: 'number', min: 0, step: 1 } },
  },
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
