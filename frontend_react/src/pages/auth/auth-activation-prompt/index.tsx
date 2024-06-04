import Button from 'app/common/components/button';
import { PersonOutline } from 'app/common/icons/PersonOutline';
import { Page } from 'app/features/page';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import {
  BottomBarContainer,
  BottomBarSubContainer,
  Card,
  CardContent,
  Root,
  SubTitle,
  Title,
} from '../styles';

const AccountActivationPrompt = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const handleClick = () => navigate('/');
  return (
    <Page withoutTopNav>
      <Root>
        <Card>
          <CardContent>
            <Title>
              <PersonOutline inline size="1em" color={theme.palette.success.light} />
              <FormattedMessage defaultMessage="Activate your account" />
            </Title>
            <SubTitle>
              <FormattedMessage defaultMessage="Thank you for registering your account. In order to start using our service you must activate it first. An activation email has been sent to you." />
            </SubTitle>
            <BottomBarContainer>
              <BottomBarSubContainer>
                <Button onClick={handleClick}>
                  <FormattedMessage defaultMessage="OK" />
                </Button>
              </BottomBarSubContainer>
            </BottomBarContainer>
          </CardContent>
        </Card>
      </Root>
    </Page>
  );
};

export default AccountActivationPrompt;
