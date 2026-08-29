import './components.css';

export type LogoProps = {
  label?: string;
};

export const Logo = ({ label = 'Secure UI' }: LogoProps): JSX.Element => (
  <div className="ui-logo" aria-label={label}>
    <span className="ui-logo__mark" aria-hidden="true">
      S
    </span>
    <span className="ui-logo__label">{label}</span>
  </div>
);
