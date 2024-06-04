use super::{
    __path_create, __path_get_by_sudoku_id, __path_get_random_sudoku, __path_get_sudokus,
    __path_remove, __path_update, errors::SudokuError,
};
use crate::{
    auth::{AuthError, JwtSecurityAddon},
    models::{
        api::PaginationParams,
        sudoku::{CreateSudokuRequest, Difficulty, PaginatedSudoku, Sudoku, UpdateSudokuRequest},
    },
};

#[derive(utoipa::OpenApi)]
#[openapi(
    paths(get_sudokus,get_by_sudoku_id,create,update,remove,get_random_sudoku),
    components(
        schemas(PaginationParams, PaginatedSudoku, Sudoku, Difficulty,SudokuError,UpdateSudokuRequest,CreateSudokuRequest,AuthError)
    ),
    tags(
        (name = "Sudokus", description = "Sudoku management endpoints"),
    ),
    modifiers(&JwtSecurityAddon),
    security(
       ("BearerToken" = []),
  ),
)]
pub struct ApiDoc;
