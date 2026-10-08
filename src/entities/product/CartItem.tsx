import { useTranslation } from 'react-i18next';
import type { CartItemProps } from './productTypes';
import { formatCurrency } from '../../shared/lib/formatters';
import './product.css';

export const CartItem = ({ price, image, name, count = 1 }: CartItemProps): JSX.Element => {
  const { t, i18n } = useTranslation();
  return (
    <article className="cart-item">
      <img src={image} alt={name} />
      <div className="cart-item__name">
        <h3>{name}</h3>
        <span>{t('product.count', { count })}</span>
      </div>
      <strong>{formatCurrency(price * count, 0, i18n.language)}</strong>
      <button type="button" aria-label={t('product.removeLabel', { name })}>
        <span aria-hidden="true">×</span>
        {t('product.remove')}
      </button>
    </article>
  );
};
