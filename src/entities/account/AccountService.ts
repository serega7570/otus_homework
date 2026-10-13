import type { AccountServiceContract, DiscountRepository, ProductType, UserType } from './types';

// RED: only the contract exists; behavior will be implemented after the tests fail.
export class AccountService implements AccountServiceContract {
  constructor(private readonly repository: DiscountRepository) {}
  async getUserDiscount(userType: UserType): Promise<number> { throw new Error('Not implemented'); }
  async setUserDiscount(userType: UserType, discount: number): Promise<void> { throw new Error('Not implemented'); }
  async getProductDiscount(userType: UserType, productType: ProductType): Promise<number> { throw new Error('Not implemented'); }
  async setProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void> { throw new Error('Not implemented'); }
  async calculateDiscount(userType: UserType, productType: ProductType): Promise<number> { throw new Error('Not implemented'); }
}
