import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html {
  height: 100%;
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
}
body {
  background-color: ${(p) => p.theme.palette.background.canvas};
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-weight: 300;
  height: 100%;
  margin: 0;
  outline: none !important;
  padding: 0;
  *:focus, *:visited, *:active, *:hover  { outline:0 !important;}
  *::-moz-focus-inner {border:0;}
  *::selection {
  background: #1648ff;
  color: #fff;
  text-shadow: none;
  }
  a {
  color: #142a51;
  text-decoration: none;
  }
  * {
  box-sizing: border-box;
  font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  }
}
#root {
  height: 100%;
}
`;
