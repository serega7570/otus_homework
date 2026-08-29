import type { CartItemProps } from './productTypes';
import { formatCurrency } from '../../shared/lib/formatters';
import './product.css';

export const CartItem = ({ price, image, name, count = 1 }: CartItemProps): JSX.Element => (
  <article className="cart-item">
    <img src={image} alt={name} />
    <div className="cart-item__name">
      <h3>{name}</h3>
      <span>Количество: {count}</span>
    </div>
    <strong>{formatCurrency(price * count, 0)}</strong>
    <button type="button" aria-label={`Удалить ${name} из корзины`}>
      <span aria-hidden="true">×</span>
      Удалить
    </button>
  </article>
);
