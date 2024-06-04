import type { Meta, StoryObj } from '@storybook/react';

import { SudokuWonScreen } from '.';

const meta = {
  title: 'Components/SudokuWonScreen',
  component: SudokuWonScreen,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    won: { control: 'boolean' },
  },
  // tags: ['autodocs'],
} satisfies Meta<typeof SudokuWonScreen>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    won: true,
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
