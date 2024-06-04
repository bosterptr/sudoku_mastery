import { useEventListener } from 'app/common/hooks/use-event-listener';
import useTimer from 'app/common/hooks/use-timer';
import { EraserIcon } from 'app/common/icons/Eraser';
import { PencilIcon } from 'app/common/icons/Pencil';
import { UndoIcon } from 'app/common/icons/Undo';
import { ALL_SUDOKU_CELLS, SUDOKU_CELLS_IN_ROW } from 'app/core/constants/sudoku';
import { assertUnreachable } from 'app/utils/assertUnreachable';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import initWasm, { solve } from 'sudoku_wasm';
import SudokuCanvas from './components/sudoku-canvas';
import { SudokuHeader } from './components/sudoku-header';
import { SudokuNumpad } from './components/sudoku-numpad';
import { SudokuNumpadButton } from './components/sudoku-numpad-button';
import { SudokuNumpadControlButton } from './components/sudoku-numpad-control-button';
import {
  ICellNotes,
  IScoreHistory,
  IStep,
  ISudoku,
  ISudokuStageOfTheGame,
  StepType,
  SudokuStageOfTheGame,
} from './types';
import {
  EMPTY_CELL,
  generateNotes,
  getCubeId,
  getScoreFromMove,
  getX,
  getY,
  isSudokuCellEmpty,
} from './utils';

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
const Root = styled.div`
  flex-direction: column;
  display: flex;
  position: relative;
  margin: 0 auto;
`;

export interface IPublicProps {
  game: ISudoku;
  onLose: (seconds: number) => void;
  onWin: (seconds: number, score: number) => void;
  onAcceptedLostGame: () => void;
  onAcceptedWonGame: () => void;
  onChangeGameType: (difficulty: ISudoku['difficulty']) => void;
}

export const SudokuGame = ({
  game,
  onLose,
  onWin,
  onAcceptedLostGame,
  onAcceptedWonGame,
  onChangeGameType,
}: IPublicProps) => {
  const { seconds, reset, start } = useTimer(true);
  const [conflicts, setConflicts] = useState<boolean[]>([]);
  const [currentGame, setCurrentGame] = useState<ISudoku>(game);
  const [doneMistakes, setDoneMistakes] = useState<number>(0);
  const [editingNotes, setEditingNotes] = useState<boolean>(false);
  const [stageOfTheGame, setStateOfTheGame] = useState<ISudokuStageOfTheGame>(
    SudokuStageOfTheGame.INITIAL,
  );
  const [mistakes, setMistakes] = useState<boolean[]>([]);
  const [notes, setNotes] = useState<ICellNotes[]>(generateNotes());
  const [score, setScore] = useState<number>(0);
  const [scoreHistory, setScoreHistory] = useState<IScoreHistory>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [steps, setSteps] = useState<IStep[]>([]);
  const [values, setValues] = useState<ISudoku['body']>(game.body);
  const lastSolvable = useRef<string>(game.body);
  useEffect(() => {
    reset();
    start();
    setCurrentGame(game);
    setDoneMistakes(0);
    setEditingNotes(false);
    setMistakes([]);
    setNotes(generateNotes());
    setScore(0);
    setScoreHistory([]);
    setSelectedCell(null);
    setStateOfTheGame(SudokuStageOfTheGame.INITIAL);
    setSteps([]);
    setValues(game.body);
    lastSolvable.current = game.body;
  }, [game, reset, start]);
  const validateBoard = (valuesToValidate: string) => {
    if (stageOfTheGame !== SudokuStageOfTheGame.INITIAL) return;
    if (selectedCell === null) return;
    const updatedConflicts: boolean[] = Array(ALL_SUDOKU_CELLS).fill(false);
    const updatedMistakes: boolean[] = Array(ALL_SUDOKU_CELLS).fill(false);
    let mistakeWasMade = false;
    let solution = solve(valuesToValidate);
    console.log(solution);
    if (solution === '') {
      solution = solve(lastSolvable.current);
    }
    lastSolvable.current = valuesToValidate;
    for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
      if (valuesToValidate[cellIndex] !== EMPTY_CELL) {
        if (valuesToValidate[cellIndex] !== solution[cellIndex]) {
          updatedMistakes[cellIndex] = true;
          mistakeWasMade = true;
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
            mistakeWasMade = true;
            updatedConflicts[cellIndex] = true;
          }
        }
      }
    }
    lastSolvable.current = solution;
    setConflicts(updatedConflicts);
    setMistakes(updatedMistakes);
    if (doneMistakes === 3) {
      setStateOfTheGame(SudokuStageOfTheGame.LOST);
      onLose(seconds);
    }
    let newScore: number = score;
    if (mistakeWasMade) setDoneMistakes(doneMistakes + 1);
    else {
      const scoreHistoryElement = `${selectedCell}${valuesToValidate[selectedCell]}`;
      if (!scoreHistory.includes(scoreHistoryElement)) {
        const gainedScore = getScoreFromMove(valuesToValidate, solution, selectedCell);
        newScore = score + gainedScore;
        setScore(score + gainedScore);
        const nextScoreHistory = [...scoreHistory];
        nextScoreHistory.push(scoreHistoryElement);
        setScoreHistory(nextScoreHistory);
      }
    }
    if (solution === valuesToValidate) {
      setStateOfTheGame(SudokuStageOfTheGame.WON);
      onWin(seconds, newScore);
    }
  };

  const handleUndoClick = () => {
    if (stageOfTheGame !== SudokuStageOfTheGame.INITIAL) return;
    if (steps.length !== 0) {
      const step = steps[steps.length - 1];
      switch (step.type) {
        case StepType.SetNumber: {
          const nextSteps = [...steps];
          const nextValuesArr = [...values];
          nextValuesArr[step.index] = step.previous;
          const updatedValues = nextValuesArr.join('');
          setValues(updatedValues);
          nextSteps.pop();
          setSteps(nextSteps);
          validateBoard(updatedValues);
          break;
        }
        case StepType.SetNote: {
          const nextValuesArr = [...values];
          nextValuesArr[step.index] = step.previous;
          setValues(nextValuesArr.join(''));
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
    if (stageOfTheGame !== SudokuStageOfTheGame.INITIAL) return;
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
        previous: values[selectedCell],
        type: StepType.SetNumber,
        value,
      });
      setSteps(nextSteps);
      const nextValuesArr = [...values];
      nextValuesArr[selectedCell] = value;
      const updatedValues = nextValuesArr.join('');
      setValues(updatedValues);
      validateBoard(updatedValues);
    }
  };
  const handleEraseClick = () => {
    setCellValue(EMPTY_CELL);
  };
  const handleUpdateValue = (value: string) => {
    if (stageOfTheGame !== SudokuStageOfTheGame.INITIAL) return;
    if (
      value >= '0' &&
      value <= '9' &&
      selectedCell !== null &&
      isSudokuCellEmpty(currentGame.body[selectedCell])
    ) {
      const parsedKey = parseInt(value, 10);
      if (editingNotes) {
        const nextNotes = [...notes];
        let cellNotes = nextNotes[selectedCell];
        if (cellNotes.includes(parsedKey)) {
          cellNotes = cellNotes.filter((item) => item !== parsedKey);
        } else {
          cellNotes.push(parsedKey);
        }
        nextNotes[selectedCell] = cellNotes;
        setNotes(nextNotes);
      } else {
        let updatedValue = value;
        if (updatedValue === '0') updatedValue = EMPTY_CELL;
        setCellValue(updatedValue);
      }
    }
    if (value === 'Backspace') setCellValue(EMPTY_CELL);
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (stageOfTheGame !== SudokuStageOfTheGame.INITIAL) return;
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
  return (
    <Root>
      <SudokuHeader
        mistakes={doneMistakes}
        score={score}
        difficulty={game.difficulty}
        onChangeGameType={onChangeGameType}
        seconds={seconds}
      />
      <Container>
        <SudokuCanvas
          conflicts={conflicts}
          gameStage={stageOfTheGame}
          mission={game.body}
          mistakes={mistakes}
          notes={notes}
          onCellSelect={setSelectedCell}
          selectedCell={selectedCell}
          values={values}
          onAcceptedLostGame={onAcceptedLostGame}
          onAcceptedWonGame={onAcceptedWonGame}
        />
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
              label={intl.formatMessage({ defaultMessage: 'Notes' })}
              onClick={() => setEditingNotes(!editingNotes)}
              state={editingNotes}
              stateText={
                editingNotes
                  ? intl.formatMessage({ defaultMessage: 'ON' })
                  : intl.formatMessage({ defaultMessage: 'OFF' })
              }
            >
              <PencilIcon />
            </SudokuNumpadControlButton>
          </RightPanelControlsContainer>
          <StyledSudokuNumpad onButtonClick={handleUpdateValue} />
        </RightPanelContainer>
      </Container>
    </Root>
  );
};
