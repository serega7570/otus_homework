import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AddToCart } from './AddToCart';

const meta = {
  title: 'Интернет-магазин/Кнопка «В корзину»',
  component: AddToCart,
  tags: ['autodocs'],
  args: { count: 0 },
  argTypes: {
    count: { control: { type: 'number', min: 0, step: 1 } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddToCart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const WithItems: Story = { args: { count: 3 } };
