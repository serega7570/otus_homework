import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import './App.css';

const RoutingDemo = ({ initialPath }: { initialPath: string }) => (
  <MemoryRouter key={initialPath} initialEntries={[initialPath]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <AppRoutes />
  </MemoryRouter>
);

const meta = {
  title: 'Роутинг / Приложение',
  component: RoutingDemo,
  parameters: { layout: 'fullscreen' },
  args: { initialPath: '/profile' },
} satisfies Meta<typeof RoutingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Profile: Story = {};
export const Operations: Story = { args: { initialPath: '/operations' } };
export const CreateOperation: Story = { args: { initialPath: '/operations/new' } };
export const EditOperation: Story = { args: { initialPath: '/operations/groceries/edit' } };
