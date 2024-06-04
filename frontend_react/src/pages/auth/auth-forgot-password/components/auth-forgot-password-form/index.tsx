import Button from 'app/common/components/button';
import InputField, { InputContainer } from 'app/components/form-inputs/Input';
import { KeyboardEvent, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  onSubmit: (email: string) => Promise<void>;
}

const ForgotPasswordForm = ({ onSubmit }: IPublicProps) => {
  const intl = useIntl();
  const [APIStateLoading, setAPIStateLoading] = useState(false);
  const [email, setEmail] = useState('');
  const handleSubmit = async () => {
    if (isEmail(email)) {
      setAPIStateLoading(true);
      await onSubmit(email);
      setAPIStateLoading(false);
    }
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleSubmit();
  };
  return (
    <Card>
      <CardContent>
        <HalfWidthHeadingContainer>
          <Title>
            <FormattedMessage defaultMessage="Recover your account" />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="Please enter your email or phone number to search for your account." />
          </SubTitle>
        </HalfWidthHeadingContainer>
        <FormContainer>
          <InputContainer>
            <InputField
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              onChange={setEmail}
              value={email}
              onKeyPress={handleKeyPress}
              label={intl.formatMessage({ defaultMessage: 'Email' })}
              error={!isEmail(email)}
            />
          </InputContainer>
        </FormContainer>
        <BottomBarContainer>
          <BottomBarSubContainer>
            <Button isLoading={APIStateLoading} onClick={handleSubmit}>
              <FormattedMessage defaultMessage="OK" />
            </Button>
          </BottomBarSubContainer>
        </BottomBarContainer>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
