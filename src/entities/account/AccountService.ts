import { productTypes, userTypes, type AccountServiceContract, type DiscountRepository, type ProductType, type UserType } from './types';

const assertUserType = (userType: UserType): void => {
  if (!userTypes.includes(userType)) throw new RangeError(`Unknown user type: ${userType}`);
};
const assertProductType = (productType: ProductType): void => {
  if (!productTypes.includes(productType)) throw new RangeError(`Unknown product type: ${productType}`);
};
const assertDiscount = (discount: number): void => {
  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    throw new RangeError('A discount must be a finite percentage between 0 and 100.');
  }
};
const storedDiscount = (value: number | undefined): number => {
  const discount = value === undefined ? 0 : value;
  assertDiscount(discount);
  return discount;
};

export class AccountService implements AccountServiceContract {
  constructor(private readonly repository: DiscountRepository) {}

  async getUserDiscount(userType: UserType): Promise<number> {
    assertUserType(userType);
    return storedDiscount(await this.repository.readUserDiscount(userType));
  }

  async setUserDiscount(userType: UserType, discount: number): Promise<void> {
    assertUserType(userType);
    assertDiscount(discount);
    await this.repository.writeUserDiscount(userType, discount);
  }

  async getProductDiscount(userType: UserType, productType: ProductType): Promise<number> {
    assertUserType(userType);
    assertProductType(productType);
    return storedDiscount(await this.repository.readProductDiscount(userType, productType));
  }

  async setProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void> {
    assertUserType(userType);
    assertProductType(productType);
    assertDiscount(discount);
    await this.repository.writeProductDiscount(userType, productType, discount);
  }

  async calculateDiscount(userType: UserType, productType: ProductType): Promise<number> {
    // Validate both keys before either read, including external JavaScript callers.
    assertUserType(userType);
    assertProductType(productType);
    const [general, product] = await Promise.all([
      this.getUserDiscount(userType), this.getProductDiscount(userType, productType),
    ]);
    return general + product;
  }
}
