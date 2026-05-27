/**
 * @fileoverview Custom hook for consuming theme context easily.
 */
import { useThemeContext } from './ThemeContext';

/**
 * Hook to access the current theme colors and toggle functionality.
 * 
 * @returns {Object} An object containing colors, dark mode flag, and theme controls.
 */
export const useTheme = () => {
  const context = useThemeContext();
  return {
    colors: context.colors,
    isDark: context.isDark,
    themeMode: context.themeMode,
    setThemeMode: context.setThemeMode,
    toggleTheme: context.toggleTheme,
  };
};
