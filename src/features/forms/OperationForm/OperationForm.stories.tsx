import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { OperationForm } from './OperationForm';
import { sampleOperation } from '../samples';

const meta = {
  title: 'Формы/OperationForm', component: OperationForm, tags: ['autodocs'],
  args: { mode: 'create', disabled: false },
  argTypes: { mode: { control: 'inline-radio', options: ['create', 'edit'] } },
  parameters: { docs: { description: { component: 'Добавление и редактирование операции: название, тип, положительная сумма с двумя знаками после запятой, категория, дата и описание. Существующие значения задаются через initialValues. Отправка выводит данные с числовой суммой в консоль и очищает поля, включая режим редактирования.' } } },
} satisfies Meta<typeof OperationForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {};
export const Edit: Story = { args: { mode: 'edit', initialValues: sampleOperation } };
export const Income: Story = { args: { mode: 'edit', initialValues: { ...sampleOperation, name: 'Оплата проекта', amount: '45000', categoryId: 'services', type: 'Profit' } } };
