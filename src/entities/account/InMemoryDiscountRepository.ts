import type { DiscountRepository, ProductType, UserType } from './types';

export class InMemoryDiscountRepository implements DiscountRepository {
  async readUserDiscount(userType: UserType): Promise<number | undefined> { throw new Error('Not implemented'); }
  async writeUserDiscount(userType: UserType, discount: number): Promise<void> { throw new Error('Not implemented'); }
  async readProductDiscount(userType: UserType, productType: ProductType): Promise<number | undefined> { throw new Error('Not implemented'); }
  async writeProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void> { throw new Error('Not implemented'); }
}
