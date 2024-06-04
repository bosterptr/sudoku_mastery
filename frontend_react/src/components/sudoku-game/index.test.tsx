/* eslint-disable react/jsx-props-no-spreading */
import { render } from 'app/tests/utils';
import NOOP from 'app/utils/noop';
import { SudokuGame } from '.';
import { ISudoku, SudokuDifficulty } from './types';

const CURRENT_GAME: ISudoku = {
  id: '379',
  body: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
  difficulty: SudokuDifficulty.Easy,
  created_at: '',
  updated_at: '',
  user_id: '',
  // winRate: 50,
};

jest.mock('sudoku_wasm', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
describe('SudokuGame', () => {
  it('renders a game with required props', () => {
    const { asFragment } = render(
      <SudokuGame
        game={CURRENT_GAME}
        onLose={NOOP}
        onWin={NOOP}
        onAcceptedLostGame={NOOP}
        onAcceptedWonGame={NOOP}
        onChangeGameType={NOOP}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
