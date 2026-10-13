import { cropTextToFit, ELLIPSIS } from './cropText';

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const length = (text: string): number => Array.from(segmenter.segment(text)).length;

describe('cropTextToFit', () => {
  it('preserves fitting and empty text', () => {
    expect(cropTextToFit('Short text', () => true)).toBe('Short text');
    expect(cropTextToFit('', () => false)).toBe('');
  });

  it('finds the longest fitting prefix including the ellipsis', () => {
    const fits = jest.fn((text: string) => text.length <= 120);
    const text = 'a'.repeat(10000);
    expect(cropTextToFit(text, fits)).toBe('a'.repeat(119) + ELLIPSIS);
    expect(fits.mock.calls.length).toBeLessThanOrEqual(17);
  });

  it('handles space too small even for an ellipsis', () => {
    expect(cropTextToFit('Text', () => false)).toBe('');
    expect(cropTextToFit('Text', (text) => text.length <= 1)).toBe(ELLIPSIS);
  });

  it('removes trailing whitespace before an ellipsis', () => {
    expect(cropTextToFit('abc   defgh', (text) => text.length <= 5)).toBe('abc…');
  });

  it('keeps joined emoji and combining marks intact', () => {
    const text = '👩‍💻👨‍👩‍👧‍👦е\u0301🚀finish';
    expect(cropTextToFit(text, (candidate) => length(candidate) <= 4)).toBe('👩‍💻👨‍👩‍👧‍👦е\u0301…');
  });
});
