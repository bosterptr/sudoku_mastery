import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { SudokuDifficultyBar } from '../sudoku-difficulty-bar';

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 5px;
  position: relative;
`;

const Block = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.43;
  color: ${(p) => p.theme.palette.text.primary};
`;

const RightBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 38%;
`;

const BlockValue = styled.span`
  color: ${(p) => p.theme.palette.text.maxContrast};
  font-size: 13px;
  font-weight: 600;
  margin-left: 4px;
`;

const convertSecondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export interface IPublicProps {
  className?: string;
  difficulty: ISudoku['difficulty'];
  mistakes: number;
  onChangeGameType: (difficulty: ISudoku['difficulty']) => void;
  score: number;
  seconds: number;
}

export const SudokuHeader = ({
  className,
  difficulty,
  mistakes,
  onChangeGameType,
  score,
  seconds,
}: IPublicProps) => (
  <Container className={className}>
    <SudokuDifficultyBar difficulty={difficulty} onChangeGameType={onChangeGameType} />
    <RightBlock>
      <Block>
        <FormattedMessage defaultMessage="Mistakes" />:<BlockValue>{mistakes}/3</BlockValue>
      </Block>
      <Block>
        <FormattedMessage defaultMessage="Score" />:<BlockValue>{score}</BlockValue>
      </Block>
      <Block>{convertSecondsToMMSS(seconds)}</Block>
    </RightBlock>
  </Container>
);
