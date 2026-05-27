/**
 * @fileoverview Context provider for managing the application's theme state.
 * Supports light, dark, and system default themes.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

/** Defines the shape of the theme context */
interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  colors: typeof colors.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider wraps the application to provide theme state globally.
 * 
 * @param {Object} props - React props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} The Context Provider
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  const themeColors = isDark ? colors.dark : colors.light;

  const toggleTheme = () => {
    console.log('[ThemeContext] Toggling theme from:', themeMode);
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    console.log('[ThemeContext] Current Theme:', themeMode, '| isDark:', isDark);
  }, [themeMode, isDark]);

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      setThemeMode, 
      isDark, 
      colors: themeColors,
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Internal hook to consume the ThemeContext.
 * Throws an error if used outside a ThemeProvider.
 * 
 * @returns {ThemeContextType} The current theme context values.
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
