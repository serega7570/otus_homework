/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../providers/LanguageProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ModalWithInputView } from './ModalWithInputView';

it('lets the parent control both message text and modal visibility', async () => {
  const user = userEvent.setup();
  const onTextChange = jest.fn();
  const onOpen = jest.fn();
  const onClose = jest.fn();
  const Demo = ({ text, isOpen }: { text: string; isOpen: boolean }) => <ThemeProvider>
    <LanguageProvider>
      <ModalWithInputView text={text} isOpen={isOpen} onTextChange={onTextChange} onOpen={onOpen} onClose={onClose} />
    </LanguageProvider>
  </ThemeProvider>;
  const { rerender } = render(<Demo text="Initial" isOpen={false} />);
  const input = screen.getByRole('textbox', { name: 'Текст сообщения' });
  await user.type(input, '!');
  expect(onTextChange).toHaveBeenLastCalledWith('Initial!');
  expect(input).toHaveValue('Initial');
  await user.click(screen.getByRole('button', { name: 'Открыть модальное окно' }));
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  rerender(<Demo text="Updated by parent" isOpen />);
  expect(screen.getByRole('textbox')).toHaveValue('Updated by parent');
  expect(screen.getByRole('dialog')).toHaveTextContent('Updated by parent');
  await user.click(screen.getByRole('button', { name: 'Закрыть' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  rerender(<Demo text="Updated by parent" isOpen={false} />);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
