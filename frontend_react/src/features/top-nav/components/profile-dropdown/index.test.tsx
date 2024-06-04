/* eslint-disable react/jsx-props-no-spreading */
import { ProductionConfig } from 'app/common/config/production';
import { AppStore } from 'app/core/app_store';
import SessionActions from 'app/core/redux/modules/session/actions';
import { SESSION_NAMESPACE_KEY, SessionSlice } from 'app/core/redux/modules/session/state';
import { fireEvent, render, waitFor } from 'app/tests/utils';
import ProfileDropdown, { IProps } from '.';

function getProps(): IProps {
  return {
    navigate: jest.fn(),
    onClickAway: jest.fn(),
    open: false,
  };
}

describe('ProfileDropdown', () => {
  describe('when the user is authenticated', () => {
    it('renders correctly and matches snapshot', () => {
      const store = AppStore(new ProductionConfig());
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      const { asFragment } = render(<ProfileDropdown {...getProps()} />, { store });
      expect(asFragment()).toMatchSnapshot();
    });
    it('should be invisible when open prop is false', () => {
      const store = AppStore(new ProductionConfig());
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      const { queryByTestId } = render(<ProfileDropdown {...getProps()} />, { store });
      expect(queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });

    it('displays user avatar when authenticated', () => {
      const store = AppStore(new ProductionConfig());
      const user = {
        id: '1',
        email: 'email@email.email',
        displayName: 'displayName',
      };
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      store.dispatchAction(SessionActions.setSessionUser(user));
      const { getByText } = render(<ProfileDropdown {...getProps()} open />, { store });
      expect(getByText('d')).toBeInTheDocument(); // First letter of displayName
    });
    it('closes the dropdown when clicking outside', () => {
      const store = AppStore(new ProductionConfig());
      const user = {
        id: '1',
        email: 'email@email.email',
        displayName: 'displayName',
      };
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      store.dispatchAction(SessionActions.setSessionUser(user));
      const { getByTestId, queryByTestId } = render(<ProfileDropdown {...getProps()} open />, {
        store,
      });
      fireEvent.click(getByTestId('backdrop'));
      waitFor(() => expect(queryByTestId('profile-dropdown')).not.toBeInTheDocument());
    });
  });
});
