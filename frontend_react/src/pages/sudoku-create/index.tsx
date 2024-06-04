import { SudokuGameCreator } from 'app/components/sudoku-game/components/sudoku-game-creator';
import { createSudoku } from 'app/core/api/sudoku';
import { Page } from 'app/features/page';
import { useNavigate } from 'react-router-dom';

export const SudokuCreatePage = () => {
  const navigate = useNavigate();
  const handleCreateSudoku = async (data: {
    body: ISudoku['body'];
    difficulty: ISudoku['difficulty'];
  }) => {
    const createdSudokuData = await createSudoku(data);
    navigate(`/mission/${createdSudokuData.data.id}`);
  };
  return (
    <Page>
      <SudokuGameCreator onCreate={handleCreateSudoku} />
    </Page>
  );
};
