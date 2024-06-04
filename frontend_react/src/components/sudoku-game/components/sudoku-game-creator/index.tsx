import Button from 'app/common/components/button';
import { useEventListener } from 'app/common/hooks/use-event-listener';
import { CameraIcon } from 'app/common/icons/Camera';
import { EraserIcon } from 'app/common/icons/Eraser';
import { UndoIcon } from 'app/common/icons/Undo';
import { SudokuCameraCreator } from 'app/components/App';
import { ALL_SUDOKU_CELLS, SUDOKU_CELLS_IN_ROW } from 'app/core/constants/sudoku';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import NOOP from 'app/utils/noop';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import initWasm, { solve } from 'sudoku_wasm';
import { IStep, StepType } from './types';
import { EMPTY_CELL, getCubeId, getX, getY, isSudokuCellEmpty } from './utils';
import { SudokuDifficulty } from '../../types';
import SudokuCanvas from '../sudoku-canvas';
import { SudokuDifficultyBar } from '../sudoku-difficulty-bar';
import { SudokuNumpad } from '../sudoku-numpad';
import { SudokuNumpadButton } from '../sudoku-numpad-button';
import { SudokuNumpadControlButton } from '../sudoku-numpad-control-button';

// eslint-disable-next-line no-shadow
const enum KeyboardCodes {
  ArrowUp = 'ArrowUp',
  ArrowRight = 'ArrowRight',
  ArrowDown = 'ArrowDown',
  ArrowLeft = 'ArrowLeft',
  KeyW = 'KeyW',
  KeyA = 'KeyA',
  KeyS = 'KeyS',
  KeyD = 'KeyD',
}

const RightPanelControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 10px;
`;
const RightPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  @media (max-width: 800px) {
    margin-left: 0;
    width: 100%;
  }
`;
const StyledSudokuNumpad = styled(SudokuNumpad)``;
const StyleSudokuNumpadButton = styled(SudokuNumpadButton)`
  margin: 0 0 0 0;
`;
const Container = styled.div`
  flex-direction: row;
  position: relative;
  display: flex;
  align-items: center;
  @media (max-width: 800px) {
    flex-direction: column;
    ${StyleSudokuNumpadButton} {
      margin: 0 0 0 0;
    }
    ${StyledSudokuNumpad} {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    }
  }
  @media (min-width: 768px) {
    max-width: 768px;
  }
  @media (min-width: 840px) {
    min-width: 840px;
  }
`;
const SudokuCanvasContainer = styled.div`
  flex-direction: column;
  display: flex;
  position: relative;
  width: 100%;
`;
const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  color: ${(p) => p.theme.palette.text.secondary};
`;
const Root = styled.div`
  flex-direction: column;
  display: flex;
  position: relative;
  margin: 0 auto;
`;

export interface IPublicProps {
  onCreate: (data: { body: ISudoku['body']; difficulty: ISudoku['difficulty'] }) => Promise<void>;
}

export const SudokuGameCreator = ({ onCreate }: IPublicProps) => {
  const [conflicts, setConflicts] = useState<boolean[]>([]);
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  const [currentGame, setCurrentGame] = useState<{
    body: ISudoku['body'];
    difficulty: ISudoku['difficulty'];
  }>({
    difficulty: SudokuDifficulty.Medium,
    body: '.................................................................................',
  });
  const [isSolvable, setIsSolvable] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [cameraMode, setCameraMode] = useState<boolean>(false);
  const [steps, setSteps] = useState<IStep[]>([]);
  const lastSolvable = useRef<string>('');
  const handleChangeDifficulty = (difficulty: ISudoku['difficulty']) => {
    setCurrentGame({ ...currentGame, difficulty });
  };
  const handleSetBody = (body: ISudoku['body']) => {
    setCurrentGame({ ...currentGame, body });
    setCameraMode(false);
    const solution = solve(body);
    setIsSolvable(Boolean(solution));
  };
  const validateBoard = (valuesToValidate: string) => {
    if (selectedCell === null) return;
    const updatedConflicts: boolean[] = Array(ALL_SUDOKU_CELLS).fill(false);
    const updatedMistakes: boolean[] = Array(ALL_SUDOKU_CELLS).fill(false);
    const solution = solve(valuesToValidate);
    setIsSolvable(Boolean(solution));
    lastSolvable.current = valuesToValidate;
    for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
      if (valuesToValidate[cellIndex] !== EMPTY_CELL) {
        if (valuesToValidate[cellIndex] !== solution[cellIndex]) {
          updatedMistakes[cellIndex] = true;
        }
        for (let cellIndex2 = 0; cellIndex2 < ALL_SUDOKU_CELLS; cellIndex2 += 1) {
          if (
            !isSudokuCellEmpty(valuesToValidate[cellIndex2]) &&
            cellIndex !== cellIndex2 &&
            valuesToValidate[cellIndex] === valuesToValidate[cellIndex2] &&
            !(
              getCubeId(cellIndex2) !== getCubeId(cellIndex) &&
              getX(cellIndex2) !== getX(cellIndex) &&
              getY(cellIndex2) !== getY(cellIndex)
            )
          ) {
            updatedConflicts[cellIndex] = true;
          }
        }
      }
    }
    lastSolvable.current = solution;
    setConflicts(updatedConflicts);
    setMistakes(updatedMistakes);
  };

  const handleUndoClick = () => {
    if (steps.length !== 0) {
      const step = steps[steps.length - 1];
      switch (step.type) {
        case StepType.SetNumber: {
          const nextSteps = [...steps];
          const nextValuesArr = [...currentGame.body];
          nextValuesArr[step.index] = step.previous;
          const updatedValues = nextValuesArr.join('');
          setCurrentGame({ ...currentGame, body: updatedValues });
          nextSteps.pop();
          setSteps(nextSteps);
          validateBoard(updatedValues);
          break;
        }
        case StepType.SetNote: {
          const nextValuesArr = [...currentGame.body];
          nextValuesArr[step.index] = step.previous;
          const updatedValues = nextValuesArr.join('');
          setCurrentGame({ ...currentGame, body: updatedValues });
          steps.pop();
          setSteps([...steps]);
          break;
        }
        default:
          assertUnreachable(step.type);
      }
    }
  };
  const setCellValue = (value: string) => {
    if (selectedCell !== null) {
      if (
        steps.length !== 0 &&
        steps[steps.length - 1].index === selectedCell &&
        steps[steps.length - 1].value === value
      )
        // Check if the last step is the same as the current one.
        // Omit the move if it's the same.
        return;
      const nextSteps = [...steps];
      nextSteps.push({
        index: selectedCell,
        previous: currentGame.body[selectedCell],
        type: StepType.SetNumber,
        value,
      });
      setSteps(nextSteps);
      const nextValuesArr = [...currentGame.body];
      nextValuesArr[selectedCell] = value;
      const updatedValues = nextValuesArr.join('');
      setCurrentGame({ ...currentGame, body: updatedValues });
      validateBoard(updatedValues);
    }
  };
  const handleEraseClick = () => {
    setCellValue(EMPTY_CELL);
  };
  const handleToogleCamera = () => {
    setCameraMode(!cameraMode);
  };
  const handleUpdateValue = (value: string) => {
    if (value >= '0' && value <= '9' && selectedCell !== null) {
      let updatedValue = value;
      if (updatedValue === '0') updatedValue = EMPTY_CELL;
      setCellValue(updatedValue);
    }
    if (value === 'Backspace') setCellValue(EMPTY_CELL);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    handleUpdateValue(event.key);
    let outOffBoundsFactor = 0;
    if (selectedCell === null) return;
    switch (event.code) {
      case KeyboardCodes.ArrowUp:
      case KeyboardCodes.KeyW:
        if (selectedCell - SUDOKU_CELLS_IN_ROW < 0) outOffBoundsFactor = ALL_SUDOKU_CELLS;
        setSelectedCell(selectedCell + outOffBoundsFactor - SUDOKU_CELLS_IN_ROW);
        break;
      case KeyboardCodes.ArrowDown:
      case KeyboardCodes.KeyS:
        if (selectedCell + SUDOKU_CELLS_IN_ROW > ALL_SUDOKU_CELLS)
          outOffBoundsFactor = -ALL_SUDOKU_CELLS;
        setSelectedCell(selectedCell + outOffBoundsFactor + SUDOKU_CELLS_IN_ROW);
        break;
      case KeyboardCodes.ArrowRight:
      case KeyboardCodes.KeyD:
        if (selectedCell + 1 > ALL_SUDOKU_CELLS) outOffBoundsFactor = -ALL_SUDOKU_CELLS;
        setSelectedCell(selectedCell + outOffBoundsFactor + 1);
        break;
      case KeyboardCodes.ArrowLeft:
      case KeyboardCodes.KeyA:
        if (selectedCell - 1 < 0) outOffBoundsFactor = ALL_SUDOKU_CELLS;
        setSelectedCell(selectedCell + outOffBoundsFactor - 1);
        break;
      default: {
        /* empty */
      }
    }
  };
  useEventListener('keydown', handleKeyDown);
  useEffect(() => {
    initWasm();
  }, []);
  const intl = useIntl();
  const handleCreateSudoku = async () => {
    if (isSolvable) await onCreate(currentGame);
  };
  return (
    <Root>
      <Container>
        <SudokuCanvasContainer>
          <Title>
            <FormattedMessage defaultMessage="Create sudoku" />
          </Title>
          <SudokuDifficultyBar
            difficulty={currentGame.difficulty}
            onChangeGameType={handleChangeDifficulty}
          />
          {cameraMode ? (
            <SudokuCameraCreator onComplete={handleSetBody} />
          ) : (
            <SudokuCanvas
              conflicts={conflicts}
              gameStage={0}
              mission=""
              mistakes={mistakes}
              notes={[]}
              onCellSelect={setSelectedCell}
              selectedCell={selectedCell}
              values={currentGame.body}
              onAcceptedLostGame={NOOP}
              onAcceptedWonGame={NOOP}
            />
          )}
        </SudokuCanvasContainer>
        <RightPanelContainer>
          <RightPanelControlsContainer>
            <SudokuNumpadControlButton
              label={intl.formatMessage({ defaultMessage: 'Undo' })}
              onClick={handleUndoClick}
            >
              <UndoIcon />
            </SudokuNumpadControlButton>
            <SudokuNumpadControlButton
              label={intl.formatMessage({ defaultMessage: 'Erase' })}
              onClick={handleEraseClick}
            >
              <EraserIcon />
            </SudokuNumpadControlButton>
            <SudokuNumpadControlButton
              label={intl.formatMessage({ defaultMessage: 'Camera' })}
              onClick={handleToogleCamera}
              state={cameraMode}
              stateText={
                cameraMode
                  ? intl.formatMessage({ defaultMessage: 'ON' })
                  : intl.formatMessage({ defaultMessage: 'OFF' })
              }
            >
              <CameraIcon />
            </SudokuNumpadControlButton>
          </RightPanelControlsContainer>
          <StyledSudokuNumpad onButtonClick={handleUpdateValue} />
          <Button disabled={!isSolvable} onClick={handleCreateSudoku}>
            <FormattedMessage defaultMessage="Create sudoku" />
          </Button>
        </RightPanelContainer>
      </Container>
    </Root>
  );
};
