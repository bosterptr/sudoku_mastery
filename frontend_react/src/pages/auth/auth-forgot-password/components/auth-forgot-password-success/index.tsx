import { Done } from 'app/common/icons/Done';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { Card, CardContent, HeadingContainer, SubTitle, Title } from '../../../styles';

const ForgotPasswordSuccess = () => {
  const theme = useTheme();
  return (
    <Card>
      <CardContent>
        <HeadingContainer>
          <Title>
            <Done inline size="1em" color={theme.palette.success.main} />
            <FormattedMessage defaultMessage="Password reset email sent" />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="An email has ben sent to the email address. Follow the directions in the email to reset your password." />
          </SubTitle>
        </HeadingContainer>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordSuccess;
