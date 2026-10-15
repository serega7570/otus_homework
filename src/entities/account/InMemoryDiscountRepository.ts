import type { DiscountRepository, ProductType, UserType } from './types';

export class InMemoryDiscountRepository implements DiscountRepository {
  private readonly general = new Map<UserType, number>();
  private readonly products = new Map<UserType, Map<ProductType, number>>();

  async readUserDiscount(userType: UserType): Promise<number | undefined> {
    return this.general.get(userType);
  }

  async writeUserDiscount(userType: UserType, discount: number): Promise<void> {
    this.general.set(userType, discount);
  }

  async readProductDiscount(userType: UserType, productType: ProductType): Promise<number | undefined> {
    return this.products.get(userType)?.get(productType);
  }

  async writeProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void> {
    let policies = this.products.get(userType);
    if (!policies) {
      policies = new Map<ProductType, number>();
      this.products.set(userType, policies);
    }
    policies.set(productType, discount);
  }
}
