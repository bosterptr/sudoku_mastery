/* eslint-disable react/jsx-props-no-spreading */
import { ProductionConfig } from 'app/common/config/production';
import { AppStore } from 'app/core/app_store';
import { SESSION_NAMESPACE_KEY, SessionSlice } from 'app/core/redux/modules/session/state';
import { render } from 'app/tests/utils';
import { TopNav } from '.';

describe('TopNav', () => {
  it('renders correctly and matches snapshot', () => {
    const store = AppStore(new ProductionConfig());
    store.registerReducer(SESSION_NAMESPACE_KEY, SessionSlice);
    const { asFragment } = render(<TopNav />, { store });
    expect(asFragment()).toMatchSnapshot();
  });
});
