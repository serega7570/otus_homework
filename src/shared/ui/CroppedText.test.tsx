/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { act, cleanup, render } from '@testing-library/react';
import { CroppedText } from './CroppedText';

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const originalObserver = globalThis.ResizeObserver;
let width: number;
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;
let observers: ObserverMock[];

class ObserverMock {
  readonly callback: ResizeObserverCallback;
  target?: Element;
  observe = jest.fn((target: Element) => { this.target = target; });
  unobserve = jest.fn();
  disconnect = jest.fn();
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    observers.push(this);
  }
  notify(nextWidth: number): void {
    this.callback([{ target: this.target, contentRect: { width: nextWidth } } as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

const flushFrames = (): void => {
  act(() => {
    const pending = Array.from(frames.values());
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
};

beforeEach(() => {
  width = 100;
  frames = new Map();
  nextFrame = 0;
  observers = [];
  globalThis.ResizeObserver = ObserverMock as unknown as typeof ResizeObserver;
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => { frames.delete(id); });
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const columns = Math.max(1, Math.floor(parseFloat(this.style.width) / 10));
    const lines = (this.textContent || '').split('\n').reduce((total, line) => (
      total + Math.max(1, Math.ceil(Array.from(segmenter.segment(line)).length / columns))
    ), 0);
    return { height: lines * 20 } as DOMRect;
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  globalThis.ResizeObserver = originalObserver;
});

const visible = (container: HTMLElement): string => container.querySelector('.ui-cropped-text__visible')?.textContent || '';
const text = 'a'.repeat(100);

it('crops before paint and leaves the complete text available to screen readers', () => {
  const { container } = render(<CroppedText opened={false} rows={2}>{text}</CroppedText>);
  expect(visible(container)).toBe('a'.repeat(19) + '…');
  expect(container.querySelector('.ui-cropped-text__accessible')).toHaveTextContent(text);
  expect(container.querySelector('.ui-cropped-text__visible')).toHaveAttribute('aria-hidden', 'true');
  expect(observers[0].observe).toHaveBeenCalledWith(container.firstChild);
});

it('recalculates after container resizing and batches notifications into one frame', () => {
  const { container } = render(<CroppedText opened={false} rows={2}>{text}</CroppedText>);
  act(() => {
    observers[0].notify(150);
    observers[0].notify(200);
  });
  expect(frames.size).toBe(1);
  flushFrames();
  expect(visible(container)).toBe('a'.repeat(39) + '…');
  act(() => observers[0].notify(200));
  expect(frames.size).toBe(0);
  act(() => observers[0].notify(50));
  flushFrames();
  expect(visible(container)).toBe('a'.repeat(9) + '…');
});

it('updates text and rows, expands completely, then crops at the current width', () => {
  const { container, rerender } = render(<CroppedText opened={false} rows={1}>{text}</CroppedText>);
  expect(visible(container)).toBe('a'.repeat(9) + '…');
  rerender(<CroppedText opened rows={1}>{text}</CroppedText>);
  expect(visible(container)).toBe(text);
  width = 50;
  rerender(<CroppedText opened={false} rows={2}>{'b'.repeat(30)}</CroppedText>);
  expect(visible(container)).toBe('b'.repeat(9) + '…');
  rerender(<CroppedText opened={false} rows={0}>{text}</CroppedText>);
  expect(visible(container)).toBe('');
});

it('recovers when a zero-width container becomes visible', () => {
  width = 0;
  const { container } = render(<CroppedText opened={false} rows={1}>{text}</CroppedText>);
  expect(visible(container)).toBe('');
  act(() => observers[0].notify(100));
  flushFrames();
  expect(visible(container)).toBe('a'.repeat(9) + '…');
});

it('renders no visible text when even an ellipsis overflows horizontally', () => {
  jest.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(120);
  const { container } = render(<CroppedText opened={false}>{text}</CroppedText>);
  expect(visible(container)).toBe('');
});

it('disconnects and cancels scheduled work on unmount, ignoring stale notifications', () => {
  const { unmount } = render(<CroppedText opened={false}>{text}</CroppedText>);
  const observer = observers[0];
  act(() => observer.notify(200));
  expect(frames.size).toBe(1);
  unmount();
  expect(observer.disconnect).toHaveBeenCalledTimes(1);
  expect(frames.size).toBe(0);
  act(() => observer.notify(300));
  expect(frames.size).toBe(0);
});

it('uses window resize as a fallback when ResizeObserver is unavailable', () => {
  globalThis.ResizeObserver = undefined as unknown as typeof ResizeObserver;
  const { container, unmount } = render(<CroppedText opened={false} rows={1}>{text}</CroppedText>);
  width = 200;
  act(() => window.dispatchEvent(new Event('resize')));
  flushFrames();
  expect(visible(container)).toBe('a'.repeat(19) + '…');
  unmount();
  act(() => window.dispatchEvent(new Event('resize')));
  expect(frames.size).toBe(0);
});
