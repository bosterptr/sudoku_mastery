import { ISudoku } from 'app/components/sudoku-game/types';
import { AxiosResponse } from 'axios';
import lazyAxios from './agent';

const URL = 'sudoku/';

export const getSudokuList = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<AxiosResponse<PaginatedSudoku>> =>
  (await lazyAxios().getAgent()).get(`${URL}?page=${page}&page_size=${pageSize}`);
export const getSudokuById = async (id: ISudoku['id']): Promise<AxiosResponse<ISudoku | null>> =>
  (await lazyAxios().getAgent()).get(`${URL}${id}`);
export const createSudoku = async (sudoku: CreateSudokuRequest): Promise<AxiosResponse<ISudoku>> =>
  (await lazyAxios().getAgent()).post(URL, sudoku);
export const updateSudoku = async ({
  id,
  ...rest
}: UpdateSudokuRequest & Pick<ISudoku, 'id'>): Promise<AxiosResponse<ISudoku>> =>
  (await lazyAxios().getAgent()).put(`${URL}${id}`, rest);
export const deleteSudoku = async ({
  id,
}: Pick<ISudoku, 'id'>): Promise<AxiosResponse<Record<string, never>>> =>
  (await lazyAxios().getAgent()).delete(`${URL}${id}`);
export const getRandomSudoku = async ({
  difficulty,
}: GetRandomSudokuParams): Promise<AxiosResponse<ISudoku | null>> =>
  (await lazyAxios().getAgent()).get(`${URL}random/${difficulty}`);
