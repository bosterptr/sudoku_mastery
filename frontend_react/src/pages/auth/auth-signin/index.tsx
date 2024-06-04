import { config, logger } from 'app/core/App';
import ErrorCodes from 'app/core/api/errorCodes';
import {
  activateDevice,
  activateDeviceAndNetworkAddress,
  activateNetworkAddress,
  signInWithEmail,
} from 'app/core/api/user';
import { useAppDispatch } from 'app/core/app_store';
import { saveUserCookie } from 'app/core/auth/cookies';
import SessionActions from 'app/core/redux/modules/session/actions';
import { Page } from 'app/features/page';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInForm from './components/auth-signin-form';
import NewDeviceAndNetworkAddressForm from './components/auth-signin-new-device-and-network-address-form';
import NewDeviceForm from './components/auth-signin-new-device-form';
import NewNetworkAddressForm from './components/auth-signin-new-network-address-form';
import UnauthenticatedUserComponent from './components/auth-signin-unauthenticated';
import WrongCredentialsComponent from './components/auth-signin-wrong-credentials';
import { Root } from '../styles';

// eslint-disable-next-line no-shadow
enum SignInStep {
  SignInStep,
  WrongCredentialsStep,
  NewDeviceStep,
  NewDeviceAndNetworkAddressStep,
  NewNetworkAddressStep,
  UnactivatedUserStep,
}

const SignInPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });
  const [step, setStep] = useState(SignInStep.SignInStep);
  const handleSignInSubmit = async (payload: { email: string; password: string }) => {
    setUserCredentials(payload);
    await signInWithEmail(payload).then((response) => {
      if ('error' in response.data) {
        switch (response.data.error.code) {
          case ErrorCodes.NEW_DEVICE:
            setStep(SignInStep.NewDeviceStep);
            break;
          case ErrorCodes.NEW_DEVICE_AND_NETWORK_ADDRESS:
            setStep(SignInStep.NewDeviceAndNetworkAddressStep);
            break;
          case ErrorCodes.NEW_NETWORK_ADDRESS:
            setStep(SignInStep.NewNetworkAddressStep);
            break;
          case ErrorCodes.WRONG_CREDENTIALS:
            setStep(SignInStep.WrongCredentialsStep);
            break;
          case ErrorCodes.UNACTIVATED_USER:
            setStep(SignInStep.UnactivatedUserStep);
            break;
          default: {
            assertUnreachable(response.data.error.code);
          }
        }
      } else {
        dispatch(SessionActions.setSessionUser(response.data.user));
        saveUserCookie(
          response.data.accessToken.token,
          response.data.accessToken.exp,
          response.data.refreshToken.exp,
          response.data.user,
          { config, logger },
        );
        navigate('/');
      }
    });
  };
  const handleNewDeviceSubmit = async (token: string) => {
    await activateDevice({ token });
    await handleSignInSubmit(userCredentials);
  };
  const handleNewDeviceAndNetworkAddressSubmit = async (token: string) => {
    await activateDeviceAndNetworkAddress({ token });
    await handleSignInSubmit(userCredentials);
  };
  const handleNewNetworkAddressSubmit = async (token: string) => {
    await activateNetworkAddress({ token });
    await handleSignInSubmit(userCredentials);
  };
  const moveBack = () => {
    setStep(SignInStep.SignInStep);
  };
  const renderStep = () => {
    switch (step) {
      case SignInStep.SignInStep:
        return <SignInForm onSubmit={handleSignInSubmit} />;
      case SignInStep.NewDeviceStep:
        return <NewDeviceForm onSubmit={handleNewDeviceSubmit} />;
      case SignInStep.NewDeviceAndNetworkAddressStep:
        return <NewDeviceAndNetworkAddressForm onSubmit={handleNewDeviceAndNetworkAddressSubmit} />;
      case SignInStep.NewNetworkAddressStep:
        return <NewNetworkAddressForm onSubmit={handleNewNetworkAddressSubmit} />;
      case SignInStep.WrongCredentialsStep:
        return <WrongCredentialsComponent onMoveBack={moveBack} />;
      case SignInStep.UnactivatedUserStep:
        return <UnauthenticatedUserComponent onMoveBack={moveBack} />;
      default: {
        return assertUnreachable(step);
      }
    }
  };
  return (
    <Page withoutTopNav>
      <Root>{renderStep()}</Root>
    </Page>
  );
};

export default SignInPage;
