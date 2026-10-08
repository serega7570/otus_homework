import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OperationFeed } from './OperationFeed';

const meta = {
  title: 'Доходы и расходы/OperationFeed',
  component: OperationFeed,
  tags: ['autodocs'],
  args: { initialCount: 6, batchSize: 6, autoLoad: true },
  argTypes: {
    initialCount: { control: { type: 'number', min: 0, max: 20, step: 1 } },
    batchSize: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    autoLoad: { control: 'boolean' },
  },
  render: (args) => <OperationFeed key={args.initialCount} {...args} />,
} satisfies Meta<typeof OperationFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfiniteScroll: Story = {};
export const ShowMoreButton: Story = { args: { autoLoad: false } };
