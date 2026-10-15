export const signupRu = {
  title: 'Регистрация',
  description: 'Создайте аккаунт на сервере OTUS с помощью любой из двух форм. Каждая форма отправляет отдельный запрос.',
  fetch: 'Регистрация — Fetch',
  rtkQuery: 'Регистрация — RTK Query',
  link: 'Регистрация на сервере',
  sending: 'Отправка…',
  success: 'Пользователь успешно зарегистрирован.',
  errors: {
    email: 'Укажите корректный email.',
    emailExists: 'Пользователь с таким email уже существует.',
    password: 'Пароль не соответствует требованиям сервера.',
    required: 'Заполните это поле.',
    server: 'Ошибка сервера. Попробуйте позже.',
    network: 'Не удалось связаться с сервером. Проверьте подключение и повторите попытку.',
    timeout: 'Сервер не ответил вовремя. Повторите попытку.',
    unknown: 'Не удалось зарегистрироваться. Повторите попытку.',
  },
};

export const signupEn: typeof signupRu = {
  title: 'Registration',
  description: 'Create an account on the OTUS server using either form. Each form sends a separate request.',
  fetch: 'Registration — Fetch',
  rtkQuery: 'Registration — RTK Query',
  link: 'Register on the server',
  sending: 'Sending…',
  success: 'The user has been registered successfully.',
  errors: {
    email: 'Enter a valid email address.',
    emailExists: 'An account with this email already exists.',
    password: 'The password does not meet the server requirements.',
    required: 'Fill in this field.',
    server: 'Server error. Try again later.',
    network: 'Could not reach the server. Check your connection and try again.',
    timeout: 'The server took too long to respond. Try again.',
    unknown: 'Registration failed. Try again.',
  },
};
