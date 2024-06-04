import type { Meta, StoryObj } from '@storybook/react';
import { SudokuGameCreator } from '.';

// eslint-disable-next-line storybook/story-exports
const meta = {
  title: 'Components/SudokuGameCreator',
  component: SudokuGameCreator,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SudokuGameCreator>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreate: async () => {},
  },
};
