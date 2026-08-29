import { createRandomOperation, createRandomProduct } from './3_write';

describe('random entity factories', () => {
  const createdAt = '2023-06-06T12:06:56.957Z';

  it('creates an operation', () => {
    const operation = createRandomOperation(createdAt);
    expect(operation).toEqual(
      expect.objectContaining({
        createdAt,
        id: expect.any(String),
        name: expect.any(String),
        amount: expect.any(Number),
        category: expect.any(Object),
        type: expect.stringMatching(/^(Cost|Profit)$/),
      }),
    );
  });

  it('creates a product', () => {
    const product = createRandomProduct(createdAt);
    expect(product).toEqual(
      expect.objectContaining({
        createdAt,
        id: expect.any(String),
        name: expect.any(String),
        photo: expect.any(String),
        oldPrice: expect.any(Number),
        price: expect.any(Number),
        category: expect.any(Object),
      }),
    );
  });
});
