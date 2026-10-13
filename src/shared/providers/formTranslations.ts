export const formsRu = {
  title: 'Формы', description: 'Профиль, операции и вход в приложение. В этом задании формы работают без подключения к серверу.',
  submitted: 'Форма отправлена. Можно заполнить её снова.',
  profile: { title: 'Редактирование профиля', name: 'Имя', about: 'О себе', aboutHint: 'Необязательно, до 500 символов.', save: 'Сохранить профиль' },
  operation: {
    title: 'Операция', mode: 'Режим операции', createTitle: 'Добавление операции', editTitle: 'Редактирование операции',
    createSubmit: 'Добавить операцию', editSubmit: 'Сохранить операцию', name: 'Название операции', description: 'Описание',
    type: 'Тип операции', cost: 'Расход', profit: 'Доход', amount: 'Сумма, ₽', category: 'Категория', chooseCategory: 'Выберите категорию', date: 'Дата операции',
  },
  categories: { food: 'Продукты', tech: 'Техника', services: 'Услуги' },
  auth: {
    title: 'Вход в приложение', mode: 'Режим авторизации', loginTitle: 'Вход', registerTitle: 'Регистрация',
    loginSubmit: 'Войти', registerSubmit: 'Зарегистрироваться', email: 'Email', password: 'Пароль', confirmPassword: 'Повторите пароль',
    loginPasswordHint: 'От 8 до 128 символов.', registerPasswordHint: 'От 8 до 128 символов, минимум одна буква и цифра.',
  },
  errors: {
    required: 'Заполните поле.', nameShort: 'Нужно минимум 2 символа.', nameLong: 'Название слишком длинное.',
    descriptionLong: 'Допускается не более 500 символов.', amount: 'Введите сумму от 0,01 до 1 000 000 000, не более двух знаков после запятой.',
    date: 'Введите существующую дату.', email: 'Введите корректный email, например name@example.com.',
    passwordLength: 'Пароль должен содержать от 8 до 128 символов.', passwordStrength: 'Добавьте в пароль хотя бы одну букву и цифру.',
    passwordMismatch: 'Пароли должны совпадать.',
  },
};

export const formsEn: typeof formsRu = {
  title: 'Forms', description: 'Profile, operations and sign-in. These practice forms work without a server connection.',
  submitted: 'Form submitted. You can fill it in again.',
  profile: { title: 'Edit profile', name: 'Name', about: 'About you', aboutHint: 'Optional, up to 500 characters.', save: 'Save profile' },
  operation: {
    title: 'Operation', mode: 'Operation mode', createTitle: 'Add operation', editTitle: 'Edit operation',
    createSubmit: 'Add operation', editSubmit: 'Save operation', name: 'Operation name', description: 'Description',
    type: 'Operation type', cost: 'Expense', profit: 'Income', amount: 'Amount, ₽', category: 'Category', chooseCategory: 'Choose a category', date: 'Operation date',
  },
  categories: { food: 'Food', tech: 'Technology', services: 'Services' },
  auth: {
    title: 'Sign in', mode: 'Authentication mode', loginTitle: 'Login', registerTitle: 'Registration',
    loginSubmit: 'Sign in', registerSubmit: 'Register', email: 'Email', password: 'Password', confirmPassword: 'Confirm password',
    loginPasswordHint: '8 to 128 characters.', registerPasswordHint: '8 to 128 characters, including a letter and a digit.',
  },
  errors: {
    required: 'Fill in this field.', nameShort: 'Use at least 2 characters.', nameLong: 'The name is too long.',
    descriptionLong: 'Use no more than 500 characters.', amount: 'Enter an amount from 0.01 to 1,000,000,000 with up to two decimal places.',
    date: 'Enter a valid date.', email: 'Enter a valid email, for example name@example.com.',
    passwordLength: 'The password must contain 8 to 128 characters.', passwordStrength: 'Include at least one letter and one digit.',
    passwordMismatch: 'Passwords must match.',
  },
};
