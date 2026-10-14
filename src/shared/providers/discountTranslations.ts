export const discountsRu = {
  title: 'Скидки пользователей', description: 'Задайте общую скидку для типа пользователя и дополнительную скидку на выбранный тип товара. Итоговая скидка складывается из обеих.',
  userType: 'Тип пользователя', productType: 'Тип товара', general: 'Общая скидка, %', product: 'Скидка на товар, %',
  generalForm: 'Общая скидка', productForm: 'Товарная скидка', saveGeneral: 'Сохранить общую скидку', saveProduct: 'Сохранить скидку на товар',
  generalHint: 'Для всех товаров пользователей {{userType}}.', productHint: 'Только {{productType}} для пользователей {{userType}}.',
  savedPolicy: 'Сохранённые скидки', total: 'Итоговая скидка', loading: 'Загружаем скидки…', retry: 'Повторить загрузку',
  invalid: 'Введите число от 0 до 100.', loadError: 'Не удалось загрузить скидки.', saveError: 'Не удалось сохранить скидку.',
  products: { Car: 'Автомобиль', Toy: 'Игрушка', Food: 'Продукты' },
};

export const discountsEn: typeof discountsRu = {
  title: 'User discounts', description: 'Set a general discount for a user type and an additional discount for a product type. The total is the sum of both.',
  userType: 'User type', productType: 'Product type', general: 'General discount, %', product: 'Product discount, %',
  generalForm: 'General discount', productForm: 'Product discount', saveGeneral: 'Save general discount', saveProduct: 'Save product discount',
  generalHint: 'For all products for {{userType}} users.', productHint: 'Only {{productType}} for {{userType}} users.',
  savedPolicy: 'Saved discounts', total: 'Total discount', loading: 'Loading discounts…', retry: 'Retry loading',
  invalid: 'Enter a number from 0 to 100.', loadError: 'Could not load discounts.', saveError: 'Could not save the discount.',
  products: { Car: 'Car', Toy: 'Toy', Food: 'Food' },
};
