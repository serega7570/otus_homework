import { AccountService } from './AccountService';
import { InMemoryDiscountRepository } from './InMemoryDiscountRepository';
import { productTypes, userTypes } from './types';

it('persists independent policies for all four user types and all twelve product pairs', async () => {
  const repository = new InMemoryDiscountRepository();
  const writer = new AccountService(repository);
  for (const [userIndex, user] of userTypes.entries()) {
    await writer.setUserDiscount(user, userIndex * 5);
    for (const [productIndex, product] of productTypes.entries()) {
      await writer.setProductDiscount(user, product, userIndex + productIndex + 1);
    }
  }
  // A second service instance reads the same storage, rather than its own cache.
  const reader = new AccountService(repository);
  for (const [userIndex, user] of userTypes.entries()) {
    for (const [productIndex, product] of productTypes.entries()) {
      await expect(reader.getUserDiscount(user)).resolves.toBe(userIndex * 5);
      await expect(reader.getProductDiscount(user, product)).resolves.toBe(userIndex + productIndex + 1);
      await expect(reader.calculateDiscount(user, product)).resolves.toBe(userIndex * 5 + userIndex + productIndex + 1);
    }
  }
});

it('updates and resets discounts without affecting other products or users', async () => {
  const service = new AccountService(new InMemoryDiscountRepository());
  await service.setUserDiscount('Gold', 10);
  await service.setProductDiscount('Gold', 'Car', 5);
  await service.setProductDiscount('Gold', 'Toy', 3);
  await service.setUserDiscount('Premium', 7);
  await service.setProductDiscount('Gold', 'Car', 8);
  await expect(service.calculateDiscount('Gold', 'Car')).resolves.toBe(18);
  await expect(service.calculateDiscount('Gold', 'Toy')).resolves.toBe(13);
  await expect(service.calculateDiscount('Gold', 'Food')).resolves.toBe(10);
  await expect(service.calculateDiscount('Premium', 'Car')).resolves.toBe(7);
  await service.setProductDiscount('Gold', 'Car', 0);
  await expect(service.calculateDiscount('Gold', 'Car')).resolves.toBe(10);
  await service.setUserDiscount('Gold', 0);
  await expect(service.calculateDiscount('Gold', 'Toy')).resolves.toBe(3);
});

it('keeps separate repositories isolated and invalid updates preserve saved discounts', async () => {
  const first = new AccountService(new InMemoryDiscountRepository());
  const second = new AccountService(new InMemoryDiscountRepository());
  await first.setUserDiscount('Standard', 5);
  await first.setProductDiscount('Standard', 'Food', 2);
  await expect(first.setUserDiscount('Standard', -1)).rejects.toBeInstanceOf(RangeError);
  await expect(first.setProductDiscount('Standard', 'Food', 101)).rejects.toBeInstanceOf(RangeError);
  await expect(first.calculateDiscount('Standard', 'Food')).resolves.toBe(7);
  await expect(second.calculateDiscount('Standard', 'Food')).resolves.toBe(0);
});
