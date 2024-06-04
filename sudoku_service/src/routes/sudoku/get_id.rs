use crate::database::DBPool;
use crate::models::sudoku::Sudoku;
use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse,
};
use uuid::Uuid;

#[utoipa::path(
    context_path = "/api/sudoku",
    responses(
        (status = 200, body=Sudoku),
        (status = 404),
        (status = 500, body=SudokuError),
    ),
    tag = "Sudokus"
)]
#[get("/{id}")]
async fn get_by_sudoku_id(pool: Data<DBPool>, item_id: Path<Uuid>) -> HttpResponse {
    match Sudoku::get_by_id(&pool, &item_id).await {
        Ok(sudoku) => HttpResponse::Ok().json(sudoku),
        Err(err) => HttpResponse::NotFound().body(err.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test};

    use crate::{
        models::sudoku::{CreateSudokuRequest, Difficulty},
        test_utils::setup_test_app,
    };

    use super::*;

    #[actix_web::test]
    async fn test_index_get_id() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::get()
            .uri(&format!("/api/sudoku/{}", created_sudoku.id.to_string()))
            .append_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body: Sudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::OK);
        assert!(body == created_sudoku, "unexpected body: {body:?}",);
    }
    #[actix_web::test]
    async fn test_index_get_id_wrong_id() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::get()
            .uri(&format!("/api/sudoku/wrong_id"))
            .append_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body = test::read_body(res).await;
        assert_eq!(status, StatusCode::NOT_FOUND);
        assert!(
            body.starts_with(b"UUID parsing failed"),
            "unexpected body: {body:?}",
        );
    }
}
