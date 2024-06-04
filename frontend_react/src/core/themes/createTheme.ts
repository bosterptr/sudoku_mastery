import { lightTheme } from './lightTheme';
import { ITheme, IThemeScheme, ThemeSchemeLight } from './types';

export function createTheme(type: IThemeScheme): ITheme {
  if (type === ThemeSchemeLight) return lightTheme;
  return lightTheme;
}
