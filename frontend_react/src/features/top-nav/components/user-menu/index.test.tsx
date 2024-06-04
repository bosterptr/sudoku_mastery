/* eslint-disable react/jsx-props-no-spreading */
import { ProductionConfig } from 'app/common/config/production';
import { AppStore } from 'app/core/app_store';
import SessionActions from 'app/core/redux/modules/session/actions';
import { SESSION_NAMESPACE_KEY, SessionSlice } from 'app/core/redux/modules/session/state';
import { render } from 'app/tests/utils';
import { UserMenu } from '.';

describe('UserMenu', () => {
  describe('when the user is authenticated', () => {
    it('renders correctly and matches snapshot', () => {
      const store = AppStore(new ProductionConfig());
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      const { asFragment } = render(<UserMenu />, { store });
      expect(asFragment()).toMatchSnapshot();
    });
    it('displays sign in link when not authenticated', () => {
      const store = AppStore(new ProductionConfig());
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      const { queryByText } = render(<UserMenu />, { store });
      expect(queryByText(/sign in/i)).toBeInTheDocument();
      expect(queryByText('d')).not.toBeInTheDocument(); // First letter of displayName
    });
    test('displays user avatar when authenticated', () => {
      const store = AppStore(new ProductionConfig());
      const user = {
        id: '1',
        email: 'email@email.email',
        displayName: 'displayName',
      };
      store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
      store.dispatchAction(SessionActions.setSessionUser(user));
      const { queryByText } = render(<UserMenu />, { store });
      expect(queryByText(/sign in/i)).not.toBeInTheDocument();
      expect(queryByText('d')).toBeInTheDocument(); // First letter of displayName
    });
  });
});
