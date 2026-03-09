import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'life-as-a-gamer:theme';

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadTheme(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
  } catch {
    // ignore
  }
  return true;
}

function saveTheme(isDark: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  } catch {
    // ignore
  }
}

type ThemeProviderProps = {
  children: ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(loadTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const value = { isDark, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme };
