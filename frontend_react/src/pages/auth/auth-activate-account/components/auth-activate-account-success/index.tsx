import Button from 'app/common/components/button';
import { PersonOutline } from 'app/common/icons/PersonOutline';
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

const AccountActivationSuccess = () => {
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(PATH_AUTH_SIGN_IN);
  };
  return (
    <Card>
      <CardContent>
        <HeadingContainer>
          <Title>
            <PersonOutline inline size="1em" color="#08a608" />
            <FormattedMessage defaultMessage="Account activated" />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="Thank you for activating your account." />
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

export default AccountActivationSuccess;
