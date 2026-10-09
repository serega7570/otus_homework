import { AddToCart } from './AddToCart';
import type { ProductDetailsProps } from './productTypes';
import { ProductContent } from './ProductContent';
import './product.css';

export const ProductDetails = ({
  price,
  image,
  category,
  name,
  description,
  count = 0,
}: ProductDetailsProps): JSX.Element => {
  return (
    <article className="product-details">
      <div className="product-details__visual">
        <img src={image} alt={name} />
      </div>
      <ProductContent
        className="product-details__content"
        heading="h2"
        name={name}
        description={description}
        price={price}
        beforeTitle={<span className="product-details__category">{category}</span>}
      >
        <AddToCart count={count} />
      </ProductContent>
    </article>
  );
};
