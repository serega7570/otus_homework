import { formatCurrency, formatDate } from './formatters';

describe('formatters', () => {
  it('formats currency with the requested precision', () => {
    expect(formatCurrency(24990, 0)).toContain('24 990');
    expect(formatCurrency(125.5)).toContain('125,50');
  });

  it('formats valid dates and safely preserves invalid values', () => {
    expect(formatDate('2026-08-29T12:00:00.000Z')).toContain('2026');
    expect(formatDate('not-a-date')).toBe('not-a-date');
  });
});
