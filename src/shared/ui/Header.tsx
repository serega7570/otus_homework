import { Logo } from './Logo';
import './components.css';

export type HeaderProps = {
  brand?: string;
  navigation?: string[];
};

export const Header = ({
  brand = 'Secure UI',
  navigation = ['Обзор', 'Операции', 'Товары'],
}: HeaderProps): JSX.Element => (
  <header className="ui-header">
    <Logo label={brand} />
    <nav className="ui-header__nav" aria-label="Основная навигация">
      {navigation.map((item) => (
        <a href={`#${item.toLowerCase()}`} key={item}>
          {item}
        </a>
      ))}
    </nav>
    <div className="ui-header__avatar" aria-label="Профиль Сергея">
      С
    </div>
  </header>
);
