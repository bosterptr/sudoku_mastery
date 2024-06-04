import SessionActions from 'app/core/redux/modules/session/actions';
import { getUserCookie } from './cookies';
import { app } from '../App';

export function authenticateUser() {
  const logger = app.logger.withCategory('auth');
  const { config } = app;
  const userCookie = getUserCookie({ config, logger });
  if (userCookie) {
    logger.debug('Using existing user cookie.');
    app.store.dispatchAction(SessionActions.setSessionUser(userCookie));
  } else {
    logger.debug('No user data found.');
    app.store.dispatchAction(SessionActions.setSessionUser(null));
  }
}
