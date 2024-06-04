import { fireEvent, render, screen } from 'app/tests/utils';
import '@testing-library/jest-dom';
import Button from '.';

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
    expect(screen.getByRole('button')).toMatchSnapshot();
  });

  it('calls onClick prop when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  test('renders variants and categories correctly', () => {
    const { rerender } = render(
      <Button variant="success" category="primary">
        Success
      </Button>,
    );
    expect(screen.getByText('Success')).toHaveStyle('background-color: transparent');

    rerender(
      <Button variant="danger" category="secondary">
        Danger
      </Button>,
    );
    expect(screen.getByText('Danger')).toHaveStyle('color: rgb(255, 255, 255)');

    rerender(
      <Button variant="warning" category="secondary">
        Warning
      </Button>,
    );
    expect(screen.getByText('Warning')).toHaveStyle('color: rgb(255, 255, 255)');

    rerender(
      <Button variant="info" category="secondary">
        Info
      </Button>,
    );
    expect(screen.getByText('Info')).toHaveStyle('color: rgb(255, 255, 255)');
  });
  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);
    expect(getByRole('button')).toBeDisabled();
  });
  it('shows spinner when isLoading is true', () => {
    const { queryByText, getByTestId } = render(<Button isLoading>Loading...</Button>);
    expect(queryByText('Loading...')).not.toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
  test('renders sizes correctly', () => {
    const { rerender } = render(<Button size="lg">lg</Button>);
    expect(screen.getByText('lg')).toHaveStyle('padding: 10px 13px');
    expect(screen.getByText('lg')).toMatchSnapshot();
    rerender(<Button size="md">md</Button>);
    expect(screen.getByText('md')).toHaveStyle('padding: 6px 8px');
    expect(screen.getByText('md')).toMatchSnapshot();
    rerender(<Button size="sm">sm</Button>);
    expect(screen.getByText('sm')).toHaveStyle('padding: 4px 6px');
    expect(screen.getByText('sm')).toMatchSnapshot();
    rerender(<Button size="xs">xs</Button>);
    expect(screen.getByText('xs')).toHaveStyle('padding: 2px 4px');
    expect(screen.getByText('xs')).toMatchSnapshot();
  });
  test('renders icons', () => {
    expect(render(<Button iconAfter={<div>Icon</div>} />).asFragment());
    expect(screen.getByRole('button')).toMatchSnapshot();
    expect(screen.getByText('Icon')).toBeDefined();
  });
});
