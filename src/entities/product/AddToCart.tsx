import { useTranslation } from 'react-i18next';
import './product.css';

export type AddToCartProps = Readonly<{
  count: number;
}>;

export const AddToCart = ({ count }: AddToCartProps): JSX.Element => {
  const { t } = useTranslation();
  if (count <= 0) {
    return (
      <button className="add-to-cart add-to-cart--empty" type="button">
        {t('product.add')}
      </button>
    );
  }

  return (
    <div className="add-to-cart add-to-cart--counter">
      <button type="button" aria-label={t('product.decrease')}>
        −
      </button>
      <input aria-label={t('product.countLabel')} type="number" min="0" value={count} readOnly />
      <button type="button" aria-label={t('product.increase')}>
        +
      </button>
    </div>
  );
};
