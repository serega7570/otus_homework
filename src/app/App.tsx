import { useTranslation } from 'react-i18next';
import { ThemeProvider } from '../shared/providers/ThemeProvider';
import { LanguageProvider } from '../shared/providers/LanguageProvider';
import { CroppedText, Header, ModalWithInput } from '../shared/ui';
import { useDisclosure } from '../shared/lib/useDisclosure';
import { OperationFeed } from '../entities/operation';
import { FormsWorkspace } from '../features/forms/FormsWorkspace';

const profileItems = [
  { title: 'home.experienceTitle', text: 'home.experienceText', accent: '01' },
  { title: 'home.stackTitle', text: 'home.stackText', accent: '02' },
  { title: 'home.goalTitle', text: 'home.goalText', accent: '03' },
];

const HomePage = (): JSX.Element => {
  const { t } = useTranslation();
  const { isOpen: notesOpen, open: openNotes, close: closeNotes } = useDisclosure();

  return (
    <>
      <Header
        brand="OTUS · React"
        navigation={[
          { label: t('navigation.overview'), href: '#overview' },
          { label: t('navigation.about'), href: '#about' },
          { label: t('navigation.demo'), href: '#demo' },
          { label: t('navigation.operations'), href: '#operations' },
          { label: t('forms.title'), href: '#forms' },
        ]}
      />
      <main className="page">
        <div className="glow glow--top" aria-hidden="true" />
        <div className="glow glow--bottom" aria-hidden="true" />

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

        <section id="forms" className="state-demo" aria-labelledby="forms-title">
          <h2 id="forms-title">{t('forms.title')}</h2>
          <p>{t('forms.description')}</p>
          <FormsWorkspace />
        </section>

        <section id="operations" className="state-demo" aria-labelledby="operations-title">
          <h2 id="operations-title">{t('operationList.title')}</h2>
          <p>{t('operationList.description')}</p>
          <OperationFeed />
        </section>

        <footer className="footer">
          <p>{t('home.footer')}</p>
          <a href="https://github.com/serega7570" target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </main>
    </>
  );
};

export const App = (): JSX.Element => (
  <ThemeProvider initialTheme="dark">
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  </ThemeProvider>
);
