import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OperationDetails } from './OperationDetails';

const meta = {
  title: 'Доходы и расходы/Полная операция',
  component: OperationDetails,
  tags: ['autodocs'],
  args: {
    amount: 18900,
    category: 'Обучение',
    name: 'Курс frontend-разработки',
    description:
      'Оплата образовательной программы по React. Включает занятия, практические работы и проверку домашних заданий.',
    date: '2026-08-29T12:00:00.000Z',
    type: 'Cost',
  },
  argTypes: {
    amount: { control: { type: 'number', min: 0 } },
    category: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    date: { control: 'text' },
    type: { control: 'radio', options: ['Cost', 'Profit'] },
  },
} satisfies Meta<typeof OperationDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
