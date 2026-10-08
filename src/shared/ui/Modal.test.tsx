/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '../providers/LanguageProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Modal } from './Modal';

describe('Modal portal', () => {
  it('mounts directly in body, removes the portal on hiding, and cleans up on unmount', () => {
    const Demo = ({ visible }: { visible: boolean }) => (
      <ThemeProvider initialTheme="dark">
        <LanguageProvider>
          <div style={{ overflow: 'hidden', transform: 'translateX(0)' }}>
            <Modal visible={visible}><p>Portal content</p></Modal>
          </div>
        </LanguageProvider>
      </ThemeProvider>
    );
    const { container, rerender, unmount } = render(<Demo visible={false} />);
    expect(document.body.querySelector('.ui-modal')).toBeNull();

    rerender(<Demo visible />);
    const overlay = screen.getByRole('dialog').parentElement!;
    expect(overlay.parentElement).toBe(document.body);
    expect(container).not.toContainElement(overlay);
    expect(overlay).toHaveAttribute('data-theme', 'dark');
    expect(overlay).toHaveAttribute('lang', 'ru');

    rerender(<Demo visible={false} />);
    expect(document.body.querySelector('.ui-modal')).toBeNull();
    rerender(<Demo visible />);
    expect(screen.getByText('Portal content')).toBeInTheDocument();
    unmount();
    expect(document.body.querySelector('.ui-modal')).toBeNull();
  });

  it('keeps theme and translation context for portals from independent trees', () => {
    render(<>
      <ThemeProvider initialTheme="dark">
        <LanguageProvider initialLanguage="en"><Modal visible>English modal</Modal></LanguageProvider>
      </ThemeProvider>
      <ThemeProvider initialTheme="light">
        <LanguageProvider><Modal visible>Русское окно</Modal></LanguageProvider>
      </ThemeProvider>
    </>);
    expect(screen.getByRole('dialog', { name: 'Modal window' }).parentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('dialog', { name: 'Modal window' }).parentElement).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('dialog', { name: 'Модальное окно' }).parentElement).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
  });
});
