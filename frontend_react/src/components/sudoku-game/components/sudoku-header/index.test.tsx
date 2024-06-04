/* eslint-disable react/jsx-props-no-spreading */
import { render } from 'app/tests/utils';
import { IPublicProps, SudokuHeader } from '.';
import { SudokuDifficulty } from '../../types';

const requiredProps: IPublicProps = {
  difficulty: SudokuDifficulty.Medium,
  mistakes: 2,
  onChangeGameType: jest.fn(),
  score: 2137,
  seconds: 0,
};

const allProps: Required<IPublicProps> = {
  ...requiredProps,
  className: 'x',
};

describe('SudokuHeader', () => {
  it('renders component with required props', () => {
    const { asFragment } = render(<SudokuHeader {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders component with all props', () => {
    const { asFragment } = render(<SudokuHeader {...allProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
