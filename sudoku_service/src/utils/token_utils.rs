use crate::{
    auth::AuthError,
    models::user_token::{Claims, RSA_JWT_DECODING_KEY},
};
use actix_web::http::header::HeaderValue;
use jsonwebtoken::{decode, Algorithm, Validation};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

fn is_token_expired(claims: &Claims) -> bool {
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs() as usize;
    claims.exp < now
}

pub fn verify_jwt_token(token: String) -> Result<Uuid, AuthError> {
    let decode_result = decode::<Claims>(
        &token,
        &RSA_JWT_DECODING_KEY,
        &Validation::new(Algorithm::RS256),
    );
    match decode_result {
        Ok(token) => {
            if is_token_expired(&token.claims) {
                return Err(AuthError::ExpiredToken);
            }
            Ok(token.claims.sub)
        }
        Err(_) => Err(AuthError::InvalidToken),
    }
}

pub fn is_auth_header_valid(access_token_header: &HeaderValue) -> bool {
    if let Ok(authen_str) = access_token_header.to_str() {
        return authen_str.starts_with("bearer") || authen_str.starts_with("Bearer");
    }
    false
}
