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
  items: Array<ISudoku>;
  total_items: number;
  /** 0-based index */
  page: number;
  page_size: number;
  num_pages: number;
}

type Difficulty = 'easy' | 'normal' | 'hard' | 'extreme';

interface ISudoku {
  id: string;
  body: string;
  difficulty: Difficulty;
  created_at: string;
  updated_at: string;
  user_id: string;
}
