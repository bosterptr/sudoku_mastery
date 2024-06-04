/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from 'app/tests/utils';
import { createRef } from 'react';
import { IPublicProps, SudokuNumpadButton } from '.';

const requiredProps: IPublicProps = {
  children: '2',
  onClick: jest.fn(),
  index: 2,
};

const allProps: Required<IPublicProps> = {
  ...requiredProps,
  className: 'X',
};

describe('NumpadButton', () => {
  it('renders button component with required props', () => {
    const { asFragment } = render(<SudokuNumpadButton {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders button component with all props', () => {
    const { asFragment } = render(<SudokuNumpadButton {...allProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers onClick prop when the button is clicked', () => {
    render(<SudokuNumpadButton {...requiredProps} />);
    const component = screen.getByRole('button');
    fireEvent.click(component);
    expect(requiredProps.onClick).toHaveBeenCalled();
  });

  it('passes the ref', () => {
    const testRef = createRef<HTMLButtonElement>();
    render(<SudokuNumpadButton {...requiredProps} />);
    expect(testRef.current).toBeDefined();
  });
});
