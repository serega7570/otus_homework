import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AuthForm } from './AuthForm';

const meta = {
  title: 'Формы/AuthForm', component: AuthForm, tags: ['autodocs'],
  args: { mode: 'login', disabled: false },
  argTypes: { mode: { control: 'inline-radio', options: ['login', 'register'] } },
  parameters: { docs: { description: { component: 'Учебные формы входа и регистрации без серверной авторизации. Проверяются email и пароль длиной 8–128 символов. При регистрации нужны буква, цифра и совпадение подтверждения. После успешной отправки email и пароль выводятся в консоль, форма очищается. Переключение режима очищает значения и ошибки.' } } },
} satisfies Meta<typeof AuthForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Login: Story = {};
export const Registration: Story = { args: { mode: 'register' } };
export const Disabled: Story = { args: { disabled: true } };
