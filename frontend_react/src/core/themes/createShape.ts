export const baseBorderRadius = 2;

export const borderRadius = (amount?: number) => {
  const value = (amount ?? 1) * baseBorderRadius;
  return `${value}px`;
};
