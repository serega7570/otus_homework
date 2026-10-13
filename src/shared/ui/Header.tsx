import { Logo } from './Logo';
import { useTranslation } from 'react-i18next';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import './components.css';

export type NavigationItem = Readonly<{
  label: string;
  href: string;
}>;

export type HeaderProps = Readonly<{
  brand?: string;
  navigation?: ReadonlyArray<NavigationItem>;
}>;

export const Header = ({
  brand = 'Secure UI',
  navigation,
}: HeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const items = navigation ?? [
    { label: t('navigation.overview'), href: '#overview' },
    { label: t('navigation.operations'), href: '#operations' },
    { label: t('navigation.products'), href: '#products' },
  ];

  return (
    <header className="ui-header">
      <Logo label={brand} />
      <nav className="ui-header__nav" aria-label={t('navigation.label')}>
        {items.map(({ label, href }) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="ui-header__controls">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="ui-header__avatar" aria-label={t('profile.label')}>
        {t('profile.initial')}
      </div>
    </header>
  );
};
