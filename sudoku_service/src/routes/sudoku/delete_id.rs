use crate::database::DBPool;
use crate::middleware::jwt_auth;
use crate::models::sudoku::Sudoku;
use actix_web::{
    delete,
    web::{Data, Path},
    HttpResponse,
};
use uuid::Uuid;

#[utoipa::path(
    context_path = "/api/sudoku",
    responses(
        (status = 200),
        (status = 401, body=AuthError),
        (status = 500, body=SudokuError),
    ),
    tag = "Sudokus"
)]
#[delete("/{id}")]
async fn remove(
    pool: Data<DBPool>,
    item_id: Path<Uuid>,
    auth: jwt_auth::JwtMiddleware,
) -> HttpResponse {
    match Sudoku::delete(&pool, &item_id, &auth.user_id).await {
        Ok(_) => HttpResponse::NoContent().finish(),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test};

    use crate::{
        models::sudoku::{CreateSudokuRequest, Difficulty, Sudoku},
        test_utils::setup_test_app,
    };

    #[actix_web::test]
    async fn test_index_delete_works() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::delete()
            .uri(&format!("/api/sudoku/{}", created_sudoku.id.to_string()))
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::NO_CONTENT);
        let _sudoku_in_db = Sudoku::get_by_id(&db.pool, &created_sudoku.id)
            .await
            .unwrap();
    }
    #[actix_web::test]
    async fn test_index_put_wrong_id() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::delete()
            .uri(&format!("/api/sudoku/{}", created_sudoku.id.to_string()))
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::BAD_REQUEST);
        let _sudoku_in_db = Sudoku::get_by_id(&db.pool, &created_sudoku.id)
            .await
            .unwrap();
    }
}
