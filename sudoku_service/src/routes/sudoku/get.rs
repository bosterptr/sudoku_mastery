use crate::database::DBPool;
use crate::models::api::PaginationParams;
use crate::models::sudoku::Sudoku;
use actix_web::{
    get,
    web::{Data, Query},
    HttpResponse,
};
#[utoipa::path(
    context_path = "/api/sudoku/",
    params(PaginationParams),
    responses(
        (status = 200, description = "Get sudokus", body=PaginatedSudoku),
        (status = 500),
    ),
    tag = "Sudokus"
)]
#[get("/")]
pub async fn get_sudokus(pool: Data<DBPool>, Query(info): Query<PaginationParams>) -> HttpResponse {
    match Sudoku::paginate(&pool, info.page, info.page_size).await {
        Ok(sudoku) => HttpResponse::Ok().json(sudoku),
        Err(err) => HttpResponse::NotFound().body(err.to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::sudoku::{CreateSudokuRequest, Difficulty, PaginatedSudoku};
    use crate::test_utils::setup_test_app;
    use actix_web::{http::StatusCode, test};

    #[actix_web::test]
    async fn test_index_get_works() {
        // Arrange
        let (srv, db, user_id, auth_header) = setup_test_app().await;
        let params = PaginationParams {
            page: Some(1),
            page_size: Some(1),
        };
        // Act
        let req = test::TestRequest::get()
            .uri(&format!(
                "/api/sudoku/?page={}&page_size={}",
                params.page.unwrap(),
                params.page_size.unwrap()
            ))
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        assert_eq!(status, StatusCode::OK);
        let body = test::read_body(res).await;
        assert!(
            body.starts_with(
                b"{\"items\":[],\"total_items\":0,\"page\":1,\"page_size\":1,\"num_pages\":0}"
            ),
            "unexpected body 1: {body:?}",
        );

        // Arrange
        // add two new sudokus to the table
        let created_sudoku_1 = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3..".to_string(), difficulty: Difficulty::Normal  },&user_id).await.unwrap();
        let created_sudoku_2 = Sudoku::create(&db.pool, &CreateSudokuRequest{ body: "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......".to_string(), difficulty: Difficulty::Hard  },&user_id).await.unwrap();
        // Act
        let req = test::TestRequest::get()
            .uri(&format!(
                "/api/sudoku/?page={}&page_size={}",
                params.page.unwrap(),
                params.page_size.unwrap()
            ))
            .append_header(auth_header.clone())
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body: PaginatedSudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::OK);
        assert!(
            body.items == [created_sudoku_2.clone()],
            "unexpected body 2: {body:?}",
        );

        // Arrange
        let params = PaginationParams {
            page: Some(0),
            page_size: Some(2),
        };
        // Act
        let req = test::TestRequest::get()
            .uri(&format!(
                "/api/sudoku/?page={}&page_size={}",
                params.page.unwrap(),
                params.page_size.unwrap()
            ))
            .append_header(auth_header)
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        let body: PaginatedSudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::OK);
        assert!(
            body.items == [created_sudoku_1.clone(), created_sudoku_2.clone()],
            "unexpected body 3: {body:?}",
        );
    }
}
