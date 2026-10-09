import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OperationFeed } from './OperationFeed';
import { OperationDetails } from './OperationDetails';

const meta = {
  title: 'Доходы и расходы/OperationFeed',
  component: OperationFeed,
  tags: ['autodocs'],
  args: { initialCount: 6, batchSize: 6, autoLoad: true },
  argTypes: {
    initialCount: { control: { type: 'number', min: 0, max: 20, step: 1 } },
    batchSize: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    autoLoad: { control: 'boolean' },
    renderOperations: { control: false },
  },
  render: (args) => <OperationFeed key={args.initialCount} {...args} />,
} satisfies Meta<typeof OperationFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InfiniteScroll: Story = {};
export const ShowMoreButton: Story = { args: { autoLoad: false } };

export const WithDetailsRenderer: Story = {
  args: {
    autoLoad: false,
    initialCount: 2,
    batchSize: 2,
    renderOperations: (operations) => (
      <div style={{ display: 'grid', gap: 14 }}>
        {operations.map((operation) => (
          <OperationDetails
            key={operation.id}
            amount={operation.amount}
            category={operation.category.name}
            name={operation.name}
            description={operation.desc ?? ''}
            type={operation.type}
            date={operation.createdAt}
          />
        ))}
      </div>
    ),
  },
};
