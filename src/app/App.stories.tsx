import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import './App.css';
import { StoreProvider } from './store/StoreProvider';
import { createAppStore } from './store/store';
import { appInitialized, createDemoToken, type UserRole } from './store/sessionSlice';

type DemoProps = { initialPath: string; role: UserRole | 'guest' };
const SessionDemo = ({ initialPath, role }: DemoProps) => {
  const [store] = useState(() => {
    const nextStore = createAppStore();
    nextStore.dispatch(appInitialized(role === 'guest' ? null : createDemoToken(role === 'admin' ? 'admin@example.com' : 'user@example.com', 'login')));
    return nextStore;
  });
  return (
    <StoreProvider store={store} syncTabs={false}>
      <MemoryRouter initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </MemoryRouter>
    </StoreProvider>
  );
};

const RoutingDemo = (props: DemoProps) => (
  <SessionDemo key={`${props.initialPath}:${props.role}`} {...props} />
);

const meta = {
  title: 'Роутинг / Приложение',
  component: RoutingDemo,
  parameters: { layout: 'fullscreen' },
  args: { initialPath: '/profile', role: 'admin' },
  argTypes: { role: { control: 'select', options: ['guest', 'user', 'admin'] } },
} satisfies Meta<typeof RoutingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Profile: Story = {};
export const Operations: Story = { args: { initialPath: '/operations' } };
export const CreateOperation: Story = { args: { initialPath: '/operations/new' } };
export const EditOperation: Story = { args: { initialPath: '/operations/groceries/edit' } };
export const GuestProfile: Story = { args: { initialPath: '/profile', role: 'guest' } };
export const UserOperations: Story = { args: { initialPath: '/operations', role: 'user' } };
export const ForbiddenEdit: Story = { args: { initialPath: '/operations/groceries/edit', role: 'user' } };
export const Login: Story = { args: { initialPath: '/login', role: 'guest' } };
