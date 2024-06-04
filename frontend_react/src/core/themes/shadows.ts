const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;

function createShadow(...px: number[]) {
  return [
    `0 ${px[0]}px ${px[1]}px ${px[2]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`,
    `0 ${px[3]}px ${px[4]}px ${px[5]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`,
    `0 ${px[6]}px ${px[7]}px ${px[8]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`,
  ].join(',');
}

// Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss
export const shadows = [
  'none',
  createShadow(2, 1, -1, 1, 1, 0, 1, 3, 0),
  createShadow(3, 1, -2, 2, 2, 0, 1, 5, 0),
  createShadow(3, 3, -2, 3, 4, 0, 1, 8, 0),
  createShadow(2, 4, -1, 4, 5, 0, 1, 10, 0),
  createShadow(3, 5, -1, 5, 8, 0, 1, 14, 0),
  createShadow(3, 5, -1, 6, 10, 0, 1, 18, 0),
  createShadow(4, 5, -2, 7, 10, 1, 2, 16, 1),
  createShadow(5, 5, -3, 8, 10, 1, 3, 14, 2),
  createShadow(5, 6, -3, 9, 12, 1, 3, 16, 2),
  createShadow(6, 6, -3, 10, 14, 1, 4, 18, 3),
  createShadow(6, 7, -4, 11, 15, 1, 4, 20, 3),
  createShadow(7, 8, -4, 12, 17, 2, 5, 22, 4),
  createShadow(7, 8, -4, 13, 19, 2, 5, 24, 4),
  createShadow(7, 9, -4, 14, 21, 2, 5, 26, 4),
  createShadow(8, 9, -5, 15, 22, 2, 6, 28, 5),
  createShadow(8, 10, -5, 16, 24, 2, 6, 30, 5),
  createShadow(8, 11, -5, 17, 26, 2, 6, 32, 5),
  createShadow(9, 11, -5, 18, 28, 2, 7, 34, 6),
  createShadow(9, 12, -6, 19, 29, 2, 7, 36, 6),
  createShadow(10, 13, -6, 20, 31, 3, 8, 38, 7),
  createShadow(10, 13, -6, 21, 33, 3, 8, 40, 7),
  createShadow(10, 14, -6, 22, 35, 3, 8, 42, 7),
  createShadow(11, 14, -7, 23, 36, 3, 9, 44, 8),
  createShadow(11, 15, -7, 24, 38, 3, 9, 46, 8),
];
