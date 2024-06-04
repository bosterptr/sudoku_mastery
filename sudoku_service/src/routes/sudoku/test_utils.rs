pub async fn setup_test_sudoku_app() -> (
    impl actix_web::dev::Service<
        actix_http::Request,
        Response = ServiceResponse,
        Error = actix_web::Error,
    >,
    database::Database,
) {
    use crate::schema::sudokus::dsl::sudokus;
    dotenv::dotenv().ok();
    env_logger::try_init_from_env(env_logger::Env::new().default_filter_or("info")).ok();
    let db: Database = Database::new();
    clear_sudokus_table(&db);
    let sudoku_count = sudokus.count().first(&mut db.get_connection());
    assert_eq!(Ok(0), sudoku_count);
    let app = test::init_service(
        App::new()
            .app_data(web::Data::new(db.clone()))
            .service(sudoku_endpoints(web::scope("/api/sudoku"))),
    )
    .await;
    return (app, db);
}