import type { Meta, StoryObj } from '@storybook/react';
import { SudokuGame } from '.';
import { ISudoku, SudokuDifficulty } from './types';

const CURRENT_GAME: ISudoku = {
  id: '379',
  body: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
  difficulty: SudokuDifficulty.Easy,
  created_at: '',
  updated_at: '',
  user_id: '',
};

// eslint-disable-next-line storybook/story-exports
const meta = {
  title: 'Components/SudokuGame',
  component: SudokuGame,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SudokuGame>;

// eslint-disable-next-line import/no-default-export
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    game: CURRENT_GAME,
  },
};
