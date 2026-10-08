/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { StrictMode, type ReactNode } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as factories from '../../homeworks/ts1/3_write';
import { LanguageProvider } from '../../shared/providers/LanguageProvider';
import { OperationFeed } from './OperationFeed';

class ObserverMock implements IntersectionObserver {
  static instances: ObserverMock[] = [];
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [0];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = (): IntersectionObserverEntry[] => [];

  constructor(private callback: IntersectionObserverCallback) {
    ObserverMock.instances.push(this);
  }

  notify(isIntersecting: boolean): void {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this);
  }
}

const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <StrictMode><LanguageProvider>{children}</LanguageProvider></StrictMode>
);
const originalObserver = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');

beforeEach(() => {
  ObserverMock.instances = [];
  Object.defineProperty(window, 'IntersectionObserver', { configurable: true, writable: true, value: ObserverMock });
});

afterEach(() => {
  jest.restoreAllMocks();
  if (originalObserver) Object.defineProperty(window, 'IntersectionObserver', originalObserver);
  else Reflect.deleteProperty(window, 'IntersectionObserver');
});

describe('OperationFeed', () => {
  it('adds new generated operations with the button while preserving existing cards', async () => {
    const factory = jest.spyOn(factories, 'createRandomOperation');
    const user = userEvent.setup();
    render(<OperationFeed initialCount={2} batchSize={3} autoLoad={false} />, { wrapper });
    const originalCards = screen.getAllByRole('listitem');
    const callsOnMount = factory.mock.calls.length;
    expect(originalCards).toHaveLength(2);
    expect(ObserverMock.instances).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Показать ещё' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getAllByRole('listitem').slice(0, 2)).toEqual(originalCards);
    expect(factory).toHaveBeenCalledTimes(callsOnMount + 3);
    expect(screen.getByRole('status')).toHaveTextContent('Операций в списке: 5');
    const added = factory.mock.results.slice(callsOnMount).map((result) => result.value as factories.Operation);
    expect(new Set(added.map((operation) => operation.id)).size).toBe(3);
    added.forEach((operation) => {
      expect(Number.isNaN(Date.parse(operation.createdAt))).toBe(false);
      expect(operation.amount).toBeGreaterThanOrEqual(10);
      expect(operation.amount).toBeLessThanOrEqual(5000);
    });
  });

  it('loads a batch when the sentinel enters the viewport and ignores duplicate notifications', () => {
    const factory = jest.spyOn(factories, 'createRandomOperation');
    render(<OperationFeed initialCount={2} batchSize={2} />, { wrapper });
    const observer = ObserverMock.instances.at(-1)!;
    const callsOnMount = factory.mock.calls.length;
    act(() => observer.notify(false));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    act(() => {
      observer.notify(true);
      observer.notify(true);
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(factory).toHaveBeenCalledTimes(callsOnMount + 2);
    expect(observer.disconnect).toHaveBeenCalled();

    const nextObserver = ObserverMock.instances.at(-1)!;
    expect(nextObserver).not.toBe(observer);
    act(() => nextObserver.notify(true));
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(factory).toHaveBeenCalledTimes(callsOnMount + 4);
  });

  it('disconnects on unmount and ignores queued notifications from the disposed observer', () => {
    const factory = jest.spyOn(factories, 'createRandomOperation');
    const { unmount } = render(<OperationFeed />, { wrapper });
    const observer = ObserverMock.instances.at(-1)!;
    const callsOnMount = factory.mock.calls.length;
    unmount();
    expect(observer.disconnect).toHaveBeenCalled();
    act(() => observer.notify(true));
    expect(factory).toHaveBeenCalledTimes(callsOnMount);
  });

  it('keeps the button usable when IntersectionObserver is unavailable, starting from an empty list', async () => {
    Reflect.deleteProperty(window, 'IntersectionObserver');
    const user = userEvent.setup();
    render(<OperationFeed initialCount={0} batchSize={2} />, { wrapper });
    expect(screen.getByText('Операций пока нет.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Показать ещё' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText('Операций пока нет.')).not.toBeInTheDocument();
  });
});
