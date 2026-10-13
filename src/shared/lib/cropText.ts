export const ELLIPSIS = '…';

// Grapheme boundaries keep surrogate pairs and joined emoji intact.
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export const cropTextToFit = (text: string, fits: (candidate: string) => boolean): string => {
  if (!text || fits(text)) return text;
  if (!fits(ELLIPSIS)) return '';

  const characters = Array.from(segmenter.segment(text), ({ segment }) => segment);
  const candidate = (length: number): string => characters.slice(0, length).join('').trimEnd() + ELLIPSIS;
  let left = 0;
  let right = characters.length - 1;

  while (left < right) {
    const middle = Math.ceil((left + right) / 2);
    if (fits(candidate(middle))) left = middle;
    else right = middle - 1;
  }

  return candidate(left);
};
