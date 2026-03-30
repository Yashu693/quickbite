import { createContext, useContext, useState, useEffect } from 'react';
import { DB } from '../utils/helpers';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check localStorage payload
    const savedDark = DB.get('quickbite_theme');
    if (savedDark !== null) {
      setDark(savedDark);
    } else {
      // Fallback to legacy key if it exists
      const legacyDark = DB.get('dark');
      if (legacyDark) {
        setDark(true);
        DB.set('quickbite_theme', true);
      }
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      // Root level background
      document.documentElement.style.background = '#08060A';
      document.documentElement.style.backgroundColor = '#08060A';
    } else {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      // Root level background
      document.documentElement.style.background = '#f5f5f5';
      document.documentElement.style.backgroundColor = '#f5f5f5';
    }
  }, [dark]);

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev;
      DB.set('quickbite_theme', next);
      DB.set('dark', next); // Also update legacy key for backward compatibility
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
