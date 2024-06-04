#![no_main]
use actix_web::{test, App, web, middleware, http::StatusCode};
use diesel::{RunQueryDsl, QueryDsl};
use libfuzzer_sys::fuzz_target;
use sudoku_service::{Rgb, Database, services::sudoku::endpoints, models::sudoku::{Sudoku, Difficulty},models::sudoku};
use tokio::runtime::Runtime;

// Synchronous wrapper around the asynchronous function
fn sync_wrapper(body: String) {
    // Create a new Tokio runtime
    let rt = Runtime::new().unwrap();

    // Block the thread and wait for the async function to complete
    rt.block_on(async {
        use sudoku_service::schema::sudokus::dsl::sudokus;

        dotenv::dotenv().ok();
        env_logger::try_init_from_env(env_logger::Env::new().default_filter_or("info")).ok();
        let db: Database = Database::new();
        let deleted = diesel::delete(sudokus)
            .returning(sudoku_service::schema::sudokus::id)
            .execute(&db.pool)
            .expect("couldn't delete test sudoku from table");
        println!("deleted {deleted}");
        let sudoku_count = sudokus.count().first(&db.pool);
        assert_eq!(Ok(0), sudoku_count);
        let app = test::init_service(
            App::new()
                .app_data(web::Data::new(db.clone()))
                .wrap(middleware::Logger::new(
                    r#"%a "%r" %s %b "%{Referer}i" "%{User-Agent}i" %D ms"#,
                ))
                .service(sudoku_endpoints(web::scope("/api/sudoku"))),
        )
        .await;
        let request_data = sudoku::Create {
            body:body,
            difficulty: Difficulty::Easy
        };
                // Act
                // Act
        let req = test::TestRequest::post()
            .uri("/api/sudoku/").data(request_data.clone())
            .to_request();
        let res = test::call_service(&srv, req).await;
        // Assert
        let status = res.status();
        println!("{status}");
        let body:Sudoku = test::read_body_json(res).await;
        assert_eq!(status, StatusCode::CREATED);
        assert_eq!(
            body.body,
            request_data.body,
        );
        assert_eq!(
            body.difficulty,
            request_data.difficulty,
        );
        diesel::delete(sudokus)
            .execute(&db.pool)
            .expect("couldn't delete test sudoku from table");
    });
}

fuzz_target!(|data: String| {
    sync_wrapper(data);
});