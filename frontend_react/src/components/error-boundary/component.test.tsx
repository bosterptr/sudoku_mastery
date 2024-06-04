import { render } from 'app/tests/utils';
import { ErrorBoundary } from '.';

const TestComponent = () => <div>Test Component</div>;
const TestErrorComponent = () => {
  throw new Error('Error');
};
const TestErrorContent = () => <div>Test Error Content</div>;

describe('Error Boundary', () => {
  const consoleSpy = jest.spyOn(console, 'error');
  beforeEach(() => consoleSpy.mockReset());
  afterAll(() => consoleSpy.mockRestore());

  it('renders non-error content correctly', () => {
    const { asFragment } = render(
      <ErrorBoundary name="TestComponent">
        <TestComponent />
      </ErrorBoundary>,
    );
    expect(asFragment().children).toHaveLength(1);
  });

  it('renders "Sorry this page is broken" on error without alternative', () => {
    const { getByText } = render(
      <ErrorBoundary name="TestComponent">
        <TestErrorComponent />
      </ErrorBoundary>,
    );
    expect(getByText('Sorry this page is broken')).toBeInTheDocument();
  });

  it('renders alternative content on error', () => {
    const content = <TestErrorContent />;
    const { getByText } = render(
      <ErrorBoundary name="TestComponent" content={content}>
        <TestErrorComponent />
      </ErrorBoundary>,
    );
    expect(getByText('Test Error Content')).toBeInTheDocument();
  });

  it('calls an onError callback when an error is caught and that prop is provided', () => {
    const onError = jest.fn();
    render(
      <ErrorBoundary name="TestComponent" onError={onError}>
        <TestErrorComponent />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalled();
  });
});
