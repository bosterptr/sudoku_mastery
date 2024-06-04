import { render, screen } from '@testing-library/react';
import { useReduxState } from 'app/common/hooks/use-redux-state';
import { Page } from 'app/features/page';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthenticatedPage } from '.';

// Mock the necessary hooks and components
jest.mock('app/common/hooks/use-redux-state');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('app/features/page', () => ({
  Page: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('AuthenticatedPage', () => {
  const mockUseReduxState = useReduxState as jest.Mock;
  const mockUseNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    mockUseReduxState.mockClear();
    mockUseNavigate.mockClear();
  });

  it('redirects to sign-in page if currentUserId is not present', () => {
    const navigate = jest.fn();
    mockUseNavigate.mockReturnValue(navigate);
    mockUseReduxState.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={<AuthenticatedPage title="Test Title">Test Children</AuthenticatedPage>}
          />
          <Route path="/auth/signin" element={<div>Sign In Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(navigate).toHaveBeenCalledWith('/auth/signin');
    expect(screen.queryByText('Test Children')).not.toBeInTheDocument();
  });

  it('renders the Page component with the given title and children if currentUserId is present', () => {
    const navigate = jest.fn();
    mockUseNavigate.mockReturnValue(navigate);
    mockUseReduxState.mockReturnValue('user123');

    render(
      <MemoryRouter>
        <AuthenticatedPage title="Test Title">Test Children</AuthenticatedPage>
      </MemoryRouter>,
    );

    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Children')).toBeInTheDocument();
    expect(Page).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Test Title', children: 'Test Children' }),
      {},
    );
  });
});
