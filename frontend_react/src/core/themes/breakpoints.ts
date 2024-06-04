interface ThemeBreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export type ThemeBreakpointsKey = keyof ThemeBreakpointValues;

const step = 5;
export const keys = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
const unit = 'px';
export const values: ThemeBreakpointValues = {
  xs: 0,
  sm: 544,
  md: 769, // 1 more than regular ipad in portrait
  lg: 992,
  xl: 1200,
  xxl: 1440,
};

export function up(key: ThemeBreakpointsKey | number) {
  const value = typeof key === 'number' ? key : values[key];
  return `@media (min-width:${value}${unit})`;
}

export function down(key: ThemeBreakpointsKey | number) {
  const value = typeof key === 'number' ? key : values[key];
  return `@media (max-width:${value - step / 100}${unit})`;
}
