import type { Preview } from '@storybook/react-webpack5';
import { ThemeProvider } from '../src/shared/providers/ThemeProvider';
import { LanguageProvider } from '../src/shared/providers/LanguageProvider';
import '../src/styles/tokens.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LanguageProvider>
          <Story />
        </LanguageProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    backgrounds: { disable: true },
  },
};

export default preview;
