import { act, render, screen, waitFor } from 'app/tests/utils';
import { IntlShape, useIntl } from 'react-intl';
import { barWidths, PasswordStrengthMeter } from '.';

const mockUseIntl = jest.requireMock('react-intl').useIntl as jest.MockedFunction<typeof useIntl>;

const mockFormatMessage = jest.fn();
describe('PasswordStrengthMeter', () => {
  beforeEach(() => {
    mockFormatMessage.mockClear();
  });
  it('renders a game with required props', () => {
    act(() => {
      render(<PasswordStrengthMeter displayName="" email="" password="" passwordPwnedCount={0} />);
    });
    expect(screen.getByRole('status')).toMatchSnapshot();
  });
  it('renders with default strength text when password is empty', () => {
    mockUseIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
      locale: 'en',
      messages: {},
    } as Partial<IntlShape> as IntlShape);
    mockFormatMessage.mockReturnValueOnce('');
    act(() => {
      render(<PasswordStrengthMeter displayName="" email="" password="" passwordPwnedCount={0} />);
    });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('renders strength text based on password length', () => {
    mockUseIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
      locale: 'en',
      messages: {},
    } as Partial<IntlShape> as IntlShape);
    mockFormatMessage.mockReturnValueOnce('Password must have at least 8 characters');
    act(() => {
      render(
        <PasswordStrengthMeter displayName="" email="" password="1234" passwordPwnedCount={0} />,
      );
    });
    expect(screen.getByText('Password must have at least 8 characters')).toBeInTheDocument();
  });
  it('renders strength text when email and password are the same', () => {
    mockUseIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
      locale: 'en',
      messages: {},
    } as Partial<IntlShape> as IntlShape);
    mockFormatMessage.mockReturnValueOnce('Password must have at least 8 characters');
    act(() => {
      render(
        <PasswordStrengthMeter displayName="" email="" password="1234" passwordPwnedCount={0} />,
      );
    });
    expect(screen.getByText('Password must have at least 8 characters')).toBeInTheDocument();
  });
  it.each([
    ['Password1', 0],
    ['Password123', 1],
    ['Password123!@3', 2],
    ['Password123!@3gh', 3],
    ['Password123!@3ghhfgd', 4],
  ])('renders with password %p and score %p', async (password, passwordStrength) => {
    act(() => {
      render(
        <PasswordStrengthMeter
          displayName=""
          email=""
          password={password}
          passwordPwnedCount={0}
        />,
      );
    });
    await waitFor(() => {
      expect(screen.getByTestId('bar')).toHaveStyleRule('width', barWidths[passwordStrength], {
        modifier: '::before',
      });
      expect(screen.getByTestId('bar')).toMatchSnapshot();
    });
  });
});
