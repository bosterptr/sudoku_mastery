import { fireEvent, render, screen } from 'app/tests/utils';
import 'jest-styled-components';
import InputField from '.';

describe('InputField', () => {
  it('renders without crashing', () => {
    render(<InputField />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<InputField label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles value change', () => {
    const handleChange = jest.fn();
    render(<InputField onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('displays error state', () => {
    render(<InputField error label="Test Label" />);
    expect(screen.getByRole('textbox')).toMatchSnapshot();
  });

  it('displays correct size styles for md', () => {
    render(<InputField size="md" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveStyleRule('font-size', '1.125rem');
    expect(input).toHaveStyleRule('padding', '8px 0 8px 16px');
    expect(input).toHaveStyleRule('height', '36px');
  });

  it('displays correct size styles for sm', () => {
    render(<InputField size="sm" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveStyleRule('font-size', '1rem');
    expect(input).toHaveStyleRule('padding', '6px 0 6px 14px');
  });

  it('displays correct size styles for lg', () => {
    render(<InputField size="lg" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveStyleRule('font-size', '1.875rem');
    expect(input).toHaveStyleRule('padding', '10px 0 10px 20px');
  });

  it('handles disabled state', () => {
    render(<InputField disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with readOnly state', () => {
    render(<InputField readOnly />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<InputField onFocus={handleFocus} onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<InputField variant="filled" />);
    expect(screen.getByRole('textbox')).toMatchSnapshot();
    rerender(<InputField variant="outlined" />);
    expect(screen.getByRole('textbox')).toMatchSnapshot();
  });
});
