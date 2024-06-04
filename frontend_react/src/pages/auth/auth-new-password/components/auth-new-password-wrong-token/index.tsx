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
  Title,
} from '../../../styles';

interface IPublicProps {
  onMoveBack: () => void;
}
const WrongTokenComponent = ({ onMoveBack }: IPublicProps) => {
  const theme = useTheme();
  return (
    <Card>
      <CardContent>
        <HeadingContainer>
          <Title>
            <Warning inline size="1em" color={theme.palette.errors.main} />
            <FormattedMessage defaultMessage="Your token has expired" />
          </Title>
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

export default WrongTokenComponent;
