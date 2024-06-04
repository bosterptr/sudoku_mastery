use crate::database::DBPool;
use crate::models::sudoku::Sudoku;
use actix_web::{
    get,
    web::{Data, Path},
    HttpResponse,
};
use uuid::Uuid;

#[utoipa::path(
    context_path = "/api/sudoku",
    responses(
        (status = 200, body=Sudoku),
        (status = 404),
        (status = 500, body=SudokuError),
    ),
    tag = "Sudokus"
)]
#[get("/metrics")]
async fn serve_metrics() -> HttpResponse {
    let encoder = TextEncoder::new();

    HTTP_COUNTER.inc();
    let timer = HTTP_REQ_HISTOGRAM.with_label_values(&["all"]).start_timer();

    let metric_families = prometheus::gather();
    let mut buffer = vec![];
    encoder.encode(&metric_families, &mut buffer).unwrap();
    HTTP_BODY_GAUGE.set(buffer.len() as f64);

    let response = Response::builder()
        .status(200)
        .header(CONTENT_TYPE, encoder.format_type())
        .body(Body::from(buffer))
        .unwrap();

    timer.observe_duration();

    Ok(response)
}