extern crate diesel;

use actix_web::middleware::{Compress, Logger, NormalizePath};
use actix_web::{web, App, HttpServer};

mod auth;
mod database;
mod models;
mod schema;
mod services;

#[cfg(debug_assertions)]
pub fn load_env_vars() {
    static START: std::sync::Once = std::sync::Once::new();

    START.call_once(|| {
        dotenv::dotenv().unwrap_or_else(|_| {
            panic!("ERROR: Could not load environment variables from dotenv file");
        });
    });
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        let mut app = App::new()
            .wrap(Compress::default())
            .wrap(NormalizePath::trim())
            .wrap(Logger::default());

        let mut api_scope = web::scope("/api");
        api_scope = api_scope.service(services::sudoku::sudoku_endpoints(web::scope("/sudoku")));

        #[cfg(debug_assertions)]
        {
            use utoipa_swagger_ui::{SwaggerUi, Url};
            /* Development-only routes */
            app = app.service(SwaggerUi::new("/swagger-ui/{_:.*}").urls(vec![(
                Url::new("auth", "/api-doc/openapi_auth.json"),
                services::sudoku::ApiDoc::openapi(),
            )]));
            // Mount development-only API routes
            api_scope =
                api_scope.service(create_rust_app::dev::sudoku_endpoints(web::scope("/development")));
            // Mount the admin dashboard on /admin
            app = app.service(
                web::scope("/admin")
                    .service(Files::new("/", ".cargo/admin/dist/").index_file("admin.html")),
            );
        }

        app = app.service(api_scope);
        app = app.default_service(web::get().to(create_rust_app::render_views));
        app
    })
    .bind("0.0.0.0:3000")?
    .run()
    .await
}
