export type Category = {
  id: string;
  name: string;
  photo?: string;
};

export type Product = {
  id: string;
  name: string;
  photo: string;
  desc?: string;
  createdAt: string;
  oldPrice?: number;
  price: number;
  category: Category;
};

type OperationBase = {
  id: string;
  name: string;
  desc?: string;
  createdAt: string;
  amount: number;
  category: Category;
};

export type Cost = OperationBase & {
  type: 'Cost';
};

export type Profit = OperationBase & {
  type: 'Profit';
};

export type Operation = Cost | Profit;

const categories: Category[] = [
  { id: 'food', name: 'Food', photo: 'https://picsum.photos/seed/food/200' },
  { id: 'tech', name: 'Technology', photo: 'https://picsum.photos/seed/tech/200' },
  { id: 'services', name: 'Services' },
];

const randomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
const randomAmount = (min: number, max: number): number =>
  Math.round((min + Math.random() * (max - min)) * 100) / 100;
const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createRandomProduct = (createdAt: string): Product => {
  const category = randomItem(categories);
  const price = randomAmount(100, 10_000);

  return {
    id: createId(),
    name: `Product ${Math.floor(Math.random() * 1_000)}`,
    photo: `https://picsum.photos/seed/${createId()}/400`,
    desc: `Product from the ${category.name} category`,
    createdAt,
    oldPrice: Math.round(price * 1.2 * 100) / 100,
    price,
    category,
  };
};

export const createRandomOperation = (createdAt: string): Operation => {
  const type: Operation['type'] = Math.random() < 0.5 ? 'Cost' : 'Profit';

  return {
    id: createId(),
    name: type === 'Cost' ? 'Purchase' : 'Sale',
    desc: `Random ${type.toLowerCase()} operation`,
    createdAt,
    amount: randomAmount(10, 5_000),
    category: randomItem(categories),
    type,
  };
};
