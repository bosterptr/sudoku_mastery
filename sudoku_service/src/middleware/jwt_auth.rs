use crate::auth::AuthError;
use crate::utils::token_utils;
use actix_web::{dev::Payload, Error as ActixWebError};
use actix_web::{http, FromRequest, HttpRequest};
use core::fmt;
use serde::{Deserialize, Serialize};
use std::future::{ready, Ready};
use uuid::Uuid;

#[derive(Debug, Serialize)]
struct ErrorResponse {
    status: String,
    message: String,
}

impl fmt::Display for ErrorResponse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", serde_json::to_string(&self).unwrap())
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JwtMiddleware {
    pub user_id: Uuid,
}

impl FromRequest for JwtMiddleware {
    type Error = ActixWebError;
    type Future = Ready<Result<Self, Self::Error>>;
    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        match req.headers().get(http::header::AUTHORIZATION) {
            Some(header) => match token_utils::is_auth_header_valid(header) {
                true => {
                    let token = header.to_str().unwrap().split_at(7).1.to_string();
                    match token_utils::verify_jwt_token(token.to_string()) {
                        Ok(user_id) => ready(Ok(JwtMiddleware { user_id })),
                        Err(err) => ready(Err(err.into())),
                    }
                }
                false => ready(Err(AuthError::InvalidToken.into())),
            },
            None => ready(Err(AuthError::MissingToken.into())),
        }
    }
}
