use crate::database::DBPool;
use crate::models::sudoku::CreateSudokuRequest;
use crate::{controllers, middleware::jwt_auth};
use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse,
};

#[utoipa::path(
    context_path = "/api/sudoku",
    request_body(content = CreateSudokuRequest, content_type = "application/json"),
    responses(
        (status = 201, body=Sudoku),
        (status = 400, body=SudokuError),
        (status = 401, body=AuthError),
        (status = 500, body=SudokuError),
        (status = 500),
    ),
    tag = "Sudokus"
)]
#[post("/")]
async fn create(
    pool: Data<DBPool>,
    Json(item): Json<CreateSudokuRequest>,
    auth: jwt_auth::JwtMiddleware,
) -> HttpResponse {
    match controllers::sudoku::create(&pool, &item, &auth.user_id).await {
        Ok(sudoku) => {
            println!("{sudoku:#?}");
            HttpResponse::Created().json(sudoku)
        }
        Err(err) => err.to_http_response(),
    }
}

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test};

    use crate::{
        models::sudoku::{CreateSudokuRequest, Difficulty, Sudoku},
        routes::sudoku::errors::SudokuError,
        test_utils::setup_test_app,
    };

    #[actix_web::test]
    async fn test_index_post_works() {
        // Arrange
        let (srv, _db, _user_id, auth_header) = setup_test_app().await;
        let request_data = CreateSudokuRequest {
            body:
                "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
                    .to_string(),
            difficulty: Difficulty::Easy,
        };
        // Act
        let req = test::TestRequest::post()
            .uri("/api/sudoku/")
            .set_json(request_data.clone())
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::CREATED);
        let body: Sudoku = test::read_body_json(res).await;
        assert_eq!(body.body, request_data.body,);
        assert_eq!(body.difficulty, request_data.difficulty,);
    }
    #[actix_web::test]
    async fn test_index_post_wrong_body() {
        // Arrange
        let (srv, _db, _user_id, auth_header) = setup_test_app().await;
        let request_data = CreateSudokuRequest {
            body: "4.....8.5.3..........7......2......".to_string(),
            difficulty: Difficulty::Easy,
        };
        // Act
        let req = test::TestRequest::post()
            .uri("/api/sudoku/")
            .set_json(request_data.clone())
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert_eq!(
            SudokuError::BodyDoesNotHave81Characters.to_http_message_body(),
            test::read_body(res).await,
        );
    }
    #[actix_web::test]
    async fn test_index_post_unsolvable_body() {
        // Arrange
        let (srv, _db, _user_id, auth_header) = setup_test_app().await;
        let request_data = CreateSudokuRequest {
            body:
                "4444..8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......"
                    .to_string(),
            difficulty: Difficulty::Easy,
        };
        // Act
        let req = test::TestRequest::post()
            .uri("/api/sudoku/")
            .set_json(request_data.clone())
            .insert_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::BAD_REQUEST);
        let body = test::read_body(res).await;
        assert_eq!(SudokuError::BodyIsNotSolvable.to_http_message_body(), body,);
    }
    #[actix_web::test]
    async fn test_index_post_solved_body() {
        // Arrange
        let (srv, _db, _user_id, auth_header) = setup_test_app().await;
        let request_data = CreateSudokuRequest {
            body:
                "417369825632158947958724316825437169791586432346912758289643571573291684164875293"
                    .to_string(),
            difficulty: Difficulty::Easy,
        };
        // Act
        let req = test::TestRequest::post()
            .uri("/api/sudoku/")
            .set_json(request_data.clone())
            .append_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::BAD_REQUEST);
        assert_eq!(
            SudokuError::BodyIsAlreadySolved.to_http_message_body(),
            test::read_body(res).await,
        );
    }
}
