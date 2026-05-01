use axum::{
    body::Body,
    extract::Request,
    response::Response,
    routing::{any, get},
    Router,
    http::StatusCode,
};
use std::net::SocketAddr;
use std::sync::OnceLock;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info, warn};

static HTTP_CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

fn get_client() -> &'static reqwest::Client {
    HTTP_CLIENT.get_or_init(|| {
        reqwest::Client::builder()
            .pool_max_idle_per_host(10)
            .build()
            .expect("Failed to build HTTP client")
    })
}

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
struct ErrorResponse {
    error: String,
}

#[derive(Debug)]
enum AppError {
    ProxyError(String),
    ServiceUnavailable(String),
    BadRequest(String),
    InternalError(String),
}

impl axum::response::IntoResponse for AppError {
    fn into_response(self) -> Response<Body> {
        let (status, message) = match self {
            AppError::ProxyError(msg) => (StatusCode::BAD_GATEWAY, msg),
            AppError::ServiceUnavailable(msg) => (StatusCode::SERVICE_UNAVAILABLE, msg),
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

async fn proxy_handler(req: Request) -> Result<Response<Body>, AppError> {
    let path = req.uri().path().to_string();
    let method = req.method().clone();
    let headers = req.headers().clone();
    info!("Incoming request: {} {}", method, path);

    let ping_service_url = std::env::var("GATEWAY_PING_SERVICE_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:3002".to_string());

    let target_url = if path.starts_with("/api/ping") {
        format!("{}/ping", ping_service_url.trim_end_matches('/'))
    } else {
        warn!("Unknown path: {}", path);
        return Err(AppError::BadRequest(format!("Unknown path: {}", path)));
    };

    let body_bytes = axum::body::to_bytes(req.into_body(), usize::MAX)
        .await
        .map_err(|e| AppError::BadRequest(format!("Failed to read body: {}", e)))?;

    let mut request_builder = get_client().request(method, &target_url);

    for (key, value) in headers.iter() {
        let key_str = key.as_str();
        if key_str != "host" && key_str != "content-length" {
            request_builder = request_builder.header(key_str, value);
        }
    }

    let response = request_builder
        .body(body_bytes)
        .send()
        .await
        .map_err(|e| {
            error!("Proxy request failed: {}", e);
            AppError::ProxyError(format!("Failed to proxy request: {}", e))
        })?;

    let status = StatusCode::from_u16(response.status().as_u16())
        .unwrap_or(StatusCode::OK);
    let mut axum_response = Response::builder().status(status);

    for (key, value) in response.headers().iter() {
        axum_response = axum_response.header(key.as_str(), value);
    }

    let body_bytes = response.bytes().await.map_err(|e| {
        error!("Failed to read response body: {}", e);
        AppError::ProxyError(format!("Failed to read response body: {}", e))
    })?;

    let response = axum_response
        .body(Body::from(body_bytes))
        .map_err(|e| AppError::InternalError(format!("Failed to build response: {}", e)))?;

    info!("Proxy response: {} -> {}", path, status);
    Ok(response)
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
        .unwrap_or(3000);

    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/*path", any(proxy_handler))
        .route("/api", any(proxy_handler))
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
