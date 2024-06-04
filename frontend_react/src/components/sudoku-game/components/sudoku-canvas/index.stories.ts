import type { Meta, StoryObj } from '@storybook/react';
import SudokuCanvas from '.';
import { SudokuStageOfTheGame } from '../../types';
import { generateArrWithTrueAtIndexes, generateNotes } from '../../utils';

// eslint-disable-next-line storybook/story-exports
const meta = {
  title: 'Components/SudokuCanvas',
  component: SudokuCanvas,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SudokuCanvas>;

// eslint-disable-next-line import/no-default-export
export default meta;

type Story = StoryObj<typeof meta>;

const clearNotes = generateNotes();
export const Clear: Story = {
  args: {
    conflicts: [],
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: [],
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: null,
    values: '',
  },
};
const notes = generateNotes();
notes[1] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
export const WithMission: Story = {
  args: {
    conflicts: [],
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: [],
    notes,
    onCellSelect: () => {},
    selectedCell: null,
    values: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
  },
};
export const Finished: Story = {
  args: {
    conflicts: [],
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: [],
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: null,
    values: '378415962429763185561928374984672531257831649613549827832157496745396218196284753',
  },
};
export const Selected: Story = {
  args: {
    conflicts: [],
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: [],
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: 40,
    values: '378415962429763185561928374984672531257832649613549827832157496745396218196284753',
  },
};
export const WithASingleMistake: Story = {
  args: {
    conflicts: generateArrWithTrueAtIndexes([22, 32, 36, 40, 41]),
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: generateArrWithTrueAtIndexes([40]),
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: null,
    values: '378415962429763185561928374984672531257832649613549827832157496745396218196284753',
  },
};

export const WithASingleMistakeAndASelectedCell: Story = {
  args: {
    conflicts: generateArrWithTrueAtIndexes([22, 32, 36, 40, 41]),
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: generateArrWithTrueAtIndexes([40]),
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: 40,
    values: '378415962429763185561928374984672531257832649613549827832157496745396218196284753',
  },
};

export const WithMultipleMistakes: Story = {
  args: {
    conflicts: generateArrWithTrueAtIndexes([22, 32, 35, 36, 40, 41, 52, 46, 70]),
    gameStage: SudokuStageOfTheGame.INITIAL,
    mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
    mistakes: generateArrWithTrueAtIndexes([40, 52]),
    notes: clearNotes,
    onCellSelect: () => {},
    selectedCell: null,
    values: '378415962429763185561928374984672531257832649613549817832157496745396218196284753',
  },
};
