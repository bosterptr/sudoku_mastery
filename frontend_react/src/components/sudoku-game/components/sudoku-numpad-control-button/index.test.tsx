/* eslint-disable react/jsx-props-no-spreading */
import { fireEvent, render, screen } from 'app/tests/utils';
import { createRef } from 'react';
import { IPublicProps, SudokuNumpadControlButton } from '.';

const requiredProps: IPublicProps = {
  children: '2',
  onClick: jest.fn(),
  label: '2',
};

const allProps: Required<IPublicProps> = {
  ...requiredProps,
  className: 'X',
  state: true,
  stateText: 'ON',
};

describe('NumpadControlButton', () => {
  it('renders button component with required props', () => {
    const { asFragment } = render(<SudokuNumpadControlButton {...requiredProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders button component with all props', () => {
    const { asFragment } = render(<SudokuNumpadControlButton {...allProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('triggers onClick prop when the button is clicked', () => {
    render(<SudokuNumpadControlButton {...requiredProps} />);
    const component = screen.getByRole('button');
    fireEvent.click(component);
    expect(requiredProps.onClick).toHaveBeenCalled();
  });

  it('passes the ref', () => {
    const testRef = createRef<HTMLButtonElement>();
    render(<SudokuNumpadControlButton {...requiredProps} />);
    expect(testRef.current).toBeDefined();
  });
});
