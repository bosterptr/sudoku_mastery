use crate::configuration::Settings;
use crate::database::{DBPool, Database};
use crate::routes;
use actix_web::body::MessageBody;
use actix_web::dev::{Server, ServiceFactory, ServiceRequest, ServiceResponse};
use actix_web::middleware::Logger;
use actix_web::web::{self, Data};
use actix_web::Error;
use actix_web::{App, HttpServer};
use actix_web_prom::PrometheusMetricsBuilder;
use std::net::TcpListener;
use tracing::info;

pub struct Application {
    port: u16,
    server: Server,
    pub db: Database,
}

pub fn create_app(
    db_pool: DBPool,
) -> App<
    impl ServiceFactory<
        ServiceRequest,
        Response = ServiceResponse<impl MessageBody>,
        Config = (),
        InitError = (),
        Error = Error,
    >,
> {
    let prometheus = PrometheusMetricsBuilder::new("api")
        .endpoint("/metrics")
        .build()
        .unwrap();
    let mut app = App::new()
        .wrap(prometheus)
        .app_data(Data::new(db_pool))
        .wrap(Logger::default());
    let mut api_scope = web::scope("/api");
    api_scope = api_scope.service(routes::sudoku::service::sudoku_endpoints(web::scope(
        "/sudoku",
    )));
    #[cfg(debug_assertions)]
    {
        use utoipa::OpenApi;
        use utoipa_swagger_ui::SwaggerUi;
        /* Development-only routes */
        app = app.service(SwaggerUi::new("/swagger-ui/{_:.*}").url(
            "/api-docs/openapi_sudoku.json",
            routes::sudoku::ApiDoc::openapi(),
        ));
    }
    app = app.service(api_scope);
    app
}

// #[macro_export]
// macro_rules! app (
//     ($db_pool: expr) => ({
//         use actix_web::{web, App};
//         use crate::routes;
//         let mut app = App::new().app_data($db_pool.clone());
//         let mut api_scope = web::scope("/api");
//         api_scope = api_scope.service(routes::sudoku::service::sudoku_endpoints(web::scope(
//             "/sudoku",
//         )));
//         #[cfg(debug_assertions)]
//         {
//             use utoipa::OpenApi;
//             use utoipa_swagger_ui::SwaggerUi;
//             /* Development-only routes */
//             app = app.service(SwaggerUi::new("/swagger-ui/{_:.*}").url(
//                 "/api-docs/openapi_sudoku.json",
//                 routes::sudoku::ApiDoc::openapi(),
//             ));
//         }
//         app = app.service(api_scope);
//         app
//     });
// );

impl Application {
    pub async fn build(configuration: &Settings) -> Result<Self, anyhow::Error> {
        let db = Database::new(configuration);
        db.run_migrations().await.expect("DB migration failed");
        let address = format!(
            "{}:{}",
            configuration.application.host, configuration.application.port
        );
        let listener = TcpListener::bind(address)?;
        let port = listener.local_addr().unwrap().port();
        info!(message = "listening", addr = ?listener, port = ?port);
        let server = create_server(listener, db.clone()).await?;
        Ok(Self { port, server, db })
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    pub async fn run_until_stopped(self) -> Result<(), std::io::Error> {
        self.server.await
    }
}

pub struct ApplicationBaseUrl(pub String);

async fn create_server(listener: TcpListener, db: Database) -> Result<Server, anyhow::Error> {
    let server = HttpServer::new(move || create_app(db.pool.to_owned()))
        .listen(listener)?
        .run();
    Ok(server)
}
