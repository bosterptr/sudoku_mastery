import { ISudoku } from 'app/components/sudoku-game/types';
import styled from 'styled-components';
import { SudokuPreview } from './SudokuPreview';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 50px 50px;
  justify-content: center;
`;

export const SudokuList = ({ sudokus }: { sudokus: ISudoku[] }) => {
  return (
    <Root>
      {sudokus.map((sudoku) => (
        <SudokuPreview sudoku={sudoku} key={sudoku.id} />
      ))}
    </Root>
  );
};
