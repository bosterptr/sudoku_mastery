import { DEFAULT_APP_ROOT_ELEMENT_ID } from 'app/core/constants/elementIds';
import { ComponentType } from 'react';
import { app } from '../App';
import { authenticateUser } from '../auth/authenticate-user';

export const bootstrap = (RootComponent: ComponentType, postMount?: () => void) => {
  function doMount() {
    app.mount(
      // <StrictMode>
      <RootComponent />,
      // </StrictMode>,
      document.getElementById(DEFAULT_APP_ROOT_ELEMENT_ID)!,
    );
    if (postMount) {
      postMount();
    }
  }

  authenticateUser();
  // mount();
  doMount();
};
