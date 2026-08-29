import { AddToCart } from './AddToCart';
import type { ProductDetailsProps } from './productTypes';
import './product.css';

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const ProductDetails = ({
  price,
  image,
  category,
  name,
  description,
  count = 0,
}: ProductDetailsProps): JSX.Element => (
  <article className="product-details">
    <div className="product-details__visual">
      <img src={image} alt={name} />
    </div>
    <div className="product-details__content">
      <span className="product-details__category">{category}</span>
      <h2>{name}</h2>
      <p>{description}</p>
      <strong>{money.format(price)}</strong>
      <AddToCart count={count} />
    </div>
  </article>
);
