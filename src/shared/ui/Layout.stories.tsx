import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Layout } from './Layout';
import { useTranslation } from 'react-i18next';

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
  render: function Render(args) {
    const { t } = useTranslation();
    return (
    <Layout {...args}>
      <section
        style={{ padding: '48px', borderRadius: '24px', background: 'var(--ui-surface)', border: '1px solid var(--ui-line)' }}
      >
        <h1 style={{ marginTop: 0 }}>{t('stories.workspace')}</h1>
        <p>{args.children}</p>
      </section>
    </Layout>
    );
  },
};
