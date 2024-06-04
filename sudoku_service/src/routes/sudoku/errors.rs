use actix_http::StatusCode;
use actix_web::HttpResponse;
use serde_json::json;

#[derive(Debug, serde::Serialize)]
pub enum SudokuError {
    BodyIsAlreadySolved,
    BodyIsNotSolvable,
    BodyDoesNotHave81Characters,
    CouldNotParse,
    CouldNotCreate,
}

impl SudokuError {
    pub fn message(&self) -> &str {
        match self {
            SudokuError::BodyIsAlreadySolved => "'body' can't be a solved sudoku.",
            SudokuError::BodyIsNotSolvable => "'body' needs to be a solvable sudoku.",
            SudokuError::BodyDoesNotHave81Characters => "'body' needs to have 81 characters.",
            SudokuError::CouldNotParse => "Error parsing sudoku.",
            SudokuError::CouldNotCreate => "Could not create sudoku.",
        }
    }

    pub fn status_code(&self) -> StatusCode {
        match self {
            SudokuError::BodyIsAlreadySolved
            | SudokuError::BodyIsNotSolvable
            | SudokuError::BodyDoesNotHave81Characters
            | SudokuError::CouldNotParse => StatusCode::BAD_REQUEST,
            SudokuError::CouldNotCreate => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
    pub fn to_http_message_body(&self) -> String {
        json!({"message": self.message(), "error": self}).to_string()
    }

    pub fn to_http_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).body(self.to_http_message_body())
    }
}

impl<'__s> utoipa::ToSchema<'__s> for SudokuError {
    fn schema() -> (
        &'__s str,
        utoipa::openapi::RefOr<utoipa::openapi::schema::Schema>,
    ) {
        (
            "SudokuError",
            utoipa::openapi::ObjectBuilder::new()
                .schema_type(utoipa::openapi::SchemaType::String)
                .enum_values::<[&str; 5usize], &str>(Some([
                    SudokuError::BodyIsAlreadySolved.message(),
                    SudokuError::BodyIsNotSolvable.message(),
                    SudokuError::BodyDoesNotHave81Characters.message(),
                    SudokuError::CouldNotParse.message(),
                    SudokuError::CouldNotCreate.message(),
                ]))
                .into(),
        )
    }
}
