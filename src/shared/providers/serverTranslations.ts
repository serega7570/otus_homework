export const serverRu = {
  retry: 'Повторить', saved: 'Изменения сохранены на сервере.', end: 'Все записи загружены.',
  loginDescription: 'Войдите с email и паролем аккаунта OTUS. После входа станут доступны профиль, операции и заказы.',
  profileDescription: 'Имя сохраняется на сервере и будет доступно после повторного входа.',
  operationsDescription: 'Ваши операции с сервера. Новые страницы загружаются при прокрутке или кнопкой.',
  categories: { create: 'Создать категорию', name: 'Название категории', more: 'Ещё категории' },
  shop: {
    title: 'Товары и заказы', description: 'Добавляйте товары, выбирайте количество и оформляйте заказ.',
    create: 'Добавить товар', edit: 'Редактировать товар', name: 'Название товара', price: 'Цена, ₽', empty: 'Товаров пока нет. Добавьте первый товар.',
    cart: 'Корзина', cartEmpty: 'Выберите товары из списка.', quantity: 'Количество', checkout: 'Оформить заказ',
    total: 'Итого', orders: 'Мои заказы', orderCreated: 'Заказ создан. Номер: {{id}}', noOrders: 'Заказов пока нет.',
    pending: 'Ожидает подтверждения', cancel: 'Отмена', remove: 'Убрать',
  },
  errors: {
    credentials: 'Неверный email или пароль.', session: 'Сессия истекла. Войдите снова.',
    denied: 'Сервер отказал в доступе.', notFound: 'Запись не найдена.', unknown: 'Не удалось выполнить запрос. Повторите попытку.',
    quantity: 'Количество должно быть целым числом от 1 до 999.',
    nickname: 'Имя: от 7 символов. Допустимы a–z, а–я, цифры, _ и дефис.',
  },
};
export const serverEn: typeof serverRu = {
  retry: 'Retry', saved: 'Changes saved on the server.', end: 'All records loaded.',
  loginDescription: 'Sign in with your OTUS account email and password to access your profile, operations and orders.',
  profileDescription: 'Your name is saved on the server and will be available when you sign in again.',
  operationsDescription: 'Your operations from the server. Scroll or use the button to load more pages.',
  categories: { create: 'Create category', name: 'Category name', more: 'More categories' },
  shop: {
    title: 'Products and orders', description: 'Add products, choose quantities and place an order.',
    create: 'Add product', edit: 'Edit product', name: 'Product name', price: 'Price, ₽', empty: 'No products yet. Add your first product.',
    cart: 'Cart', cartEmpty: 'Select products from the list.', quantity: 'Quantity', checkout: 'Place order',
    total: 'Total', orders: 'My orders', orderCreated: 'Order created. Number: {{id}}', noOrders: 'No orders yet.',
    pending: 'Pending confirmation', cancel: 'Cancel', remove: 'Remove',
  },
  errors: {
    credentials: 'Incorrect email or password.', session: 'Your session expired. Sign in again.',
    denied: 'The server denied access.', notFound: 'Record not found.', unknown: 'The request failed. Try again.',
    quantity: 'Quantity must be an integer from 1 to 999.',
    nickname: 'Name: at least 7 characters. Use a–z, а–я, digits, _ or a hyphen.',
  },
};
