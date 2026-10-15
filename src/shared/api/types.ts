import type { Profile } from '../../app/store/sessionSlice';
export type { Profile };
export type Category = { id: string; name: string };
export type ServerOperation = {
  id: string; name: string; desc?: string; amount: number; type: 'Cost' | 'Profit';
  date: string; createdAt: string; category: Category;
};
export type OperationBody = {
  name: string; desc: string; amount: number; type: 'Cost' | 'Profit'; date: string; categoryId: string;
};
export type Product = { id: string; name: string; desc?: string; price: number; category: Category };
export type ProductBody = { name: string; desc: string; price: number; categoryId: string };
export type Order = {
  id: string; status: string; createdAt: string;
  products: { product: Product; quantity: number }[];
};
export type OrderBody = { products: { id: string; quantity: number }[]; status: 'pending_confirmation' };
export type Page<T> = { data: T[]; pagination: { pageSize: number; pageNumber: number; total: number } };
