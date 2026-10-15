import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StoreProvider } from '../../app/store/StoreProvider';
import { FetchSignup } from './FetchSignup';
import { RtkQuerySignup } from './RtkQuerySignup';
import { SignupForm } from './SignupForm';

const SignupDemo = ({ transport = 'fetch' }: { transport?: 'fetch' | 'rtk-query' }): JSX.Element => (
  <StoreProvider syncTabs={false}>
    {transport === 'fetch' ? <FetchSignup /> : <RtkQuerySignup />}
  </StoreProvider>
);

const meta = {
  title: 'Сервер / Регистрация',
  component: SignupDemo,
  args: { transport: 'fetch' },
  argTypes: { transport: { control: 'select', options: ['fetch', 'rtk-query'] } },
  parameters: {
    docs: { description: { component: 'Fetch и RTK Query отправляют реальные запросы на сервер OTUS. Для проверки ошибки email введите invalid-email. Для успешной регистрации нужен уникальный email. Клиентская валидация отключена.' } },
  },
} satisfies Meta<typeof SignupDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Fetch: Story = {};
export const RtkQuery: Story = { args: { transport: 'rtk-query' } };

const previewProps = { label: 'Регистрация', pending: false, success: false, onSubmit: async () => {}, onEdit: () => {} };
export const InvalidEmail: Story = {
  render: () => <SignupForm {...previewProps} error={{ status: 400, data: {
    errors: [{ extensions: { code: 'ERR_VALIDATION_ERROR' }, message: '"invalid-email" is not valid email' }],
  } }} />,
};
export const NetworkError: Story = {
  render: () => <SignupForm {...previewProps} error={{ status: 'FETCH_ERROR' }} />,
};
export const Loading: Story = { render: () => <SignupForm {...previewProps} pending /> };
export const Success: Story = { render: () => <SignupForm {...previewProps} success /> };
