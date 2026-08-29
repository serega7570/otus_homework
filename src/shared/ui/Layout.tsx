import type { ReactNode } from 'react';
import { Header } from './Header';
import './components.css';

export type LayoutProps = Readonly<{
  children: ReactNode;
  headerTitle?: string;
}>;

export const Layout = ({ children, headerTitle = 'Secure UI' }: LayoutProps): JSX.Element => (
  <div className="ui-layout">
    <Header brand={headerTitle} />
    <main className="ui-layout__content">{children}</main>
  </div>
);
