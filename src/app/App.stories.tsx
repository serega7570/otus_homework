import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import './App.css';
import { StoreProvider } from './store/StoreProvider';

const RoutingDemo = ({ initialPath }: { initialPath: string }) => (
  <StoreProvider syncTabs={false}>
    <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </MemoryRouter>
  </StoreProvider>
);
const meta = {
  title: 'Роутинг / Приложение', component: RoutingDemo,
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Приложение использует настоящий API OTUS. У каждого примера отдельный store без localStorage. Войдите реальным аккаунтом, чтобы открыть защищённые экраны.' } } },
  args: { initialPath: '/login' },
} satisfies Meta<typeof RoutingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Login: Story = {};
export const Overview: Story = { args: { initialPath: '/' } };
export const Signup: Story = { args: { initialPath: '/signup' } };
export const GuestProfile: Story = { args: { initialPath: '/profile' } };
export const GuestOperations: Story = { args: { initialPath: '/operations' } };
export const GuestShop: Story = { args: { initialPath: '/shop' } };
export const NotFound: Story = { args: { initialPath: '/missing' } };
