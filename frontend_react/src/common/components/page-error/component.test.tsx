import { render, screen } from 'app/tests/utils';
import { PageError } from './component';

describe('PageError', () => {
  it('renders loading spinner component with required props', () => {
    const { asFragment } = render(<PageError />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('PageError', () => {
  it('should render the message', () => {
    render(<PageError message="Error message here" />);
    expect(screen.getByText('Error message here')).toBeInTheDocument();
  });

  it('should handle full width and height when not inline', () => {
    const { container } = render(<PageError inline={false} />);
    expect(container.firstChild).toHaveStyle('width: 100%');
    expect(container.firstChild).toHaveStyle('height: 100%');
  });

  it('should not apply full width and height when inline is true', () => {
    const { container } = render(<PageError inline />);
    expect(container.firstChild).not.toHaveStyle('width: 100%');
    expect(container.firstChild).not.toHaveStyle('height: 100%');
  });

  it('should render children when provided', () => {
    render(
      <PageError>
        <div>Child component</div>
      </PageError>,
    );
    expect(screen.getByText('Child component')).toBeInTheDocument();
  });
});
