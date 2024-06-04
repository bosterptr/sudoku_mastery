import { ITheme, ThemeSchemeLight } from 'app/core/themes/types';

/* eslint-disable no-underscore-dangle */
export const action: ITheme['palette']['action'] = {
  disabledBackground: '#24292e0a',
  disabledOpacity: 0.38,
  disabledText: '#24292e80',
  focus: '#24292e29',
  hover: '#24292e29',
  hoverOpacity: 0.08,
  selected: '#24292e1f',
};
export const Background: ITheme['palette']['background'] = {
  canvas: '#f0f4f4',
  primary: '#ffffff',
  secondary: '#f4f5f5',
};
export const Border: ITheme['palette']['border'] = {
  medium: '#24292e4d',
  strong: '#24292e66',
  weak: '#24292e1f',
};
export const errors: ITheme['palette']['errors'] = {
  contrastText: '#fff',
  dark: '#c62828',
  light: '#ef5350',
  main: '#d32f2f',
};
export const primary: ITheme['palette']['primary'] = {
  contrastText: '#fff',
  dark: '#1236bb',
  light: '#4870fd',
  main: '#1648ff',
};
export const secondary: ITheme['palette']['secondary'] = {
  contrastText: '#fff',
  dark: '#111314',
  light: '#41474d',
  main: '#24292e',
};
export const success: ITheme['palette']['success'] = {
  contrastText: '#fff',
  dark: '#1b5e20',
  light: '#4caf50',
  main: '#2e7d32',
};
export const warning: ITheme['palette']['warning'] = {
  contrastText: '#fff',
  dark: '#e65100',
  light: '#ff9800',
  main: '#ed6c02',
};
export const info: ITheme['palette']['info'] = {
  contrastText: '#fff',
  dark: '#01579b',
  light: '#03a9f4',
  main: '#0288d1',
};
export const text: ITheme['palette']['text'] = {
  disabled: '#24292e80',
  link: '#4f75ff',
  maxContrast: '#000000',
  primary: '#3d4150',
  secondary: '#24292ebf',
};
export const gradients = {
  brandHorizontal: 'linear-gradient(90deg, #ff8833 0%, #f53e4c 100%);',
  brandVertical: 'linear-gradient(0.01deg, #f53e4c -31.2%, #ff8833 113.07%);',
};
export const palette: ITheme['palette'] = {
  mode: ThemeSchemeLight,
  action,
  background: Background,
  border: Border,
  divider: '#0000001f',
  errors,
  gradients,
  info,
  primary,
  secondary,
  success,
  text,
  warning,
};

export const lightTheme: ITheme = {
  palette,
  shadows: {
    z1: '0px 1px 2px #181a1b33',
    z2: '0px 4px 8px #181a1b33',
    z3: '0px 13px 20px 1px #181a1b2e',
  },
};
