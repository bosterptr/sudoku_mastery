import type { Meta, StoryObj } from '@storybook/react';

import { SudokuHeader } from '.';
import { SudokuDifficulty } from '../../types';

const meta = {
  title: 'Components/SudokuHeader',
  component: SudokuHeader,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mistakes: { control: 'number' },
    score: { control: 'number' },
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof SudokuHeader>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    difficulty: SudokuDifficulty.Medium,
    mistakes: 2,
    seconds: 65,
    score: 2137,
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
