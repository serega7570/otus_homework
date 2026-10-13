import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useDisclosure } from '../lib/useDisclosure';
import { CroppedText, type CroppedTextProps } from './CroppedText';
import './components.css';

const longText = 'React позволяет создавать интерфейсы из независимых компонентов. Каждый компонент отвечает за свою часть страницы, а общая логика может переиспользоваться через хуки и контекст. Сложные компоненты должны реагировать на изменение размеров контейнера, сохранять читаемость и корректно работать с разным содержимым. Этот текст можно развернуть целиком или ограничить несколькими строками, а ширину контейнера — менять независимо от размера окна браузера.';

const ResizeDemo = ({ opened, ...props }: CroppedTextProps): JSX.Element => {
  const [width, setWidth] = useState(360);
  const { isOpen, open, close, setIsOpen } = useDisclosure(opened);
  const { t } = useTranslation();

  useEffect(() => setIsOpen(opened), [opened, setIsOpen]);

  return (
    <div className="ui-cropped-text-demo">
      <div className="ui-cropped-text-demo__controls">
        <label>
          {t('croppedText.width')}: {width}px
          <input aria-label={t('croppedText.width')} type="range" min="120" max="760" value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        </label>
        <button className="ui-button" type="button" onClick={isOpen ? close : open} aria-expanded={isOpen}>
          {t(isOpen ? 'croppedText.collapse' : 'croppedText.expand')}
        </button>
      </div>
      <div className="ui-cropped-text-demo__container" style={{ width }}>
        <CroppedText {...props} opened={isOpen} />
      </div>
    </div>
  );
};

const meta = {
  title: 'Сложные компоненты/CroppedText',
  component: CroppedText,
  tags: ['autodocs'],
  args: { children: longText, opened: false, rows: 3 },
  argTypes: {
    children: { control: 'text' },
    opened: { control: 'boolean' },
    rows: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    className: { control: 'text' },
  },
  render: (args) => <ResizeDemo {...args} />,
  parameters: {
    docs: { description: { component: 'CroppedText из учебного списка OTUS: useLayoutEffect, ResizeObserver и бинарный поиск. Ограничивает строковый текст заданным числом строк и пересчитывает обрезание при изменении ширины контейнера. Полный текст доступен скринридерам.' } },
  },
} satisfies Meta<typeof CroppedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Resizable: Story = {};
export const OneLine: Story = { args: { rows: 1 } };
export const Expanded: Story = { args: { opened: true } };
export const ShortText: Story = { args: { children: 'Короткий текст.' } };
export const Empty: Story = { args: { children: '' } };
export const LongWordAndEmoji: Story = {
  args: { rows: 2, children: '👩‍💻👨‍👩‍👧‍👦🚀 ПрограммированиеИнтерфейсовБезПробелов'.repeat(8) },
};
export const Multiline: Story = { args: { children: 'Первая строка.\n\nВторая строка с большим описанием и дополнительной информацией.\nТретья строка.\nПоследняя строка.' } };
export const ZeroRows: Story = { args: { rows: 0 } };
