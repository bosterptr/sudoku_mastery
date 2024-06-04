use crate::models::sudoku::Sudoku;
use crate::{database::DBPool, models::sudoku::GetRandomSudokuParams};
use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse,
};

#[utoipa::path(
    context_path = "/api/sudoku/",
    responses(
        (status = 200, description = "Get random sudoku", body=Sudoku),
        (status = 500),
    ),
    tag = "Sudokus"
)]
#[get("/random/{difficulty}")]
pub async fn get_random_sudoku(
    pool: Data<DBPool>,
    path: Path<GetRandomSudokuParams>,
) -> HttpResponse {
    match Sudoku::get_random_with_difficulty(&pool, &path.difficulty).await {
        Ok(sudoku) => HttpResponse::Ok().json(sudoku),
        Err(err) => HttpResponse::NotFound().body(err.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::sudoku::{CreateSudokuRequest, Difficulty};
    use crate::test_utils::setup_test_app;
    use actix_web::{http::StatusCode, test};

    #[actix_web::test]
    async fn test_index_get_works() {
        // Arrange
        let (srv, db, user_id, _auth_header) = setup_test_app().await;
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Normal },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::get()
            .uri(&format!(
                "/api/sudoku/random/{}",
                Difficulty::Normal.to_string()
            ))
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body: Sudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::OK);
        assert!(body == created_sudoku, "unexpected body: {body:?}",);
    }
}
