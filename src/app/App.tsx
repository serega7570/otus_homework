type ProfileItem = {
  title: string;
  text: string;
  accent: string;
};

const profileItems: ProfileItem[] = [
  {
    title: 'Моя цель',
    text: 'Научиться уверенно создавать современные React-приложения: от архитектуры и типизации до тестирования и публикации.',
    accent: '01',
  },
  {
    title: 'Что изучаю',
    text: 'React, TypeScript, управление состоянием, маршрутизацию, работу с API и инструменты современной frontend-разработки.',
    accent: '02',
  },
  {
    title: 'Что уже использую',
    text: 'JavaScript, основы TypeScript, Git, GitHub, Node.js и npm. Практикуюсь на домашних заданиях курса OTUS.',
    accent: '03',
  },
];

export const App = (): JSX.Element => (
  <main className="page">
    <div className="glow glow--top" aria-hidden="true" />
    <div className="glow glow--bottom" aria-hidden="true" />

    <section className="hero" aria-labelledby="page-title">
      <div className="hero__eyebrow">
        <span className="hero__dot" />
        OTUS · React.js Developer
      </div>

      <div className="hero__content">
        <p className="hero__label">Привет, меня зовут</p>
        <h1 id="page-title">Сергей</h1>
        <p className="hero__lead">
          Я изучаю frontend-разработку и шаг за шагом собираю прочную инженерную базу — от типов до готового продукта.
        </p>
      </div>

      <div className="hero__meta" aria-label="Информация о странице">
        <span>Homework 02</span>
        <span>2026</span>
      </div>
    </section>

    <section className="profile" aria-label="Обо мне и целях обучения">
      {profileItems.map(({ title, text, accent }) => (
        <article className="profile-card" key={accent}>
          <span className="profile-card__number">{accent}</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </article>
      ))}
    </section>

    <footer className="footer">
      <p>Учусь через практику и превращаю каждое задание в работающий результат.</p>
      <a href="https://github.com/serega7570" target="_blank" rel="noreferrer">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </footer>
  </main>
);
