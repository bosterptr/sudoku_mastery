use actix_web::HttpResponse;
use actix_web::{http::StatusCode, ResponseError};
use serde_json::json;
use std::fmt::{self, Display, Formatter};

#[derive(Debug, serde::Serialize)]
pub enum AuthError {
    InvalidToken,
    ExpiredToken,
    MissingToken,
}

impl ResponseError for AuthError {
    fn error_response(&self) -> HttpResponse {
        match self {
            AuthError::InvalidToken | AuthError::MissingToken | AuthError::ExpiredToken => {
                HttpResponse::Unauthorized()
                    .body(json!({"message": self.to_string(), "error": self}).to_string())
            }
        }
    }
}

impl AuthError {
    fn status_code(&self) -> StatusCode {
        match *self {
            AuthError::InvalidToken | AuthError::ExpiredToken | AuthError::MissingToken => {
                StatusCode::UNAUTHORIZED
            }
        }
    }
    pub fn to_http_message_body(&self) -> String {
        json!({"message": self.to_string(), "error": self}).to_string()
    }
    pub fn to_http_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code()).body(self.to_http_message_body())
    }
}

impl Display for AuthError {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let message = match *self {
            AuthError::InvalidToken => "Invalid token.",
            AuthError::ExpiredToken => "Expired token.",
            AuthError::MissingToken => "Missing token.",
        };
        write!(f, "{}", message)
    }
}
impl<'__s> utoipa::ToSchema<'__s> for AuthError {
    fn schema() -> (
        &'__s str,
        utoipa::openapi::RefOr<utoipa::openapi::schema::Schema>,
    ) {
        (
            "AuthError",
            utoipa::openapi::ObjectBuilder::new()
                .schema_type(utoipa::openapi::SchemaType::String)
                .enum_values::<[&str; 1usize], &str>(Some([&AuthError::InvalidToken.to_string()]))
                .into(),
        )
    }
}
