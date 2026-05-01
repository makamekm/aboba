use axum::{
    routing::{get, post},
    Json, Router,
    http::Method,
    response::Response,
    body::Body,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info, warn};

#[derive(Deserialize, Debug)]
struct PingRequest {
    message: String,
}

#[derive(Serialize)]
struct PongResponse {
    response: String,
}

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    service: &'static str,
    version: &'static str,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

#[derive(Debug)]
enum AppError {
    BadRequest(String),
    InternalError(String),
}

impl axum::response::IntoResponse for AppError {
    fn into_response(self) -> Response<Body> {
        let (status, message) = match self {
            AppError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::InternalError(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        let body = serde_json::to_string(&ErrorResponse { error: message })
            .unwrap_or_else(|_| r#"{"error":"internal error"}"#.to_string());

        Response::builder()
            .status(status)
            .header("content-type", "application/json")
            .body(Body::from(body))
            .unwrap()
    }
}

async fn health_handler() -> Response<Body> {
    let body = serde_json::to_string(&HealthResponse {
        status: "ok",
        service: "ping",
        version: "0.1.0",
    }).unwrap_or_else(|_| r#"{"status":"ok","service":"ping","version":"0.1.0"}"#.to_string());

    Response::builder()
        .status(StatusCode::OK)
        .header("content-type", "application/json")
        .body(Body::from(body))
        .unwrap()
}

async fn ping_handler(Json(payload): Json<PingRequest>) -> Result<Json<PongResponse>, AppError> {
    info!("Received ping request: message={}", payload.message);

    let response = if payload.message.to_lowercase() == "ping" {
        "Pong".to_string()
    } else {
        warn!("Unknown command received: {}", payload.message);
        format!("Unknown command: {}", payload.message)
    };

    info!("Sending response: {}", response);
    Ok(Json(PongResponse { response }))
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env()
            .add_directive("ping=info".parse().unwrap())
            .add_directive("tower_http=info".parse().unwrap()))
        .init();

    let port = std::env::var("PING_SERVICE_PORT")
        .ok()
        .and_then(|p| p.parse::<u16>().ok())
        .unwrap_or(3001);

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/ping", post(ping_handler))
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    info!("Ping service starting on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await
        .expect("Failed to bind to address");

    let server = axum::serve(listener, app);

    info!("Ping service running on http://{}", addr);

    let shutdown = server.with_graceful_shutdown(async {
        tokio::signal::ctrl_c().await.expect("Failed to install Ctrl+C handler");
        info!("Received shutdown signal, shutting down gracefully...");
    });

    if let Err(e) = shutdown.await {
        error!("Server error: {}", e);
    }

    info!("Ping service shutdown complete");
}
