/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountService } from '../../entities/account/AccountService';
import { InMemoryDiscountRepository } from '../../entities/account/InMemoryDiscountRepository';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { LanguageSwitcher } from '../../shared/ui/LanguageSwitcher';
import { DiscountManager } from './DiscountManager';

const total = (): HTMLElement => screen.getByLabelText('Итоговая скидка');
const waitForTotal = async (value: number): Promise<void> => {
  await waitFor(() => expect(total()).toHaveTextContent(new RegExp(`^${value}%$`)));
  await waitFor(() => expect(screen.getByRole('combobox', { name: 'Тип пользователя' })).toBeEnabled());
};

it('saves additive discounts through the service and isolates products and user types', async () => {
  const user = userEvent.setup();
  const service = new AccountService(new InMemoryDiscountRepository());
  render(<LanguageProvider><DiscountManager service={service} /></LanguageProvider>);
  await waitForTotal(0);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Тип пользователя' }), 'Gold');
  await waitForTotal(0);
  const general = screen.getByRole('spinbutton', { name: 'Общая скидка, %' });
  await user.clear(general);
  await user.type(general, '10');
  await user.click(screen.getByRole('button', { name: 'Сохранить общую скидку' }));
  await waitForTotal(10);
  const product = screen.getByRole('spinbutton', { name: 'Скидка на товар, %' });
  await user.clear(product);
  await user.type(product, '5');
  await user.click(screen.getByRole('button', { name: 'Сохранить скидку на товар' }));
  await waitForTotal(15);
  await expect(service.calculateDiscount('Gold', 'Car')).resolves.toBe(15);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Тип товара' }), 'Toy');
  await waitForTotal(10);
  expect(general).toHaveValue(10);
  expect(product).toHaveValue(0);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Тип пользователя' }), 'Premium');
  await waitForTotal(0);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Тип пользователя' }), 'Gold');
  await waitForTotal(10);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Тип товара' }), 'Car');
  await waitForTotal(15);
  await user.clear(product);
  await user.type(product, '0');
  await user.click(screen.getByRole('button', { name: 'Сохранить скидку на товар' }));
  await waitForTotal(10);
});

it('rejects blank and out-of-range input while retaining the saved policy', async () => {
  const user = userEvent.setup();
  const service = new AccountService(new InMemoryDiscountRepository());
  await service.setUserDiscount('Standard', 10);
  render(<LanguageProvider><DiscountManager service={service} /></LanguageProvider>);
  await waitForTotal(10);
  const general = screen.getByRole('spinbutton', { name: 'Общая скидка, %' });
  for (const invalid of ['', '-1', '101']) {
    await user.clear(general);
    if (invalid) await user.type(general, invalid);
    await user.click(screen.getByRole('button', { name: 'Сохранить общую скидку' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Введите число от 0 до 100.');
    await expect(service.getUserDiscount('Standard')).resolves.toBe(10);
    expect(total()).toHaveTextContent('10%');
  }
});

it('shows a read failure and retries without presenting a fake zero result', async () => {
  const user = userEvent.setup();
  const repository = new InMemoryDiscountRepository();
  const read = jest.spyOn(repository, 'readUserDiscount').mockRejectedValue(new Error('Offline'));
  render(<LanguageProvider><DiscountManager service={new AccountService(repository)} /></LanguageProvider>);
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось загрузить скидки.');
  expect(screen.queryByLabelText('Итоговая скидка')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Сохранить общую скидку' })).toBeDisabled();
  read.mockRestore();
  await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));
  await waitForTotal(0);
});

it('handles rejected writes without changing the displayed or stored discount', async () => {
  const user = userEvent.setup();
  const repository = new InMemoryDiscountRepository();
  const service = new AccountService(repository);
  await service.setUserDiscount('Standard', 10);
  jest.spyOn(repository, 'writeProductDiscount').mockRejectedValue(new Error('Offline'));
  render(<LanguageProvider><DiscountManager service={service} /></LanguageProvider>);
  await waitForTotal(10);
  const product = screen.getByRole('spinbutton', { name: 'Скидка на товар, %' });
  await user.clear(product);
  await user.type(product, '5');
  await user.click(screen.getByRole('button', { name: 'Сохранить скидку на товар' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось сохранить скидку.');
  expect(total()).toHaveTextContent('10%');
  await expect(service.calculateDiscount('Standard', 'Car')).resolves.toBe(10);
});

it('ignores a late response from a replaced service', async () => {
  const repository = new InMemoryDiscountRepository();
  let completeRead!: (value: number) => void;
  const deferred = new Promise<number>((resolve) => { completeRead = resolve; });
  jest.spyOn(repository, 'readUserDiscount').mockReturnValue(deferred);
  const oldService = new AccountService(repository);
  const replacement = new AccountService(new InMemoryDiscountRepository());
  await replacement.setUserDiscount('Standard', 20);
  const { rerender } = render(<LanguageProvider><DiscountManager service={oldService} /></LanguageProvider>);
  rerender(<LanguageProvider><DiscountManager service={replacement} /></LanguageProvider>);
  await waitForTotal(20);
  await act(async () => { completeRead(99); await deferred; });
  expect(total()).toHaveTextContent('20%');
});

it('translates the interface without losing configured policies', async () => {
  const user = userEvent.setup();
  const service = new AccountService(new InMemoryDiscountRepository());
  await service.setUserDiscount('Standard', 10);
  render(<LanguageProvider><LanguageSwitcher /><DiscountManager service={service} /></LanguageProvider>);
  await waitForTotal(10);
  await user.selectOptions(screen.getByRole('combobox', { name: 'Язык интерфейса' }), 'en');
  expect(screen.getByLabelText('Total discount')).toHaveTextContent('10%');
  expect(screen.getByRole('spinbutton', { name: 'General discount, %' })).toHaveValue(10);
});
