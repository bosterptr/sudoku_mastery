import { getSudokuList } from 'app/core/api/sudoku';
import { Page } from 'app/features/page';
import { useLoaderData } from 'react-router-dom';
import { SudokuList } from './components/SudokuList';

export const SudokuListPage = () => {
  const sudokuList = useLoaderData() as Awaited<ReturnType<typeof sudokuListLoader>>;
  return (
    <Page>
      <SudokuList sudokus={sudokuList.items} />
    </Page>
  );
};

export const sudokuListLoader = async () => {
  const result = await getSudokuList({ page: 0, pageSize: 10 });
  return result.data;
};
