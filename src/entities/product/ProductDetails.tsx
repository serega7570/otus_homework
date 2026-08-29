import { AddToCart } from './AddToCart';
import type { ProductDetailsProps } from './productTypes';
import { formatCurrency } from '../../shared/lib/formatters';
import './product.css';

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
      <strong>{formatCurrency(price, 0)}</strong>
      <AddToCart count={count} />
    </div>
  </article>
);
