import Button from 'app/common/components/button';
import { useReduxState } from 'app/common/hooks/use-redux-state';
import InputField, { InputContainer } from 'app/components/form-inputs/Input';
import { selectAuthAPIState } from 'app/core/redux/modules/auth/state';
import { AuthAPIStateKeys } from 'app/core/redux/modules/auth/types';
import { PATH_AUTH_FORGOT_PASSWORD, PATH_AUTH_SIGN_UP } from 'app/pages/paths';
import { KeyboardEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import isEmail from 'validator/es/lib/isEmail';
import {
  BottomBarContainer,
  BottomBarSubContainer,
  Card,
  CardContent,
  FormContainer,
  HalfWidthHeadingContainer,
  SubTitle,
  Title,
} from '../../../styles';

interface IPublicProps {
  onSubmit: (userCredentials: { email: string; password: string }) => Promise<void>;
}

const SignInForm = ({ onSubmit }: IPublicProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const loginAPIState = useReduxState((state) =>
    selectAuthAPIState(state, AuthAPIStateKeys.loginWithEmail),
  );
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = async () => {
    await onSubmit(userCredentials);
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit(userCredentials);
    }
  };
  const onEmailInputChanged = (value: string) => {
    setUserCredentials({ ...userCredentials, email: value });
  };
  const onPasswordInputChanged = (value: string) => {
    setUserCredentials({ ...userCredentials, password: value });
  };
  const navigateToForgotPassword = () => navigate(PATH_AUTH_FORGOT_PASSWORD);
  const navigateToRegister = () => navigate(PATH_AUTH_SIGN_UP);
  return (
    <Card>
      <CardContent>
        <HalfWidthHeadingContainer>
          <Title>
            <FormattedMessage defaultMessage="I already have an account." />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="Sign in with your email and password." />
          </SubTitle>
        </HalfWidthHeadingContainer>
        <FormContainer>
          <InputContainer>
            <InputField
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              onChange={onEmailInputChanged}
              value={userCredentials.email}
              label={intl.formatMessage({ defaultMessage: 'Email' })}
              error={!isEmail(userCredentials.email)}
            />
          </InputContainer>
          <InputContainer>
            <InputField
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={userCredentials.password}
              onChange={onPasswordInputChanged}
              onKeyPress={handleKeyPress}
              label={intl.formatMessage({ defaultMessage: 'Password' })}
            />
          </InputContainer>
          <Button
            category="teriary"
            onClick={navigateToForgotPassword}
            size="sm"
            style={{ left: '-6px', position: 'relative' }}
          >
            <FormattedMessage defaultMessage="Forgot password?" />
          </Button>
        </FormContainer>
        <BottomBarContainer>
          <BottomBarSubContainer>
            <Button isLoading={loginAPIState.isLoading} onClick={handleSubmit}>
              <FormattedMessage defaultMessage="SIGN IN" />
            </Button>
            <Button category="teriary" onClick={navigateToRegister}>
              <FormattedMessage defaultMessage="Create account" />
            </Button>
          </BottomBarSubContainer>
        </BottomBarContainer>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
