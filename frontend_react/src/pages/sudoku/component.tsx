import { SudokuGame } from 'app/components/sudoku-game';
import { ISudoku, SudokuDifficulty } from 'app/components/sudoku-game/types';
import { getRandomSudoku, getSudokuById } from 'app/core/api/sudoku';
import { Page } from 'app/features/page';
import { PATH_SUDOKU_LIST } from 'app/pages/paths';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLoaderData, useNavigate } from 'react-router-dom';

export const SudokuPage = () => {
  const [game, setGame] = useState(useLoaderData() as Awaited<ReturnType<typeof sudokuLoader>>);
  const [, setDifficulty] = useState<ISudoku['difficulty']>(SudokuDifficulty.Medium);
  const navigate = useNavigate();
  const handleAcceptedLostGame = () => navigate(PATH_SUDOKU_LIST);
  const handleAcceptedWonGame = () => navigate(PATH_SUDOKU_LIST);
  const handleChangeDifficulty = async (changedDifficulty: ISudoku['difficulty']) => {
    setDifficulty(changedDifficulty);
    const sudoku = await getRandomSudoku({ difficulty: changedDifficulty });
    if (sudoku.data) {
      setGame(sudoku.data);
      navigate(`/mission/${sudoku.data.id}`);
    }
  };
  if (!game) return <FormattedMessage defaultMessage="Please create new sudoku missions" />;
  return (
    <Page>
      <SudokuGame
        game={game}
        onAcceptedLostGame={handleAcceptedLostGame}
        onAcceptedWonGame={handleAcceptedWonGame}
        onChangeGameType={handleChangeDifficulty}
        onLose={() => {}}
        onWin={() => {}}
      />
    </Page>
  );
};

export const sudokuLoader = async ({ params }: { params: { id: string } }) => {
  const result = await getSudokuById(params.id);
  return result.data;
};
