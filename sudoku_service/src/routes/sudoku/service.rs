use super::{create, get_by_sudoku_id, get_random_sudoku, get_sudokus, remove, update};

pub fn sudoku_endpoints(scope: actix_web::Scope) -> actix_web::Scope {
    scope
        .service(get_sudokus)
        .service(get_by_sudoku_id)
        .service(get_random_sudoku)
        .service(create)
        .service(update)
        .service(remove)
}
