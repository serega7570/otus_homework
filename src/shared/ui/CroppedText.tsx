import { useCroppedText } from '../lib/useCroppedText';
import './croppedText.css';

export type CroppedTextProps = Readonly<{
  children: string;
  opened: boolean;
  rows?: number;
  className?: string;
}>;

export const CroppedText = ({ children, opened, rows = 3, className }: CroppedTextProps): JSX.Element => {
  const { rootRef, measureRef, visibleText } = useCroppedText({ text: children, rows, opened, className });

  return (
    <div ref={rootRef} className={['ui-cropped-text', className].filter(Boolean).join(' ')}>
      <span className="ui-cropped-text__visible" aria-hidden="true">{visibleText}</span>
      <span className="ui-cropped-text__accessible">{children}</span>
      <div ref={measureRef} className="ui-cropped-text__measure" aria-hidden="true" />
    </div>
  );
};
