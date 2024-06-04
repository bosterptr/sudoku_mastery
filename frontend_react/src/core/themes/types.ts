export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg';

interface ThemeRichColor {
  /** Main color */
  main: string;
  /** Used for text */
  contrastText: string;
  /** Used for dark background */
  dark: string;
  /** Used for light background */
  light: string;
}

export const ThemeSchemeLight = 0;
export const ThemeSchemeDark = 1;
export type IThemeScheme = 0 | 1;

export interface ITheme {
  palette: {
    mode: IThemeScheme;
    action: {
      disabledBackground: string;
      disabledOpacity: number;
      disabledText: string;
      focus: string;
      hover: string;
      hoverOpacity: number;
      selected: string;
    };
    background: {
      /** Dashboard and body background */
      canvas: string;
      /** Primary content pane background (panels etc) */
      primary: string;
      /** Cards and elements that need to stand out on the primary background */
      secondary: string;
    };
    border: {
      medium: string;
      strong: string;
      weak: string;
    };
    divider: string;
    errors: ThemeRichColor;
    gradients: {
      brandHorizontal: string;
      brandVertical: string;
    };
    primary: ThemeRichColor;
    info: ThemeRichColor;
    secondary: ThemeRichColor;
    success: ThemeRichColor;
    text: {
      disabled: string;
      link: string;
      maxContrast: string;
      primary: string;
      secondary: string;
    };
    warning: ThemeRichColor;
  };
  shadows: {
    z1: string;
    z2: string;
    z3: string;
  };
  // spacing: ThemeSpacing;
}
