import type { Meta, StoryObj } from '@storybook/react';

import { SudokuGameOver } from '.';

const meta = {
  title: 'Components/SudokuGameOver',
  component: SudokuGameOver,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    gameOver: { control: 'boolean' },
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof SudokuGameOver>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    gameOver: true,
  },
};

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
