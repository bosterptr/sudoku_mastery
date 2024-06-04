/* This file is generated and managed by tsync */

interface IdParam {
  id: string;
}

interface MessageResponse<T> {
  message: T;
}

interface PaginationParams {
  page?: number;
  page_size?: number;
}

interface CreateSudokuRequest {
  body: string;
  difficulty: Difficulty;
}

interface UpdateSudokuRequest {
  body: string;
  difficulty: Difficulty;
}

interface GetRandomSudokuParams {
  difficulty: Difficulty;
}

interface PaginatedSudoku {
  items: Array<Sudoku>;
  total_items: number;
  /** 0-based index */
  page: number;
  page_size: number;
  num_pages: number;
}

type Difficulty =
  | "easy" | "normal" | "hard" | "extreme";

interface Sudoku {
  id: string;
  body: string;
  difficulty: Difficulty;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}
