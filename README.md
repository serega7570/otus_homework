# OTUS React homework

Учебный проект курса React.js Developer. Компоненты интерфейса собраны и опубликованы в Storybook.

## Команды

```bash
npm install
npm start
npm run typecheck
npm test
npm run build
npm run deploy
npm run storybook
npm run build-storybook
npm run deploy-storybook
```

После запуска приложение доступно по адресу `http://localhost:2233`, а Storybook — по адресу `http://localhost:6006`. Опубликованный Storybook находится на <https://serega7570.github.io/otus_homework/>.

## Домашнее задание 5: состояние приложения

- `ModalWithInput`: управляемый инпут над кнопкой; введённый текст отображается в модальном окне. Закрытие окна сохраняет текст.
- `ThemeProvider`: React-контекст хранит светлую или тёмную тему, CSS-переменные меняют оформление всех вложенных компонентов. `ThemeSwitcher` находится в Header.
- `LanguageProvider`: React-контекст хранит язык (`ru` / `en`), а `I18nextProvider` передаёт экземпляр i18next компонентам. `LanguageSwitcher` находится в Header. Переводятся интерфейсные тексты; пользовательский ввод и данные, переданные через props, сохраняются.

Оба провайдера подключены в `App` и глобальном декораторе Storybook. В приложении по умолчанию выбраны тёмная тема и русский язык, в Storybook — светлая тема и русский язык. Состояние хранится в памяти и сбрасывается при перезагрузке страницы.

Новые примеры в Storybook находятся в разделе **Управление состоянием**:

1. **ModalWithInput / Default** — введите текст, откройте и закройте окно.
2. **ThemeSwitcher / WithPreview** — переключите тему и откройте окно, чтобы проверить оформление.
3. **LanguageSwitcher / WithTranslatedComponent** — выберите English: подписи инпута, кнопки и модального окна изменятся.

Проверки: `npm run typecheck`, `npm test -- --runInBand`, `npm run build`, `npm run build-storybook`. Интеграционные тесты проверяют передачу текста в окно, повторное открытие, смену темы и языка, сохранение ввода и независимость провайдеров.
