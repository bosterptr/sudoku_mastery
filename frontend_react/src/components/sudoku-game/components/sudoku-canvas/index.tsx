/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useResizeObserver } from 'app/common/hooks/use-resize-observer';
import {
  ALL_SUDOKU_CELLS,
  BOARD_NUMBERS,
  CANVAS_SIZE,
  MAGIC_NUMBER_TO_SCALE_NUMBERS_PROPERLY,
} from 'app/core/constants/sudoku';
import { alpha, lighten } from 'app/core/themes/colorManipulator';
import { MouseEventHandler, useCallback, useEffect, useRef } from 'react';
import styled, { css, useTheme } from 'styled-components';
import { INotes, ISudokuStageOfTheGame, ISudokuValues, SudokuStageOfTheGame } from '../../types';
import {
  getAdjustedPixelRatio,
  getBlockSize,
  getCellSize,
  getCellXPosition,
  getCellYPosition,
  getContextSize,
  getCubeId,
  getOuterSize,
  getThinSize,
  getX,
  getY,
  isSudokuCellEmpty,
} from '../../utils';
import { SudokuGameOver } from '../sudoku-lost';
import { SudokuWonScreen } from '../sudoku-won';

export interface IPublicProps {
  conflicts: boolean[];
  gameStage: ISudokuStageOfTheGame;
  mission: string;
  mistakes: boolean[];
  notes: INotes[];
  onAcceptedLostGame: () => void;
  onAcceptedWonGame: () => void;
  onCellSelect: (cellIndex: number) => void;
  renderPreview?: (dataUrl: string) => void;
  selectedCell: number | null;
  values: ISudokuValues;
}
type Props = IPublicProps;

const SubContainer = styled.div``;

const Container = styled.div<{ $renderPreview: boolean }>`
  position: relative;
  width: 100%;
  flex-basis: 60%;
  min-width: 250px;
  max-width: 500px;
  ${(p) =>
    p.$renderPreview &&
    css`
      display: none;
    `};
`;

const Canvas = styled.canvas`
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
`;

const SudokuCanvas = ({
  conflicts,
  gameStage,
  mission,
  mistakes,
  notes,
  onAcceptedLostGame,
  onAcceptedWonGame,
  onCellSelect,
  renderPreview,
  selectedCell,
  values,
}: Props) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const clearCanvas = useCallback(() => {
    if (!context.current || !wrapperRef.current) throw new Error('');
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    const contextSize = getContextSize(adjustedPixelRatio);
    context.current.clearRect(0, 0, contextSize, contextSize);
    context.current.fillStyle = theme.palette.background.primary;
    context.current.fillRect(0, 0, contextSize, contextSize);
  }, [renderPreview, theme.palette.background.primary]);
  const handleClickCanvas: MouseEventHandler<HTMLDivElement> = ({ clientX, clientY }) => {
    if (!wrapperRef.current) throw new Error('');
    const { left, top } = wrapperRef.current.getBoundingClientRect();
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    const sudokuRectangleSize = (wrapperRef.current.clientWidth * adjustedPixelRatio) / 9;
    const x = adjustedPixelRatio * (clientX - left);
    const y = adjustedPixelRatio * (clientY - top);
    const index =
      Math.floor(Math.abs(x) / sudokuRectangleSize) +
      9 * Math.floor(Math.abs(y) / sudokuRectangleSize);
    onCellSelect(index);
  };
  const drawGrid = useCallback(() => {
    if (!context.current || !wrapperRef.current) throw new Error('');
    const contextCurrent = context.current;
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    const thinSize = getThinSize(adjustedPixelRatio);
    const outerSize = getOuterSize(adjustedPixelRatio);
    const cellSize = getCellSize(adjustedPixelRatio);
    const blockSize = getBlockSize(adjustedPixelRatio);
    contextCurrent.strokeStyle = theme.palette.border.medium;
    contextCurrent.lineWidth = thinSize;
    for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
      contextCurrent.strokeRect(
        getCellXPosition(outerSize, cellSize, cellIndex),
        getCellYPosition(outerSize, cellSize, cellIndex),
        cellSize,
        cellSize,
      );
    }
    contextCurrent.strokeStyle = theme.palette.secondary.main;
    contextCurrent.lineWidth = outerSize;
    for (let x = 0; x < 3; x += 1)
      for (let y = 0; y < 3; y += 1)
        contextCurrent.strokeRect(
          outerSize / 2 + blockSize * x,
          outerSize / 2 + blockSize * y,
          blockSize,
          blockSize,
        );
  }, [renderPreview, theme.palette.border.medium, theme.palette.secondary.main]);
  const drawSelectedCell = useCallback(() => {
    if (!context.current) throw new Error('');
    const contextCurrent = context.current;
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    const cellSize = getCellSize(adjustedPixelRatio);
    const outerSize = getOuterSize(adjustedPixelRatio);
    contextCurrent.save();
    for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
      if (
        selectedCell !== null &&
        cellIndex !== selectedCell &&
        !(
          getCubeId(selectedCell) !== getCubeId(cellIndex) &&
          // isTheSameLargerCube(selectedCell, cellIndex) &&
          getX(selectedCell) !== getX(cellIndex) &&
          getY(selectedCell) !== getY(cellIndex)
        )
      ) {
        contextCurrent.fillStyle = lighten(theme.palette.primary.dark, 0.9);
        contextCurrent.fillRect(
          getCellXPosition(outerSize, cellSize, cellIndex),
          getCellYPosition(outerSize, cellSize, cellIndex),
          cellSize,
          cellSize,
        );
      }
      if (
        selectedCell !== null &&
        !isSudokuCellEmpty(values[selectedCell]) &&
        values[selectedCell] === values[cellIndex]
      ) {
        contextCurrent.fillStyle = lighten(theme.palette.primary.dark, 0.8);
        contextCurrent.fillRect(
          getCellXPosition(outerSize, cellSize, cellIndex),
          getCellYPosition(outerSize, cellSize, cellIndex),
          cellSize,
          cellSize,
        );
      }
      if (conflicts[cellIndex]) {
        contextCurrent.fillStyle = alpha(theme.palette.errors.main, 0.2);
        contextCurrent.fillRect(
          getCellXPosition(outerSize, cellSize, cellIndex),
          getCellYPosition(outerSize, cellSize, cellIndex),
          cellSize,
          cellSize,
        );
      }
    }
    if (selectedCell !== null) {
      contextCurrent.fillStyle = alpha(theme.palette.primary.main, 0.3);
      contextCurrent.fillRect(
        getCellXPosition(outerSize, cellSize, selectedCell),
        getCellYPosition(outerSize, cellSize, selectedCell),
        cellSize,
        cellSize,
      );
      contextCurrent.restore();
    }
  }, [
    conflicts,
    renderPreview,
    selectedCell,
    theme.palette.errors.main,
    theme.palette.primary.dark,
    theme.palette.primary.main,
    values,
  ]);
  const drawBoardNumbers = useCallback(() => {
    if (!context.current || !wrapperRef.current) throw new Error('');
    const contextCurrent = context.current;
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    const cellSize = getCellSize(adjustedPixelRatio);
    const outerSize = getOuterSize(adjustedPixelRatio);
    const scaledValue = (2 * cellSize) / MAGIC_NUMBER_TO_SCALE_NUMBERS_PROPERLY;
    for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
      if (!isSudokuCellEmpty(values[cellIndex])) {
        contextCurrent.save();
        contextCurrent.scale(1, 1);
        contextCurrent.fillStyle = isSudokuCellEmpty(mission[cellIndex])
          ? theme.palette.primary.main
          : theme.palette.text.primary;
        isSudokuCellEmpty(mission[cellIndex]) &&
          mistakes[cellIndex] &&
          (contextCurrent.fillStyle = theme.palette.errors.main);
        contextCurrent.scale(scaledValue, scaledValue);
        contextCurrent.translate(
          getCellXPosition(outerSize, cellSize, cellIndex) / scaledValue,
          getCellYPosition(outerSize, cellSize, cellIndex) / scaledValue,
        );
        contextCurrent.fill(new Path2D(BOARD_NUMBERS[parseInt(values[cellIndex], 10) - 1]));
        contextCurrent.restore();
      }
    }
  }, [
    mission,
    mistakes,
    renderPreview,
    theme.palette.errors.main,
    theme.palette.primary.main,
    theme.palette.text.primary,
    values,
  ]);
  const drawBoardNotes = useCallback(() => {
    if (!context.current || !wrapperRef.current) throw new Error('');
    const contextCurrent = context.current;
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    if (notes && notes.length) {
      contextCurrent.save();
      for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
        for (const noteNumber of notes[cellIndex]) {
          contextCurrent.save();
          contextCurrent.scale(1, 1);
          contextCurrent.fillStyle = theme.palette.action.disabledText;
          const noteScalingFactor = 0.75;
          const baseSizeUnit = 1;
          // const positionAdjustmentFactor = 0.7;
          const cellSize = getCellSize(adjustedPixelRatio);
          const outerSize = getOuterSize(adjustedPixelRatio);
          const scaledValue = cellSize * ((2 * noteScalingFactor) / 200);
          const v = cellSize * baseSizeUnit;
          contextCurrent.scale(scaledValue, scaledValue);
          // contextCurrent.translate(
          //   ((getCellSize(adjustedPixelRatio) - v) / scaledValue) * positionAdjustmentFactor,
          //   ((getCellSize(adjustedPixelRatio) - v) / scaledValue) * positionAdjustmentFactor,
          // );
          contextCurrent.translate(
            getCellXPosition(outerSize, cellSize, cellIndex) / scaledValue +
              ((noteNumber - 1) % 3) * (v / 3 / scaledValue),
            getCellYPosition(outerSize, cellSize, cellIndex) / scaledValue +
              Math.floor((noteNumber - 1) / 3) * (v / 3 / scaledValue),
          );
          contextCurrent.fill(new Path2D(BOARD_NUMBERS[noteNumber - 1]));
          contextCurrent.restore();
        }
      }
    }
  }, [notes, renderPreview, theme.palette.action.disabledText]);
  const paintBoard = useCallback(() => {
    clearCanvas();
    drawSelectedCell();
    drawGrid();
    drawBoardNumbers();
    drawBoardNotes();
  }, [clearCanvas, drawBoardNotes, drawBoardNumbers, drawGrid, drawSelectedCell]);
  const generateCanvas = useCallback(() => {
    if (!canvasRef.current || !wrapperRef.current) throw new Error('');
    const { clientWidth } = wrapperRef.current;
    let adjustedPixelRatio = getAdjustedPixelRatio();
    if (renderPreview) adjustedPixelRatio = 1;
    canvasRef.current.width = CANVAS_SIZE * adjustedPixelRatio;
    canvasRef.current.height = CANVAS_SIZE * adjustedPixelRatio;
    canvasRef.current.style.width = `${clientWidth}px`;
    canvasRef.current.style.height = `${clientWidth}px`;
    context.current = canvasRef.current.getContext('2d', { alpha: false });
    clearCanvas();
    drawGrid();
  }, [clearCanvas, drawGrid, renderPreview]);
  useEffect(() => {
    generateCanvas();
    paintBoard();
    if (renderPreview && canvasRef.current) {
      renderPreview(canvasRef.current.toDataURL());
    }
  });
  const handleResize = useCallback(() => {
    generateCanvas();
    paintBoard();
  }, [generateCanvas, paintBoard]);
  useResizeObserver(wrapperRef, handleResize, 30);

  return (
    <Container onClick={handleClickCanvas} $renderPreview={Boolean(renderPreview)}>
      <SudokuGameOver
        gameOver={gameStage === SudokuStageOfTheGame.LOST}
        onAcceptedLostGame={onAcceptedLostGame}
      />
      <SudokuWonScreen
        won={gameStage === SudokuStageOfTheGame.WON}
        onAcceptedWonGame={onAcceptedWonGame}
      />
      <SubContainer ref={wrapperRef}>
        <Canvas ref={canvasRef} data-testid="sudoku-canvas" />
      </SubContainer>
    </Container>
  );
};

export default SudokuCanvas;
