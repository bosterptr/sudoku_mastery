import { useEffect, useState } from 'react';
import { createTheme } from './createTheme';
import { ITheme, IThemeScheme, ThemeSchemeDark, ThemeSchemeLight } from './types';

export const useTheme = (): ITheme => {
  const [colorScheme, setColorScheme] = useState<IThemeScheme>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeSchemeDark
      : ThemeSchemeLight,
  );
  useEffect(() => {
    window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const newColorScheme = event.matches ? ThemeSchemeDark : ThemeSchemeLight;
        setColorScheme(newColorScheme);
      });
  }, []);
  return createTheme(colorScheme);
};
