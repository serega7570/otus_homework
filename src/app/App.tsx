type ProfileItem = {
  title: string;
  text: string;
  accent: string;
};

const profileItems: ProfileItem[] = [
  {
    title: 'Мой опыт',
    text: 'Четыре года разрабатываю интерфейсы для внутренних продуктов компании в сфере информационной безопасности.',
    accent: '01',
  },
  {
    title: 'Продукты и стек',
    text: 'Работаю над TI, EDR и EASM-приложениями. В ежедневной разработке использую React, Redux Toolkit и CoreUI.',
    accent: '02',
  },
  {
    title: 'Цель обучения',
    text: 'Хочу систематизировать и закрепить накопленные знания, а также расширить инструментарий новыми технологиями и подходами.',
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
          Мне 24 года, я живу в Москве и занимаюсь frontend-разработкой в сфере информационной безопасности.
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
