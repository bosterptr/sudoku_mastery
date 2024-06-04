import { fireEvent, render, screen } from 'app/tests/utils';
import '@testing-library/jest-dom';
import EditableText from '.';

describe('EditableText', () => {
  test('displays the initial value and can switch to edit mode', () => {
    const initialValue = 'Hello';
    render(<EditableText initialValue={initialValue} onSave={jest.fn()} />);
    const displayName = screen.getByText(initialValue);
    expect(displayName).toBeInTheDocument();
    fireEvent.click(displayName);
    const input = screen.getByDisplayValue(initialValue);
    expect(input).toBeInTheDocument();
  });

  test('saves new value when edited and blurred', () => {
    const onSaveMock = jest.fn();
    render(<EditableText initialValue="Test" onSave={onSaveMock} />);
    fireEvent.click(screen.getByText('Test'));
    const input = screen.getByDisplayValue('Test');
    fireEvent.change(input, { target: { value: 'Tested' } });
    fireEvent.blur(input);
    expect(onSaveMock).toHaveBeenCalledWith('Tested');
  });

  test('does not call onSave if the value has not changed after blur', () => {
    const onSaveMock = jest.fn();
    render(<EditableText initialValue="Test" onSave={onSaveMock} />);
    fireEvent.click(screen.getByText('Test'));
    const input = screen.getByDisplayValue('Test');
    fireEvent.blur(input);
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  test('updates value when initialValue prop changes', () => {
    const { rerender } = render(<EditableText initialValue="First" onSave={jest.fn()} />);
    rerender(<EditableText initialValue="Second" onSave={jest.fn()} />);
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
