const ru = {
  navigation: { overview: 'Обзор', about: 'Обо мне', demo: 'Модальное окно', operations: 'Операции', products: 'Товары', label: 'Основная навигация' },
  profile: { label: 'Профиль Сергея', initial: 'С' },
  theme: { toggle: 'Переключить цветовую тему', light: 'Светлая тема', dark: 'Тёмная тема' },
  language: { label: 'Язык интерфейса' },
  modal: { label: 'Модальное окно', close: 'Закрыть', title: 'Ваше сообщение', input: 'Текст сообщения', placeholder: 'Введите текст для модального окна', open: 'Открыть модальное окно' },
  home: {
    greeting: 'Привет, меня зовут', name: 'Сергей',
    lead: 'Мне 24 года, я живу в Москве и занимаюсь frontend-разработкой в сфере информационной безопасности.',
    meta: 'Информация о странице', homework: 'Домашнее задание 05', about: 'Обо мне и целях обучения',
    experienceTitle: 'Мой опыт', experienceText: 'Четыре года разрабатываю интерфейсы для внутренних продуктов компании в сфере информационной безопасности.',
    stackTitle: 'Продукты и стек', stackText: 'Работаю над TI, EDR и EASM-приложениями. В ежедневной разработке использую React, Redux Toolkit и CoreUI.',
    goalTitle: 'Цель обучения', goalText: 'Хочу систематизировать и закрепить накопленные знания, а также расширить инструментарий новыми технологиями и подходами.',
    demoTitle: 'Сообщение в модальном окне', demoText: 'Введите сообщение и откройте окно, чтобы увидеть свой текст.',
    footer: 'Учусь через практику и превращаю каждое задание в работающий результат.',
  },
  product: { new: 'Новинка', add: 'В корзину', decrease: 'Уменьшить количество', increase: 'Увеличить количество', countLabel: 'Количество товара', count: 'Количество: {{count}}', remove: 'Удалить', removeLabel: 'Удалить {{name}} из корзины' },
  operation: { edit: 'Редактировать' },
  stories: { scroll: 'Прокрутите страницу: Header останется у верхней границы.', workspace: 'Рабочее пространство', content: 'Презентационная область страницы', action: 'Новое действие', message: 'Здесь может находиться форма, подтверждение или любая другая информация.', visibility: 'Состояние visible' },
};

// The matching shape ensures that neither language loses a translation key.
const en: typeof ru = {
  navigation: { overview: 'Overview', about: 'About me', demo: 'Modal window', operations: 'Operations', products: 'Products', label: 'Main navigation' },
  profile: { label: "Sergey's profile", initial: 'S' },
  theme: { toggle: 'Toggle color theme', light: 'Light theme', dark: 'Dark theme' },
  language: { label: 'Interface language' },
  modal: { label: 'Modal window', close: 'Close', title: 'Your message', input: 'Message text', placeholder: 'Enter text for the modal window', open: 'Open modal window' },
  home: {
    greeting: 'Hi, my name is', name: 'Sergey',
    lead: 'I am 24, I live in Moscow and develop frontend applications in information security.',
    meta: 'Page information', homework: 'Homework 05', about: 'About me and my learning goals',
    experienceTitle: 'My experience', experienceText: 'For four years, I have been developing interfaces for internal products at an information security company.',
    stackTitle: 'Products and stack', stackText: 'I work on TI, EDR and EASM applications. My daily stack includes React, Redux Toolkit and CoreUI.',
    goalTitle: 'Learning goal', goalText: 'I want to structure and consolidate my knowledge and expand my toolkit with new technologies and approaches.',
    demoTitle: 'Message in a modal window', demoText: 'Enter a message and open the window to see your text.',
    footer: 'I learn through practice and turn each assignment into a working result.',
  },
  product: { new: 'New', add: 'Add to cart', decrease: 'Decrease quantity', increase: 'Increase quantity', countLabel: 'Product quantity', count: 'Quantity: {{count}}', remove: 'Remove', removeLabel: 'Remove {{name}} from cart' },
  operation: { edit: 'Edit' },
  stories: { scroll: 'Scroll the page: the Header stays at the top.', workspace: 'Workspace', content: 'Page presentation area', action: 'New action', message: 'A form, confirmation or any other information can appear here.', visibility: 'Visible state' },
};

export const resources = { ru: { translation: ru }, en: { translation: en } };
