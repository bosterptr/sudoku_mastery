CREATE TYPE sudoku_difficulty AS ENUM('easy', 'normal', 'hard', 'extreme');
CREATE TABLE sudokus (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  body TEXT NOT NULL,
  difficulty sudoku_difficulty NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (id)
);
CREATE INDEX idx_sudoku_user_id ON sudokus (user_id);