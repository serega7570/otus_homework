export type ProductViewProps = Readonly<{
  price: number;
  image: string;
  name: string;
  description: string;
  count?: number;
}>;

export type ProductDetailsProps = ProductViewProps & Readonly<{
  category: string;
}>;

export type CartItemProps = Pick<ProductViewProps, 'price' | 'image' | 'name' | 'count'>;
