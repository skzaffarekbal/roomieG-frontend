import { useEffect, useState } from 'react';
import { THEMES } from '../utils/constant';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('roomieg-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('roomieg-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = isDarkTheme(theme) ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const isDarkTheme = (currentTheme) => {
    const found = THEMES.find((t) => t.id === currentTheme);
    return found
      ? found.type === 'dark'
      : ['dark', 'dim', 'dracula', 'synthwave', 'sunset'].includes(currentTheme);
  };

  const isDark = isDarkTheme(theme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDark,
        toggleTheme,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
