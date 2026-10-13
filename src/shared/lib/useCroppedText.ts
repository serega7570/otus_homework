import { useLayoutEffect, useRef, useState } from 'react';
import { cropTextToFit } from './cropText';

type CroppedTextOptions = Readonly<{
  text: string;
  rows: number;
  opened: boolean;
  className?: string;
}>;

export const useCroppedText = ({ text, rows, opened, className }: CroppedTextOptions) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [croppedText, setCroppedText] = useState(text);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const probe = measureRef.current;
    if (!root || !probe) return;

    let active = true;
    let frame = 0;
    const readWidth = (): number => {
      const style = getComputedStyle(root);
      return Math.max(0, root.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0));
    };
    let width = readWidth();
    const lineCount = Number.isFinite(rows) ? Math.max(0, Math.floor(rows)) : 3;

    const measure = (): void => {
      if (!active) return;
      if (opened) {
        setCroppedText(text);
        return;
      }
      if (width <= 0 || lineCount === 0) {
        setCroppedText('');
        return;
      }

      probe.style.width = `${width}px`;
      probe.textContent = 'M';
      const lineHeight = probe.getBoundingClientRect().height;
      if (lineHeight <= 0) {
        probe.textContent = '';
        return;
      }

      const maxHeight = lineHeight * lineCount;
      const nextText = cropTextToFit(text, (candidate) => {
        probe.textContent = candidate;
        return probe.getBoundingClientRect().height <= maxHeight + 0.5 && probe.scrollWidth <= Math.ceil(width);
      });
      probe.textContent = '';
      setCroppedText(nextText);
    };

    const schedule = (): void => {
      if (!active) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    // Initial cropping completes before the first browser paint.
    measure();
    let observer: ResizeObserver | undefined;
    const onWindowResize = (): void => {
      width = readWidth();
      schedule();
    };

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver((entries) => {
        const entry = entries.find((item) => item.target === root);
        if (!entry || entry.contentRect.width === width) return;
        width = entry.contentRect.width;
        schedule();
      });
      observer.observe(root);
    } else {
      window.addEventListener('resize', onWindowResize);
    }

    const fonts = document.fonts;
    void fonts?.ready.then(() => schedule());
    fonts?.addEventListener('loadingdone', schedule);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('resize', onWindowResize);
      fonts?.removeEventListener('loadingdone', schedule);
      probe.textContent = '';
    };
  }, [text, rows, opened, className]);

  return { rootRef, measureRef, visibleText: opened ? text : croppedText };
};
