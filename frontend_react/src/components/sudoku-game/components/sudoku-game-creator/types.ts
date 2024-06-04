// eslint-disable-next-line no-shadow
export const enum StepType {
  SetNumber = 0,
  SetNote = 1,
}
export const SudokuStageOfTheGame = {
  INITIAL: 0,
  WON: 1,
  LOST: 2,
} as const;
export type ISudokuStageOfTheGame =
  (typeof SudokuStageOfTheGame)[keyof typeof SudokuStageOfTheGame];
export type ISudokuValues = string;
// 0 index based
export type INotes = number[];
/** e.g. '3.8.15...4.97....5561..8...9.4...53..5...1.49......8...3...7..67..39.2......8.7..' */
export type IMission = string;
/** XXY = XX-cell index, Y-value. e.g., '205' represents cell index 20 and value 5. */
export type IScoreHistory = string[];
export interface IStep {
  index: number;
  previous: string;
  type: StepType;
  value: string;
}
export type ICellNotes = number[];
