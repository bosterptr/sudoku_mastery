use crate::database::DBPool;
use crate::models::sudoku::{CreateSudokuRequest, Sudoku, UpdateSudokuRequest};
use crate::routes::sudoku::errors::SudokuError;
use actix_web::Result;
use uuid::Uuid;

pub async fn create(
    pool: &DBPool,
    item: &CreateSudokuRequest,
    user_id: &Uuid,
) -> Result<Sudoku, SudokuError> {
    println!("{item:?} {user_id}");
    match item.validate() {
        Ok(()) => match Sudoku::create(pool, item, user_id).await {
            Ok(sudoku) => Ok(sudoku),
            Err(err) => {
                println!("{err}");
                Err(SudokuError::CouldNotCreate)
            }
        },
        Err(err) => Err(err),
    }
}

pub async fn update(
    pool: &DBPool,
    param_id: &Uuid,
    item: &UpdateSudokuRequest,
    user_id: &Uuid,
) -> Result<Sudoku, SudokuError> {
    match item.validate() {
        Ok(()) => match Sudoku::update(pool, param_id, item, user_id).await {
            Ok(sudoku) => Ok(sudoku),
            Err(err) => {
                println!("{err}");
                Err(SudokuError::CouldNotCreate)
            }
        },
        Err(err) => Err(err),
    }
}
