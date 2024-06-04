import type { Meta, StoryObj } from '@storybook/react';

import { SudokuNumpad } from '.';

const meta = {
  title: 'Components/SudokuNumpad',
  component: SudokuNumpad,
  parameters: {
    layout: 'centered',
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof SudokuNumpad>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

// export const Large: Story = {
//   args: {
//     size: 'lg',
//   },
// };

// export const Medium: Story = {
//   args: {
//     size: 'md',
//   },
// };

// export const Small: Story = {
//   args: {
//     size: 'sm',
//   },
// };
