/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from 'app/tests/utils';
import SudokuCanvas, { IPublicProps } from '.';
import { SudokuStageOfTheGame } from '../../types';
import { generateArrWithTrueAtIndexes, generateNotes } from '../../utils';

const requiredProps: IPublicProps = {
  conflicts: [],
  gameStage: SudokuStageOfTheGame.INITIAL,
  mission: '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..',
  mistakes: [],
  notes: generateNotes(),
  onAcceptedLostGame: jest.fn(),
  onAcceptedWonGame: jest.fn(),
  onCellSelect: jest.fn(),
  selectedCell: null,
  values: '3784159624297631855619283749846725312578316496135498278321574967453962181962847..',
};

const notes = generateNotes();
notes[1] = [1, 2, 3, 8];
const allProps: Required<IPublicProps> = {
  ...requiredProps,
  conflicts: generateArrWithTrueAtIndexes([1, 2, 70]),
  mistakes: generateArrWithTrueAtIndexes([1, 2, 70]),
  notes,
  renderPreview: jest.fn(),
};

Object.defineProperty(window, 'devicePixelRatio', {
  value: 1,
});
describe('SudokuCanvas', () => {
  const originalClientWidthDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientWidth',
  );
  const originalClientHeightDescriptor = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientHeight',
  );
  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 500,
    });
  });
  afterAll(() => {
    // Restore the original property
    if (originalClientWidthDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidthDescriptor);
    }
    if (originalClientHeightDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeightDescriptor);
    }
  });
  it('renders canvas with required props', () => {
    const { asFragment } = render(<SudokuCanvas {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders canvas with all props', () => {
    const { asFragment } = render(<SudokuCanvas {...allProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('renders canvas with devicePixelRatio > 2', () => {
    Object.defineProperty(window, 'devicePixelRatio', {
      value: 3,
    });
    const { asFragment } = render(<SudokuCanvas {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers onClick prop when the canvas is clicked', () => {
    render(<SudokuCanvas {...requiredProps} />);
    const component = screen.getByTestId('sudoku-canvas');
    fireEvent.click(component, { clientX: 50, clientY: 50 });
    expect(requiredProps.onCellSelect).toHaveBeenCalled();
  });
});
