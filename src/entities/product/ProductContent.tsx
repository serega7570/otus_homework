import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../shared/lib/formatters';
import type { ProductViewProps } from './productTypes';
import './product.css';

export type ProductContentProps = Pick<ProductViewProps, 'name' | 'description' | 'price'> & Readonly<{
  className: string;
  heading?: 'h2' | 'h3';
  beforeTitle?: ReactNode;
  children: ReactNode;
}>;

export const ProductContent = ({
  name, description, price, className, heading: Heading = 'h3', beforeTitle, children,
}: ProductContentProps): JSX.Element => {
  const { i18n } = useTranslation();

  return (
    <div className={className}>
      {beforeTitle}
      <Heading>{name}</Heading>
      <p>{description}</p>
      <strong>{formatCurrency(price, 0, i18n.language)}</strong>
      {children}
    </div>
  );
};
