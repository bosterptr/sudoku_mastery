#[tsync::tsync]
#[derive(serde::Deserialize, utoipa::IntoParams, utoipa::ToSchema)]
pub struct IdParam {
    pub id: uuid::Uuid,
}

#[tsync::tsync]
#[derive(serde::Deserialize, utoipa::IntoParams, utoipa::ToSchema)]
pub struct MessageResponse<T> {
    pub message: T,
}

#[tsync::tsync]
#[derive(serde::Deserialize, utoipa::IntoParams, utoipa::ToSchema)]
pub struct PaginationParams {
    #[schema( minimum = 0)]
    pub page: i64,
    #[schema(minimum = 1, maximum = 100)]
    pub page_size: i64,
}
