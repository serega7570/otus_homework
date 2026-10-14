/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { LanguageSwitcher } from '../../shared/ui/LanguageSwitcher';
import { ProductCard } from './ProductCard';
import { ProductDetails } from './ProductDetails';

const product = { name: 'Mono', description: 'A comfortable chair', price: 24990, image: '/chair.jpg', category: 'Furniture' };

describe('product composition', () => {
  it.each([
    ['card', ProductCard, 3],
    ['details', ProductDetails, 2],
  ] as const)('preserves %s data, heading semantics, localization and the cart display', async (_, Component, level) => {
    const user = userEvent.setup();
    const Demo = ({ count }: { count: number }) => <LanguageProvider>
      <Component {...product} count={count} />
      <LanguageSwitcher />
    </LanguageProvider>;
    const { rerender } = render(<Demo count={0} />);
    expect(screen.getByRole('heading', { name: 'Mono', level })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Mono' })).toHaveAttribute('src', '/chair.jpg');
    expect(screen.getByText('A comfortable chair')).toBeInTheDocument();
    expect(screen.getByText(/24\s990/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'В корзину' })).toBeInTheDocument();
    if (level === 2) expect(screen.getByText('Furniture')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox'), 'en');
    expect(screen.getByText(/24,990/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
    rerender(<Demo count={2} />);
    expect(screen.getByRole('spinbutton', { name: 'Product quantity' })).toHaveValue(2);
    expect(screen.queryByRole('button', { name: 'Add to cart' })).not.toBeInTheDocument();
  });
});
