use crate::auth::AuthError;
use crate::utils::token_utils;
use actix_http::header::AUTHORIZATION;
use actix_web::body::EitherBody;
use actix_web::dev::{forward_ready, Service, ServiceRequest, ServiceResponse, Transform};
use actix_web::http::Method;
use actix_web::{Error, HttpMessage};
use futures::future::{ok, LocalBoxFuture, Ready};

pub struct Authentication;

impl<S, B> Transform<S, ServiceRequest> for Authentication
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthenticationMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthenticationMiddleware { service })
    }
}

pub struct AuthenticationMiddleware<S> {
    service: S,
}

impl<S, B> Service<ServiceRequest> for AuthenticationMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error>,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<EitherBody<B>>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    forward_ready!(service);

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let mut authenticate_pass: bool = false;
        if Method::OPTIONS == *req.method() {
            authenticate_pass = true;
        }
        if !authenticate_pass {
            if let Some(authen_header) = req.headers().get(AUTHORIZATION) {
                if token_utils::is_auth_header_valid(authen_header) {
                    if let Ok(authen_str) = authen_header.to_str() {
                        let token = authen_str[6..authen_str.len()].trim();
                        if let Ok(user_id) =
                            token_utils::decode_token_and_validate(token.to_string())
                        {
                            req.extensions_mut().insert(user_id);
                            authenticate_pass = true;
                        }
                    }
                }
            }
        }
        if !authenticate_pass {
            let response = AuthError::InvalidToken.to_http_response();
            return Box::pin(async {
                Ok(ServiceResponse::new(
                    req.into_parts().0,
                    response.map_into_right_body(),
                ))
            });
        }

        let res = self.service.call(req);

        Box::pin(async move { res.await.map(ServiceResponse::map_into_left_body) })
    }
}
