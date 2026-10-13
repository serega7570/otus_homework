import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { createRandomOperation } from '../../homeworks/ts1/3_write';
import { OperationList } from './OperationList';

const meta = {
  title: 'Доходы и расходы/OperationList',
  component: OperationList,
  tags: ['autodocs'],
  args: {
    operations: Array.from({ length: 4 }, () => createRandomOperation('2026-10-08T12:00:00.000Z')),
  },
  argTypes: { operations: { control: 'object' } },
} satisfies Meta<typeof OperationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { operations: [] } };
