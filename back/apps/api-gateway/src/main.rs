use axum::{
    body::Body,
    response::Response,
    routing::get,
    Router,
    http::StatusCode,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info};

#[derive(serde::Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    version: &'static str,
}

async fn health_handler() -> Response<Body> {
    let body = serde_json::to_string(&HealthResponse {
        status: "ok",
        service: "gateway",
        version: "0.1.0",
    }).unwrap_or_else(|_| r#"{"status":"ok","service":"gateway","version":"0.1.0"}"#.to_string());

    Response::builder()
        .status(StatusCode::OK)
        .header("content-type", "application/json")
        .body(Body::from(body))
        .unwrap()
}

#[derive(serde::Serialize)]
struct PingResponse {
    message: &'static str,
}

async fn ping_handler() -> Response<Body> {
    let body = serde_json::to_string(&PingResponse {
        message: "pong",
    }).unwrap_or_else(|_| r#"{"message":"pong"}"#.to_string());

    Response::builder()
        .status(StatusCode::OK)
        .header("content-type", "application/json")
        .body(Body::from(body))
        .unwrap()
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env()
            .add_directive("api_gateway=info".parse().unwrap())
            .add_directive("tower_http=info".parse().unwrap()))
        .init();

    let port = std::env::var("GATEWAY_PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(8000);

    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/ping", get(ping_handler))
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("API Gateway starting on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await
        .expect("Failed to bind to address");

    let server = axum::serve(listener, app);

    info!("API Gateway running on http://{}", addr);

    let shutdown = server.with_graceful_shutdown(async {
        tokio::signal::ctrl_c().await.expect("Failed to install Ctrl+C handler");
        info!("Received shutdown signal, shutting down gracefully...");
    });

    if let Err(e) = shutdown.await {
        error!("Server error: {}", e);
    }

    info!("API Gateway shutdown complete");
}
