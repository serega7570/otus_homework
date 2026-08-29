import { AddToCart } from './AddToCart';
import type { ProductViewProps } from './productTypes';
import './product.css';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const ProductCard = ({
  price,
  image,
  name,
  description,
  count = 0,
}: ProductViewProps): JSX.Element => (
  <article className="product-card">
    <div className="product-card__image-wrap">
      <img src={image} alt={name} />
      <span>Новинка</span>
    </div>
    <div className="product-card__content">
      <h3>{name}</h3>
      <p>{description}</p>
      <strong>{money.format(price)}</strong>
      <AddToCart count={count} />
    </div>
  </article>
);
