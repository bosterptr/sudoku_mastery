import Button from 'app/common/components/button';
import FormInput, { InputContainer } from 'app/components/form-inputs/Input';
import { PasswordStrengthMeter } from 'app/components/password-strength-meter';
import { useZxcvbn } from 'app/components/password-strength-meter/useZxcvbn';
import { signup } from 'app/core/api/user';
import { Page } from 'app/features/page';
import { PATH_AUTH_ACTIVATE } from 'app/pages/paths';
import debounce from 'app/utils/debounce';
import { checkIfPasswordPassesComplexityRequirement } from 'app/utils/passwordComplexity';
import { useCallback, useState } from 'react';
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
  Root,
  SubTitle,
  Title,
} from '../styles';
import { getPasswordPwnedCount } from '../utils/getPasswordPwnedCount';

const SignupForm = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const zxcvbn = useZxcvbn();
  const [debouncedGetPasswordPwnedCount, debouncedGetPasswordPwnedCountTeardown] = debounce(
    getPasswordPwnedCount,
    500,
  );
  const [registerAPIStateLoading, setRegisterAPIStateLoading] = useState(false);
  const [isHaveIBeenPwnedAlive, setIsHaveIBeenPwnedAlive] = useState(true);
  const [loadingPwnCount, setLoadingPwnCount] = useState(false);
  const [passwordPwnedCount, setPasswordPwnedCount] = useState<number | null>(null);
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    displayName: '',
    password: '',
  });
  const [validationError, setValidationError] = useState({
    email: true,
    displayName: true,
    password: true,
  });

  const updatePasswordPwnedCountCallback = useCallback(
    async (pass: string) => {
      setPasswordPwnedCount(0);
      setLoadingPwnCount(true);
      let pwnedCount: number = 0;
      if (isHaveIBeenPwnedAlive)
        pwnedCount =
          (await debouncedGetPasswordPwnedCount(pass).catch(() => {
            setIsHaveIBeenPwnedAlive(false);
          })) || 0;

      setLoadingPwnCount(false);
      setPasswordPwnedCount(pwnedCount);
      return () => debouncedGetPasswordPwnedCountTeardown();
    },
    [debouncedGetPasswordPwnedCount, debouncedGetPasswordPwnedCountTeardown, isHaveIBeenPwnedAlive],
  );
  const handleSubmit = async () => {
    if (
      !(
        validationError.email ||
        validationError.displayName ||
        validationError.password ||
        loadingPwnCount
      )
    ) {
      setRegisterAPIStateLoading(true);
      await signup({
        email: userCredentials.email,
        displayName: userCredentials.displayName,
        password: userCredentials.password,
      });
      setRegisterAPIStateLoading(false);
      navigate(PATH_AUTH_ACTIVATE);
    }
  };
  const onPasswordInputChanged = async (value: string) => {
    setUserCredentials({ ...userCredentials, password: value });
    const passwordPassesComplexityRequirement = checkIfPasswordPassesComplexityRequirement(
      zxcvbn,
      value,
      [userCredentials.email],
    );
    setValidationError({
      ...validationError,
      password: !passwordPassesComplexityRequirement,
    });
    if (passwordPassesComplexityRequirement) updatePasswordPwnedCountCallback(value);
  };
  const onEmailInputChanged = (value: string) => {
    const error = !isEmail(value) || value.length > 255;
    setValidationError({ ...validationError, email: error });
    setUserCredentials({ ...userCredentials, email: value });
  };
  const onDisplayNameInputChanged = (value: string) => {
    const trimmedValue = value.trim();
    const error = trimmedValue.length > 255 || trimmedValue.length < 3;
    setValidationError({ ...validationError, displayName: error });
    setUserCredentials({ ...userCredentials, displayName: trimmedValue });
  };
  return (
    <Page withoutTopNav>
      <Root>
        <Card>
          <CardContent>
            <HalfWidthHeadingContainer>
              <Title>
                <FormattedMessage defaultMessage="I do not have an account" />
              </Title>
              <SubTitle>
                <FormattedMessage defaultMessage="Sign up with your email and password" />
              </SubTitle>
            </HalfWidthHeadingContainer>
            <FormContainer>
              <InputContainer>
                <FormInput
                  type="displayName"
                  id="displayName"
                  value={userCredentials.displayName}
                  onChange={onDisplayNameInputChanged}
                  label={intl.formatMessage({ defaultMessage: 'Display Name' })}
                  error={validationError.displayName}
                />
              </InputContainer>
              <InputContainer hidden={validationError.displayName}>
                <FormInput
                  type="email"
                  autoComplete="username"
                  id="email"
                  value={userCredentials.email}
                  onChange={onEmailInputChanged}
                  label={intl.formatMessage({ defaultMessage: 'Email' })}
                  error={validationError.email}
                />
              </InputContainer>
              <InputContainer hidden={validationError.email}>
                <FormInput
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={userCredentials.password}
                  onChange={onPasswordInputChanged}
                  label={intl.formatMessage({ defaultMessage: 'Password' })}
                  disabled={validationError.displayName || validationError.email}
                />
                <PasswordStrengthMeter
                  displayName=""
                  email={userCredentials.email}
                  password={userCredentials.password}
                  passwordPwnedCount={passwordPwnedCount}
                />
              </InputContainer>
            </FormContainer>
            <BottomBarContainer>
              <BottomBarSubContainer>
                <Button
                  isLoading={registerAPIStateLoading}
                  disabled={
                    validationError.email ||
                    validationError.displayName ||
                    validationError.password ||
                    loadingPwnCount ||
                    passwordPwnedCount !== 0
                  }
                  onClick={handleSubmit}
                >
                  <FormattedMessage defaultMessage="SIGN UP" />
                </Button>
              </BottomBarSubContainer>
            </BottomBarContainer>
          </CardContent>
        </Card>
      </Root>
    </Page>
  );
};

export default SignupForm;
