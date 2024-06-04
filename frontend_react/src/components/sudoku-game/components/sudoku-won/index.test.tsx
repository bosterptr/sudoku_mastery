/* eslint-disable react/jsx-props-no-spreading */
import { render } from 'app/tests/utils';
import { IPublicProps, SudokuWonScreen } from '.';

const requiredProps: IPublicProps = {
  won: true,
  onAcceptedWonGame: jest.fn(),
};
describe('SudokuWonScreen', () => {
  it('renders button component with required props', () => {
    const { asFragment } = render(<SudokuWonScreen {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
