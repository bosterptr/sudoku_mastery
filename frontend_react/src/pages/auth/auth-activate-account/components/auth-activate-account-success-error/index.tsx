import Button from 'app/common/components/button';
import { Warning } from 'app/common/icons/Warning';
import { PATH_AUTH_SIGN_IN } from 'app/pages/paths';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import {
  BottomBarContainer,
  BottomBarSubContainer,
  Card,
  CardContent,
  HeadingContainer,
  SubTitle,
  Title,
} from '../../../styles';

const AccountActivationError = () => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(PATH_AUTH_SIGN_IN);
  };
  return (
    <Card>
      <CardContent>
        <HeadingContainer>
          <Title>
            <Warning inline size="1em" color="red" />
            <FormattedMessage defaultMessage="Something went wrong" />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="The token has expired, or has already been used, so your account is already active." />
          </SubTitle>
        </HeadingContainer>
        <BottomBarContainer>
          <BottomBarSubContainer>
            <Button onClick={handleClose}>
              <FormattedMessage defaultMessage="OK" />
            </Button>
          </BottomBarSubContainer>
        </BottomBarContainer>
      </CardContent>
    </Card>
  );
};

export default AccountActivationError;
