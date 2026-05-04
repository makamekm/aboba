use axum::{
    body::Body,
    extract::{Path, Request},
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

async fn proxy_handler(req: Request<Body>) -> Response<Body> {
    let client = reqwest::Client::new();
    let front_url = std::env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:8081".to_string());
    let path = req.uri().path();
    let query = req.uri().query().map(|q| format!("?{}", q)).unwrap_or_default();
    
    let target_url = format!("{}{}{}", front_url, path, query);

    let method = reqwest::Method::from_bytes(req.method().as_str().as_bytes())
        .unwrap_or(reqwest::Method::GET);

    let mut proxy_req = client.request(method, &target_url);

    // Remove Accept-Encoding to prevent gzip compression
    for (key, value) in req.headers() {
        let key_str = key.as_str();
        if key_str != "host" && key_str != "accept-encoding" {
            proxy_req = proxy_req.header(key_str, value.as_bytes());
        }
    }

    match proxy_req.send().await {
        Ok(res) => {
            let status = StatusCode::from_u16(res.status().as_u16()).unwrap_or(StatusCode::OK);
            let content_type = res.headers().get("content-type")
                .and_then(|v| v.to_str().ok())
                .unwrap_or("application/octet-stream")
                .to_string();
            let body_bytes = res.bytes().await.unwrap_or_default();
            Response::builder()
                .status(status)
                .header("content-type", content_type)
                .body(Body::from(body_bytes))
                .unwrap()
        }
        Err(e) => {
            error!("Proxy error: {}", e);
            Response::builder()
                .status(StatusCode::BAD_GATEWAY)
                .body(Body::from(format!("Proxy error: {}", e)))
                .unwrap()
        }
    }
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
        .fallback(get(proxy_handler))
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
