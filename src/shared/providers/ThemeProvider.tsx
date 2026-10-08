import { createContext, useContext, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = Readonly<{
  theme: Theme;
  toggleTheme: () => void;
}>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({
  children,
  initialTheme = 'light',
}: Readonly<{ children: ReactNode; initialTheme?: Theme }>): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const toggleTheme = (): void => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="ui-theme" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
