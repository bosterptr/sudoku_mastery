import { ALL_SUDOKU_CELLS, CANVAS_SIZE, SUDOKU_CELLS_IN_ROW } from 'app/core/constants/sudoku';
import { ICellNotes, IMission } from './types';

export const generateNotes = (): ICellNotes[] => {
  const newArray: ICellNotes[] = [];
  for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
    newArray.push([]);
  }
  return newArray;
};
export const getBlockSize = (pixelRatio: number) => (CANVAS_SIZE * pixelRatio - 2 * pixelRatio) / 3;
export const getAdjustedPixelRatio = () => {
  const { devicePixelRatio } = window;
  return devicePixelRatio > 2 ? 2 * devicePixelRatio : 4;
};
export const getCellSize = (pixelRatio: number) => (CANVAS_SIZE * pixelRatio - 4 * pixelRatio) / 9;
export const getContextSize = (pixelRatio: number) => CANVAS_SIZE * pixelRatio;
export const getOuterSize = (pixelRatio: number) => 2 * pixelRatio;
export const getThinSize = (pixelRatio: number) => 0.75 * pixelRatio;
export const getX = (index: number) => Math.floor(index / 9);
export const getY = (index: number) => index % 9;
export const getCellXPosition = (outerSize: number, cellSize: number, index: number) =>
  outerSize + cellSize * getY(index);
export const getCellYPosition = (outerSize: number, cellSize: number, index: number) =>
  outerSize + cellSize * getX(index);
export const getCubeId = (index: number) =>
  `${Math.floor(getX(index) / 3)}${Math.floor(getY(index) / 3)}`;
export const EMPTY_CELL = '.';
export const isSudokuCellEmpty = (char: string) => char === EMPTY_CELL;
export const generateArrWithTrueAtIndexes = (indexes: number[]): boolean[] => {
  const newArray: boolean[] = [];
  for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
    if (indexes.includes(cellIndex)) newArray[cellIndex] = true;
    else newArray[cellIndex] = false;
  }
  return newArray;
};
export const getScoreFromMove = (values: IMission, solution: string, selectedCell: number) => {
  let fullRows = 0;
  let fullColumns = 0;
  let fullCubes = 0;
  for (let cellIndex = 0; cellIndex < ALL_SUDOKU_CELLS; cellIndex += 1) {
    if (values[cellIndex] === solution[cellIndex]) {
      if (getY(cellIndex) === getY(selectedCell)) fullRows += 1;
      if (getX(cellIndex) === getX(selectedCell)) fullColumns += 1;
      if (getCubeId(cellIndex) === getCubeId(selectedCell)) fullCubes += 1;
    }
  }
  let score = 1;
  if (fullRows === SUDOKU_CELLS_IN_ROW) score += 5;
  if (fullColumns === SUDOKU_CELLS_IN_ROW) score += 5;
  if (fullCubes === 9) score += 5;
  return score;
};
