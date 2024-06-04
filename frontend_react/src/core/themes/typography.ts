import * as CSS from 'csstype';

function round(value: number) {
  return Math.round(value * 1e5) / 1e5;
}
const caseAllCaps: { textTransform: 'uppercase' } = {
  textTransform: 'uppercase',
};
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
const defaultFontFamilyMonospace = "'Roboto Mono', monospace";

export const fontFamily = defaultFontFamily;
export const fontFamilyMonospace = defaultFontFamilyMonospace;
export const fontSize = 14;
export const fontWeightLight = 300;
export const fontWeightRegular = 400;
export const fontWeightMedium = 500;
export const fontWeightBold = 700;
export const htmlFontSize = 16;
const coef = fontSize / 14;
export const pxToRem = (size: number) => `${(size / htmlFontSize) * coef}rem`;
const buildVariant = (
  fontWeight: number,
  size: number,
  lineHeight: number,
  letterSpacing: number,
  casing?: { textTransform: CSS.Property.TextTransform },
): IFontVariant => ({
  fontFamily,
  fontWeight,
  fontSize: pxToRem(size),
  lineHeight,
  ...(fontFamily === defaultFontFamily
    ? { letterSpacing: `${round(letterSpacing / size)}em` }
    : {}),
  ...casing,
});
export const h1 = buildVariant(fontWeightLight, 96, 1.167, -1.5);
export const h2 = buildVariant(fontWeightLight, 60, 1.2, -0.5);
export const h3 = buildVariant(fontWeightRegular, 48, 1.167, 0);
export const h4 = buildVariant(fontWeightRegular, 34, 1.235, 0.25);
export const h5 = buildVariant(fontWeightRegular, 24, 1.334, 0);
export const h6 = buildVariant(fontWeightMedium, 20, 1.6, 0.15);
export const subtitle1 = buildVariant(fontWeightRegular, 16, 1.75, 0.15);
export const subtitle2 = buildVariant(fontWeightMedium, 14, 1.57, 0.1);
export const body1 = buildVariant(fontWeightRegular, 16, 1.5, 0.15);
export const body2 = buildVariant(fontWeightRegular, 14, 1.43, 0.15);
export const button = buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps);
export const caption = buildVariant(fontWeightRegular, 12, 1.66, 0.4);
export const overline = buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps);

export interface IFontVariant {
  textTransform?: CSS.Property.TextTransform;
  letterSpacing?: string;
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: number;
}
