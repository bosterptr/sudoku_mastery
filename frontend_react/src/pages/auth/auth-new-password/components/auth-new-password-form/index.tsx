import Button from 'app/common/components/button';
import FormInput, { InputContainer } from 'app/components/form-inputs/Input';
import { PasswordStrengthMeter } from 'app/components/password-strength-meter';
import { useZxcvbn } from 'app/components/password-strength-meter/useZxcvbn';
import debounce from 'app/utils/debounce';
import { checkIfPasswordPassesComplexityRequirement } from 'app/utils/passwordComplexity';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  BottomBarContainer,
  BottomBarSubContainer,
  CardContent,
  FormContainer,
  HalfWidthHeadingContainer,
  SubTitle,
  Title,
} from '../../../styles';
import { getPasswordPwnedCount } from '../../../utils/getPasswordPwnedCount';

interface IPublicProps {
  onSubmit: (password: string) => Promise<void>;
  email: string;
}

const NewPasswordForm = ({ email, onSubmit }: IPublicProps) => {
  const intl = useIntl();
  const zxcvbn = useZxcvbn();
  const [debouncedGetPasswordPwnedCount, debouncedGetPasswordPwnedCountTeardown] = debounce(
    getPasswordPwnedCount,
    500,
  );
  const [APIStateLoading, setAPIStateLoading] = useState(false);
  const [isHaveIBeenPwnedAlive, setIsHaveIBeenPwnedAlive] = useState(true);
  const [loadingPwnCount, setLoadingPwnCount] = useState(false);
  const [passwordPwnedCount, setPasswordPwnedCount] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState(true);

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
  const handlePasswordInputChanged = async (value: string) => {
    setPassword(value);
    const passwordPassesComplexityRequirement = checkIfPasswordPassesComplexityRequirement(
      zxcvbn,
      value,
      [email],
    );
    setValidationError(!passwordPassesComplexityRequirement);
    if (passwordPassesComplexityRequirement) updatePasswordPwnedCountCallback(value);
  };
  const handleSubmit = async () => {
    if (!(validationError || loadingPwnCount)) {
      setAPIStateLoading(true);
      await onSubmit(password);
      setAPIStateLoading(false);
    }
  };
  return (
    <CardContent>
      <HalfWidthHeadingContainer>
        <Title>
          <FormattedMessage defaultMessage="Change your password" />
        </Title>
        <SubTitle>
          <FormattedMessage defaultMessage="A strong password helps prevent anauthorized access to your account." />
        </SubTitle>
      </HalfWidthHeadingContainer>
      <FormContainer>
        <InputContainer>
          <FormInput
            type="password"
            id="password"
            autoComplete="password"
            value={password}
            onChange={handlePasswordInputChanged}
            label={intl.formatMessage({ defaultMessage: 'Password' })}
          />
          <PasswordStrengthMeter
            displayName=""
            email={email}
            password={password}
            passwordPwnedCount={passwordPwnedCount}
          />
        </InputContainer>
      </FormContainer>
      <BottomBarContainer>
        <BottomBarSubContainer>
          <Button
            isLoading={APIStateLoading}
            disabled={validationError || loadingPwnCount || passwordPwnedCount !== 0}
            onClick={handleSubmit}
          >
            <FormattedMessage defaultMessage="SIGN UP" />
          </Button>
        </BottomBarSubContainer>
      </BottomBarContainer>
    </CardContent>
  );
};

export default NewPasswordForm;
