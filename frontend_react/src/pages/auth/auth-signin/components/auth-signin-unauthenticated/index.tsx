import Button from 'app/common/components/button';
import { Warning } from 'app/common/icons/Warning';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import {
  BottomBarContainer,
  BottomBarSubContainer,
  Card,
  CardContent,
  HeadingContainer,
  SubTitle,
  Title,
} from '../../../styles';

interface IPublicProps {
  onMoveBack: () => void;
}
const UnauthenticatedUserComponent = ({ onMoveBack }: IPublicProps) => {
  const theme = useTheme();
  return (
    <Card>
      <CardContent>
        <HeadingContainer>
          <Title>
            <Warning inline size="1em" color={theme.palette.errors.main} />
            <FormattedMessage defaultMessage="Activate your account" />
          </Title>
          <SubTitle>
            <FormattedMessage defaultMessage="You must activate that account before logging in. An activation email has been sent to you." />
          </SubTitle>
        </HeadingContainer>
        <BottomBarContainer>
          <BottomBarSubContainer>
            <Button onClick={onMoveBack}>
              <FormattedMessage defaultMessage="OK" />
            </Button>
          </BottomBarSubContainer>
        </BottomBarContainer>
      </CardContent>
    </Card>
  );
};

export default UnauthenticatedUserComponent;
