import Button from 'app/common/components/button';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const Backdrop = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  bottom: 0;
  justify-content: center;
  left: 0;
  overflow: hidden;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 999;
`;

const Container = styled.div`
  background-color: ${(p) => p.theme.palette.background.primary};
  border-radius: 5px;
  left: 50%;
  margin: auto;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 20px;
`;

export const BottomBarContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
`;

export interface IPublicProps {
  className?: string;
  mistakes: number;
  score: number;
}
export const SudokuGameOver = ({
  gameOver,
  onAcceptedLostGame,
}: {
  gameOver: boolean;
  onAcceptedLostGame: () => void;
}) => {
  if (gameOver)
    return (
      <Backdrop>
        <Container>
          <Title>
            <FormattedMessage defaultMessage="Game over" />
          </Title>
          <Description>
            <FormattedMessage defaultMessage="You've lost this game because of your three mistakes." />
          </Description>
          <BottomBarContainer>
            <Button onClick={onAcceptedLostGame}>
              <FormattedMessage defaultMessage="New game" />
            </Button>
          </BottomBarContainer>
        </Container>
      </Backdrop>
    );
  return null;
};
