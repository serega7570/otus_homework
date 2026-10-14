/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import type { Operation } from '../../homeworks/ts1/3_write';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { OperationList } from './OperationList';

const operations: Operation[] = [
  { id: 'cost-1', name: 'Subscription', desc: 'Monthly payment', amount: 100, category: { id: 'services', name: 'Services' }, type: 'Cost', createdAt: '2026-10-08T12:00:00.000Z' },
  { id: 'profit-1', name: 'Salary', amount: 5000, category: { id: 'income', name: 'Income' }, type: 'Profit', createdAt: '2026-10-08T12:00:00.000Z' },
];

describe('OperationList', () => {
  it('renders operation data, including an operation without a description', () => {
    render(<LanguageProvider><OperationList operations={operations} /></LanguageProvider>);
    const items = within(screen.getByRole('list', { name: 'Список операций' })).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByRole('heading', { name: 'Subscription' })).toBeInTheDocument();
    expect(within(items[0]).getByText('Monthly payment')).toBeInTheDocument();
    expect(within(items[0]).getByText('Services')).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('−100');
    expect(items[1]).toHaveTextContent('+5');
    expect(within(items[1]).getByRole('heading', { name: 'Salary' })).toBeInTheDocument();
  });

  it('preserves each operation DOM node when the input array is reordered', () => {
    const { rerender } = render(<LanguageProvider><OperationList operations={operations} /></LanguageProvider>);
    const subscription = screen.getByRole('heading', { name: 'Subscription' }).closest('li');
    const salary = screen.getByRole('heading', { name: 'Salary' }).closest('li');
    rerender(<LanguageProvider><OperationList operations={[operations[1], operations[0]]} /></LanguageProvider>);
    expect(screen.getAllByRole('listitem')).toEqual([salary, subscription]);
  });

  it('handles an empty array', () => {
    render(<LanguageProvider><OperationList operations={[]} /></LanguageProvider>);
    expect(screen.getByText('Операций пока нет.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });
});
