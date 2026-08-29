import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Layout } from './Layout';

const meta = {
  title: 'Общие компоненты/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    headerTitle: 'Secure UI',
    children: 'Презентационная область страницы',
  },
  argTypes: {
    headerTitle: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Layout {...args}>
      <section
        style={{ padding: '48px', borderRadius: '24px', background: '#fff', border: '1px solid #dcded6' }}
      >
        <h1 style={{ marginTop: 0 }}>Рабочее пространство</h1>
        <p>{args.children}</p>
      </section>
    </Layout>
  ),
};
