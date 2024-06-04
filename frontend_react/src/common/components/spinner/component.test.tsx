/* eslint-disable react/jsx-props-no-spreading */
import { render } from 'app/tests/utils';
import { LoadingSpinner, LoadingSpinnerProps } from './component';

function getOptionalProps(): LoadingSpinnerProps {
  return {
    size: 'lg',
    delay: 100,
    inheritColor: true,
    fillContent: true,
  };
}

describe('LoadingSpinner', () => {
  it('renders loading spinner component with required props', () => {
    const { asFragment } = render(<LoadingSpinner />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders loading spinner component with all props', () => {
    const { asFragment } = render(<LoadingSpinner {...getOptionalProps()} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it('has a delay by default', () => {
    const { asFragment } = render(<LoadingSpinner />);
    expect(asFragment().firstChild).toHaveStyle('animation-delay: 300ms');
  });

  it('does not add a delay className with 0 delay', () => {
    const { asFragment } = render(<LoadingSpinner delay={0} />);
    expect(asFragment()).not.toHaveStyleRule('animation-delay');
  });
});
