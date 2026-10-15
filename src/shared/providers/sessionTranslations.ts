export const sessionRu = {
  loading: 'Загрузка приложения…', login: 'Войти', logout: 'Выйти', user: 'Пользователь', admin: 'Администратор',
  loginDescription: 'Учебный вход: admin@example.com — администратор, любой другой email — пользователь. Пароль — любая строка от 8 символов. При регистрации создаётся обычный пользователь.',
  forbidden: 'Доступ запрещён', forbiddenDescription: 'Создавать и редактировать операции может только администратор.',
  backToOperations: 'К списку операций', email: 'Email профиля', role: 'Роль',
};

export const sessionEn: typeof sessionRu = {
  loading: 'Loading application…', login: 'Sign in', logout: 'Sign out', user: 'User', admin: 'Administrator',
  loginDescription: 'Demo sign-in: admin@example.com is an administrator; any other email is a user. Use any password with at least 8 characters. Registration creates a regular user.',
  forbidden: 'Access denied', forbiddenDescription: 'Only an administrator can create and edit operations.',
  backToOperations: 'Back to operations', email: 'Profile email', role: 'Role',
};
