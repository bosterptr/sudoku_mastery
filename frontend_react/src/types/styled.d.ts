import 'styled-components';

interface ThemeRichColor {
  /** Main color */
  main: string;
  dark: string;
  /** Text color for text ontop of main */
  contrastText: string;
  /** Used for light background */
  light: string;
}

type IThemeScheme = 0 | 1;

interface ITheme {
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
    info: ThemeRichColor;
    primary: ThemeRichColor;
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

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ITheme {}
}
