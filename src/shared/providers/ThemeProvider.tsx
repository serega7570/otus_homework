import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

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
  const toggleTheme = useCallback((): void => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }, []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
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
