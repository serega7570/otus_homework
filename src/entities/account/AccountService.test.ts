import { AccountService } from './AccountService';
import { productTypes, userTypes, type DiscountRepository, type ProductType, type UserType } from './types';

const combinations = userTypes.flatMap((user) => productTypes.map((product) => [user, product] as const));
let repository: jest.Mocked<DiscountRepository>;
let service: AccountService;

beforeEach(() => {
  repository = {
    readUserDiscount: jest.fn().mockResolvedValue(undefined), writeUserDiscount: jest.fn().mockResolvedValue(undefined),
    readProductDiscount: jest.fn().mockResolvedValue(undefined), writeProductDiscount: jest.fn().mockResolvedValue(undefined),
  };
  service = new AccountService(repository);
});

describe('general policies for all user types', () => {
  it.each(userTypes)('writes and reads a configured discount for %s', async (user) => {
    await expect(service.setUserDiscount(user, 12.5)).resolves.toBeUndefined();
    expect(repository.writeUserDiscount).toHaveBeenCalledWith(user, 12.5);
    expect(repository.writeProductDiscount).not.toHaveBeenCalled();
    repository.readUserDiscount.mockResolvedValue(12.5);
    await expect(service.getUserDiscount(user)).resolves.toBe(12.5);
    expect(repository.readUserDiscount).toHaveBeenCalledWith(user);
  });

  it.each(userTypes)('defaults an absent general policy for %s to zero', async (user) => {
    await expect(service.getUserDiscount(user)).resolves.toBe(0);
  });
});

describe('product policies for every user/product pair', () => {
  it.each(combinations)('writes and reads the policy for %s / %s', async (user, product) => {
    await service.setProductDiscount(user, product, 7.25);
    expect(repository.writeProductDiscount).toHaveBeenCalledWith(user, product, 7.25);
    expect(repository.writeUserDiscount).not.toHaveBeenCalled();
    repository.readProductDiscount.mockResolvedValue(7.25);
    await expect(service.getProductDiscount(user, product)).resolves.toBe(7.25);
    expect(repository.readProductDiscount).toHaveBeenCalledWith(user, product);
  });

  it.each(combinations)('defaults an absent product policy for %s / %s to zero', async (user, product) => {
    await expect(service.getProductDiscount(user, product)).resolves.toBe(0);
  });
});

describe('additive discount calculation', () => {
  it.each(combinations)('adds both discounts for %s / %s', async (user, product) => {
    repository.readUserDiscount.mockResolvedValue(10);
    repository.readProductDiscount.mockResolvedValue(5);
    await expect(service.calculateDiscount(user, product)).resolves.toBe(15);
    expect(repository.readUserDiscount).toHaveBeenCalledTimes(1);
    expect(repository.readUserDiscount).toHaveBeenCalledWith(user);
    expect(repository.readProductDiscount).toHaveBeenCalledTimes(1);
    expect(repository.readProductDiscount).toHaveBeenCalledWith(user, product);
  });

  it.each([
    [undefined, undefined, 0], [10, undefined, 10], [undefined, 5, 5], [0, 0, 0], [12.5, 2.25, 14.75], [80, 70, 150],
  ])('combines general=%s and product=%s as %s', async (general, product, total) => {
    repository.readUserDiscount.mockResolvedValue(general);
    repository.readProductDiscount.mockResolvedValue(product);
    await expect(service.calculateDiscount('Gold', 'Car')).resolves.toBe(total);
  });
});

describe('validation at the service boundary', () => {
  it.each([-1, 101, NaN, Infinity, -Infinity])('rejects invalid discount %s before writing', async (discount) => {
    await expect(service.setUserDiscount('Standard', discount)).rejects.toBeInstanceOf(RangeError);
    await expect(service.setProductDiscount('Gold', 'Toy', discount)).rejects.toBeInstanceOf(RangeError);
    expect(repository.writeUserDiscount).not.toHaveBeenCalled();
    expect(repository.writeProductDiscount).not.toHaveBeenCalled();
  });

  it.each([0, 100])('allows discount boundary %s', async (discount) => {
    await service.setUserDiscount('Free', discount);
    await service.setProductDiscount('Free', 'Food', discount);
    expect(repository.writeUserDiscount).toHaveBeenCalledWith('Free', discount);
    expect(repository.writeProductDiscount).toHaveBeenCalledWith('Free', 'Food', discount);
  });

  it('rejects unknown user types for every public method before touching storage', async () => {
    const unknown = 'Unknown' as UserType;
    await expect(service.getUserDiscount(unknown)).rejects.toBeInstanceOf(RangeError);
    await expect(service.setUserDiscount(unknown, 10)).rejects.toBeInstanceOf(RangeError);
    await expect(service.getProductDiscount(unknown, 'Car')).rejects.toBeInstanceOf(RangeError);
    await expect(service.setProductDiscount(unknown, 'Car', 10)).rejects.toBeInstanceOf(RangeError);
    await expect(service.calculateDiscount(unknown, 'Car')).rejects.toBeInstanceOf(RangeError);
    Object.values(repository).forEach((method) => expect(method).not.toHaveBeenCalled());
  });

  it('rejects unknown product types before touching storage', async () => {
    const unknown = 'Unknown' as ProductType;
    await expect(service.getProductDiscount('Standard', unknown)).rejects.toBeInstanceOf(RangeError);
    await expect(service.setProductDiscount('Standard', unknown, 10)).rejects.toBeInstanceOf(RangeError);
    await expect(service.calculateDiscount('Standard', unknown)).rejects.toBeInstanceOf(RangeError);
    Object.values(repository).forEach((method) => expect(method).not.toHaveBeenCalled());
  });

  it.each([-1, 101, NaN])('rejects corrupted stored discount %s instead of calculating with it', async (discount) => {
    repository.readUserDiscount.mockResolvedValue(discount);
    repository.readProductDiscount.mockResolvedValue(discount);
    await expect(service.getUserDiscount('Gold')).rejects.toBeInstanceOf(RangeError);
    await expect(service.getProductDiscount('Gold', 'Car')).rejects.toBeInstanceOf(RangeError);
    await expect(service.calculateDiscount('Gold', 'Car')).rejects.toBeInstanceOf(RangeError);
  });
});

describe('storage failures', () => {
  it('propagates failed writes to the caller', async () => {
    const error = new Error('Storage write failed');
    repository.writeUserDiscount.mockRejectedValue(error);
    repository.writeProductDiscount.mockRejectedValue(error);
    await expect(service.setUserDiscount('Standard', 10)).rejects.toBe(error);
    await expect(service.setProductDiscount('Gold', 'Car', 10)).rejects.toBe(error);
  });

  it('propagates a general read failure instead of replacing it with zero', async () => {
    const error = new Error('General read failed');
    repository.readUserDiscount.mockRejectedValue(error);
    await expect(service.getUserDiscount('Standard')).rejects.toBe(error);
    await expect(service.calculateDiscount('Standard', 'Food')).rejects.toBe(error);
  });

  it('propagates a product read failure instead of replacing it with zero', async () => {
    const error = new Error('Product read failed');
    repository.readProductDiscount.mockRejectedValue(error);
    await expect(service.getProductDiscount('Gold', 'Car')).rejects.toBe(error);
    await expect(service.calculateDiscount('Gold', 'Car')).rejects.toBe(error);
  });
});
