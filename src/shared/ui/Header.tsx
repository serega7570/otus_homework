import { Logo } from './Logo';
import './components.css';

export type NavigationItem = Readonly<{
  label: string;
  href: string;
}>;

export type HeaderProps = Readonly<{
  brand?: string;
  navigation?: ReadonlyArray<NavigationItem>;
}>;

const defaultNavigation: ReadonlyArray<NavigationItem> = [
  { label: 'Обзор', href: '#overview' },
  { label: 'Операции', href: '#operations' },
  { label: 'Товары', href: '#products' },
];

export const Header = ({
  brand = 'Secure UI',
  navigation = defaultNavigation,
}: HeaderProps): JSX.Element => (
  <header className="ui-header">
    <Logo label={brand} />
    <nav className="ui-header__nav" aria-label="Основная навигация">
      {navigation.map(({ label, href }) => (
        <a href={href} key={href}>
          {label}
        </a>
      ))}
    </nav>
    <div className="ui-header__avatar" aria-label="Профиль Сергея">
      С
    </div>
  </header>
);
