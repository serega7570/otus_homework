import type { CartItemProps } from './productTypes';
import './product.css';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const CartItem = ({ price, image, name, count = 1 }: CartItemProps): JSX.Element => (
  <article className="cart-item">
    <img src={image} alt={name} />
    <div className="cart-item__name">
      <h3>{name}</h3>
      <span>Количество: {count}</span>
    </div>
    <strong>{money.format(price * count)}</strong>
    <button type="button" aria-label={`Удалить ${name} из корзины`}>
      <span aria-hidden="true">×</span>
      Удалить
    </button>
  </article>
);
