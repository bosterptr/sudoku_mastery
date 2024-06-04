/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from 'app/tests/utils';
import { IPublicProps, SudokuNumpad } from '.';

const requiredProps: IPublicProps = {
  onButtonClick: jest.fn(),
};

const allProps: Required<IPublicProps> = {
  ...requiredProps,
  className: 'x',
};

describe('SudokuNumpad', () => {
  it('renders component with required props', () => {
    const { asFragment } = render(<SudokuNumpad {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders component with all props', () => {
    const { asFragment } = render(<SudokuNumpad {...allProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers onClick prop when a button is clicked', () => {
    render(<SudokuNumpad {...requiredProps} />);
    const components = screen.getAllByText('1');
    fireEvent.click(components[0]);
    expect(requiredProps.onButtonClick).toHaveBeenCalled();
  });
});
