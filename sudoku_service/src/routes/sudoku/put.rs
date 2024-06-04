use crate::controllers;
use crate::database::DBPool;
use crate::middleware::jwt_auth;
use crate::models::sudoku::UpdateSudokuRequest;
use actix_web::{
    put,
    web::{Data, Json, Path},
    HttpResponse, Result,
};
use uuid::Uuid;

#[utoipa::path(
    context_path = "/api/sudoku",
    responses(
        (status = 201, body=Sudoku),
        (status = 401, body=AuthError),
        (status = 500, body=SudokuError),
    ),
    tag = "Sudokus"
)]
#[put("/{id}")]
pub async fn update(
    pool: Data<DBPool>,
    item_id: Path<Uuid>,
    item: Json<UpdateSudokuRequest>,
    auth: jwt_auth::JwtMiddleware,
) -> Result<HttpResponse> {
    match controllers::sudoku::update(&pool, &item_id.into_inner(), &item, &auth.user_id).await {
        Ok(sudoku) => Ok(HttpResponse::Ok().json(sudoku)),
        Err(error) => Ok(error.to_http_response()),
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test};

    use crate::{
        models::sudoku::{CreateSudokuRequest, Difficulty, Sudoku, UpdateSudokuRequest},
        routes::sudoku::errors::SudokuError,
        test_utils::setup_test_app,
    };

    #[actix_web::test]
    async fn test_index_put_works() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;

        let request_data = UpdateSudokuRequest {
            body:
                "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
                    .to_string(),
            difficulty: Difficulty::Easy,
        };
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::put()
            .uri(&format!("/api/sudoku/{}", created_sudoku.id.to_string()))
            .set_json(request_data.clone())
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body: Sudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::OK);
        assert_eq!(body.body, request_data.body.clone());
        assert_eq!(body.difficulty, request_data.difficulty.clone());
        let sudoku_in_db = Sudoku::get_by_id(&db.pool, &created_sudoku.id)
            .await
            .unwrap();
        assert_eq!(sudoku_in_db.body, request_data.body);
        assert_eq!(sudoku_in_db.difficulty, request_data.difficulty);
    }
    #[actix_web::test]
    async fn test_index_put_wrong_body() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        let request_data = UpdateSudokuRequest {
            body: "4.....8.5.3..........7......2......".to_string(),
            difficulty: Difficulty::Easy,
        };
        let created_sudoku = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::put()
            .uri(&format!("/api/sudoku/{}", created_sudoku.id.to_string()))
            .set_json(request_data.clone())
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::BAD_REQUEST);
        let body = test::read_body(res).await;
        assert_eq!(
            SudokuError::BodyDoesNotHave81Characters.to_http_message_body(),
            body,
        );
        let sudoku_in_db_ = Sudoku::get_by_id(&db.pool, &created_sudoku.id)
            .await
            .unwrap();
        assert_ne!(sudoku_in_db_.body, request_data.body);
        assert_ne!(sudoku_in_db_.difficulty, request_data.difficulty);
    }
}
