import { useTranslation } from 'react-i18next';
import { AddToCart } from './AddToCart';
import type { ProductViewProps } from './productTypes';
import { ProductContent } from './ProductContent';
import './product.css';

export const ProductCard = ({
  price,
  image,
  name,
  description,
  count = 0,
}: ProductViewProps): JSX.Element => {
  const { t } = useTranslation();
  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img src={image} alt={name} />
        <span>{t('product.new')}</span>
      </div>
      <ProductContent className="product-card__content" name={name} description={description} price={price}>
        <AddToCart count={count} />
      </ProductContent>
    </article>
  );
};
