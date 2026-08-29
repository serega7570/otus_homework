import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OperationCard } from './OperationCard';

const meta = {
  title: 'Доходы и расходы/Краткая операция',
  component: OperationCard,
  tags: ['autodocs'],
  args: {
    amount: 3490,
    category: 'Подписки',
    name: 'Рабочие сервисы',
    description: 'Ежемесячная оплата инструментов для разработки и совместной работы команды',
    type: 'Cost',
  },
  argTypes: {
    amount: { control: { type: 'number', min: 0 } },
    category: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    type: { control: 'radio', options: ['Cost', 'Profit'] },
  },
} satisfies Meta<typeof OperationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expense: Story = {};

export const Income: Story = {
  args: {
    amount: 125000,
    category: 'Зарплата',
    name: 'Зачисление зарплаты',
    description: 'Регулярный доход за текущий месяц',
    type: 'Profit',
  },
};
