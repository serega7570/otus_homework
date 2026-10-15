import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ProfileEditor } from './ProfileEditor';
import { sampleProfile } from '../samples';

const meta = {
  title: 'Формы/ProfileForm', component: ProfileEditor, tags: ['autodocs'],
  args: { disabled: false },
  parameters: { docs: { description: { component: 'Форма профиля перенесена из React-js-OTUS/react-tutorial. ProfileEditor подключает Formik к ProfileForm с полями NameField и AboutField. При успешной отправке данные выводятся в консоль, поля очищаются. initialValues можно менять через Controls.' } } },
} satisfies Meta<typeof ProfileEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Edit: Story = { args: { initialValues: sampleProfile } };
export const Disabled: Story = { args: { initialValues: sampleProfile, disabled: true } };
