import Fade from 'app/common/components/animations/Fade';
import { ISudoku, SudokuDifficulty, SudokuStageOfTheGame } from 'app/components/sudoku-game/types';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import NOOP from 'app/utils/noop';
import { lazy, Suspense, useState } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { SUDOKU_PREVIEW_DATA_URL } from './preview';

const SudokuCanvas = lazy(
  () =>
    import(
      /* webpackChunkName: "components.sudoku-game.components.sudoku-canvas" */ 'app/components/sudoku-game/components/sudoku-canvas'
    ),
);

const Container = styled.div`
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: ${(p) => p.theme.shadows.z2};
  cursor: pointer;
  position: relative;
  transition: box-shadow 0.3s ease;
  width: 354px;
  &:hover {
    box-shadow: ${(p) => p.theme.shadows.z3};
  }
`;
const PreviewContainer = styled.div`
  display: block;
  position: relative;
`;

const BottomBar = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;

const BottomBarBlock = styled.div``;
const getDifficultyMessage = (intl: IntlShape, difficulty: ISudoku['difficulty']) => {
  switch (difficulty) {
    case SudokuDifficulty.Easy:
      return intl.formatMessage({ defaultMessage: 'Easy' });
    case SudokuDifficulty.Medium:
      return intl.formatMessage({ defaultMessage: 'Medium' });
    case SudokuDifficulty.Hard:
      return intl.formatMessage({ defaultMessage: 'Hard' });
    case SudokuDifficulty.Expert:
      return intl.formatMessage({ defaultMessage: 'Expert' });
    default: {
      return assertUnreachable(difficulty);
    }
  }
};
export const SudokuPreview = ({ sudoku }: { sudoku: ISudoku }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/mission/${sudoku.id}`);
  };
  const [rendered, setRendered] = useState<string | null>(null);
  const handleRender = (dataUrl: string) => {
    setRendered(dataUrl);
  };
  return (
    <Container onClick={handleClick}>
      <PreviewContainer>
        {!rendered && (
          <Suspense>
            <SudokuCanvas
              conflicts={[]}
              gameStage={SudokuStageOfTheGame.INITIAL}
              mission={sudoku.body}
              mistakes={[]}
              notes={[]}
              onAcceptedLostGame={NOOP}
              onAcceptedWonGame={NOOP}
              onCellSelect={NOOP}
              selectedCell={null}
              values={sudoku.body}
              renderPreview={handleRender}
            />
          </Suspense>
        )}
        <img
          style={{ width: '354px', height: '354px' }}
          alt={sudoku.body}
          src={SUDOKU_PREVIEW_DATA_URL}
        />
        {rendered && (
          <Fade mountOnEnter>
            <img
              src={rendered}
              alt={sudoku.body}
              style={{ width: '354px', height: '354px', position: 'absolute', left: 0, zIndex: 2 }}
            />
          </Fade>
        )}
      </PreviewContainer>
      <BottomBar>
        <BottomBarBlock>
          <FormattedMessage defaultMessage="Difficulty" />:{' '}
          {getDifficultyMessage(intl, sudoku.difficulty)}
        </BottomBarBlock>
        {/* <BottomBarBlock>
          <FormattedMessage defaultMessage="Win rate" />: {sudoku.winRate}%
        </BottomBarBlock> */}
      </BottomBar>
    </Container>
  );
};
