import { useTranslation } from 'react-i18next';
import { CroppedText, ModalWithInput } from '../shared/ui';
import { useDisclosure } from '../shared/lib/useDisclosure';

const profileItems = [
  { title: 'home.experienceTitle', text: 'home.experienceText', accent: '01' },
  { title: 'home.stackTitle', text: 'home.stackText', accent: '02' },
  { title: 'home.goalTitle', text: 'home.goalText', accent: '03' },
];

export const HomePage = (): JSX.Element => {
  const { t } = useTranslation();
  const { isOpen: notesOpen, open: openNotes, close: closeNotes } = useDisclosure();
  return (
    <>
      <section id="overview" className="hero" aria-labelledby="page-title">
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          OTUS · React.js Developer
        </div>
        <div className="hero__content">
          <p className="hero__label">{t('home.greeting')}</p>
          <h1 id="page-title">{t('home.name')}</h1>
          <p className="hero__lead">{t('home.lead')}</p>
        </div>
        <div className="hero__meta" aria-label={t('home.meta')}>
          <span>{t('home.homework')}</span>
          <span>2026</span>
        </div>
      </section>

      <section id="about" className="profile" aria-label={t('home.about')}>
        {profileItems.map(({ title, text, accent }) => (
          <article className="profile-card" key={accent}>
            <span className="profile-card__number">{accent}</span>
            <h2>{t(title)}</h2>
            <p>{t(text)}</p>
          </article>
        ))}
      </section>

      <section id="demo" className="state-demo" aria-labelledby="demo-title">
        <h2 id="demo-title">{t('home.demoTitle')}</h2>
        <p>{t('home.demoText')}</p>
        <ModalWithInput />
      </section>

      <section className="state-demo" aria-labelledby="notes-title">
        <h2 id="notes-title">{t('croppedText.title')}</h2>
        <CroppedText opened={notesOpen} rows={3}>{t('croppedText.text')}</CroppedText>
        <button className="ui-button" style={{ marginTop: 20 }} type="button" onClick={notesOpen ? closeNotes : openNotes} aria-expanded={notesOpen}>
          {t(notesOpen ? 'croppedText.collapse' : 'croppedText.expand')}
        </button>
      </section>

    </>
  );
};
