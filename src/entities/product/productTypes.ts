export type ProductViewProps = {
  price: number;
  image: string;
  name: string;
  description: string;
  count?: number;
};

export type ProductDetailsProps = ProductViewProps & {
  category: string;
};

export type CartItemProps = Pick<ProductViewProps, 'price' | 'image' | 'name' | 'count'>;
