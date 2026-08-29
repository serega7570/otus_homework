import './product.css';

export type AddToCartProps = Readonly<{
  count: number;
}>;

export const AddToCart = ({ count }: AddToCartProps): JSX.Element => {
  if (count <= 0) {
    return (
      <button className="add-to-cart add-to-cart--empty" type="button">
        В корзину
      </button>
    );
  }

  return (
    <div className="add-to-cart add-to-cart--counter">
      <button type="button" aria-label="Уменьшить количество">
        −
      </button>
      <input aria-label="Количество товара" type="number" min="0" value={count} readOnly />
      <button type="button" aria-label="Увеличить количество">
        +
      </button>
    </div>
  );
};
