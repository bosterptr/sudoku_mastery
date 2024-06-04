import Button from 'app/common/components/button';
import InputField, { InputContainer } from 'app/common/components/form-inputs/Input';
import { KeyIcon } from 'app/common/icons/KeyIcon';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  onSubmit: (token: string) => void;
}
const NewNetworkAddressForm = ({ onSubmit }: IPublicProps) => {
  const intl = useIntl();
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [APIStateLoading, setAPIStateLoading] = useState(false);
  const [token, setToken] = useState('');
  const handleChange = (value: string) => {
    setIsTokenValid(value.trim().length === 10);
    setToken(value.trim());
  };
  const handleSubmit = async () => {
    if (isTokenValid) {
      setAPIStateLoading(true);
      onSubmit(token);
      setAPIStateLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <HalfWidthHeadingContainer>
          <Title>
            <KeyIcon inline size="1em" color="grey" />
            <FormattedMessage defaultMessage="We see you're signing in from a new place." />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="As an additional security measure, you'll need to grant access to this network address by entering special code we've just sent to your email address." />
          </SubTitle>
        </HalfWidthHeadingContainer>
        <FormContainer>
          <InputContainer>
            <InputField
              value={token}
              onChange={handleChange}
              label={intl.formatMessage({ defaultMessage: 'Code' })}
              error={!isTokenValid}
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

export default NewNetworkAddressForm;
