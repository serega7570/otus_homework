export const userTypes = ['Standard', 'Premium', 'Gold', 'Free'] as const;
export const productTypes = ['Car', 'Toy', 'Food'] as const;
export type UserType = typeof userTypes[number];
export type ProductType = typeof productTypes[number];

/** Values are percentages. An absent policy is represented by undefined. */
export interface DiscountRepository {
  readUserDiscount(userType: UserType): Promise<number | undefined>;
  writeUserDiscount(userType: UserType, discount: number): Promise<void>;
  readProductDiscount(userType: UserType, productType: ProductType): Promise<number | undefined>;
  writeProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void>;
}

export interface AccountServiceContract {
  getUserDiscount(userType: UserType): Promise<number>;
  setUserDiscount(userType: UserType, discount: number): Promise<void>;
  getProductDiscount(userType: UserType, productType: ProductType): Promise<number>;
  setProductDiscount(userType: UserType, productType: ProductType, discount: number): Promise<void>;
  calculateDiscount(userType: UserType, productType: ProductType): Promise<number>;
}
