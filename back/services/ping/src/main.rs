use axum::{
    routing::post,
    Json, Router,
    http::Method,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

#[derive(Deserialize)]
struct PingRequest {
    message: String,
}

#[derive(Serialize)]
struct PongResponse {
    response: String,
}

async fn ping_handler(Json(payload): Json<PingRequest>) -> Json<PongResponse> {
    let response = if payload.message.to_lowercase() == "ping" {
        "Pong".to_string()
    } else {
        format!("Unknown command: {}", payload.message)
    };
    
    Json(PongResponse { response })
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/ping", post(ping_handler))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("Ping service running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
