use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use serde_json::json;

fn app() -> axum::Router {
    use axum::{
        body::Body,
        http::Method,
        http::StatusCode,
        response::Response,
        routing::{get, post},
        Json, Router,
    };
    use serde::{Deserialize, Serialize};
    use tower_http::cors::{Any, CorsLayer};
    use tower_http::trace::TraceLayer;

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

    async fn health_handler() -> Response<Body> {
        let body = serde_json::to_string(&HealthResponse {
            status: "ok",
            service: "ping",
            version: "0.1.0",
        })
        .unwrap_or_else(|_| r#"{"status":"ok","service":"ping","version":"0.1.0"}"#.to_string());

        Response::builder()
            .status(StatusCode::OK)
            .header("content-type", "application/json")
            .body(Body::from(body))
            .unwrap()
    }

    async fn ping_handler(Json(payload): Json<PingRequest>) -> Json<PongResponse> {
        let response = if payload.message.to_lowercase() == "ping" {
            "Pong".to_string()
        } else {
            format!("Unknown command: {}", payload.message)
        };
        Json(PongResponse { response })
    }

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any)
        .allow_origin(Any);

    Router::new()
        .route("/health", get(health_handler))
        .route("/ping", post(ping_handler))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
}

#[tokio::test]
async fn test_health_endpoint() {
    let client = reqwest::Client::new();
    let resp = client
        .get("http://127.0.0.1:3001/health")
        .send()
        .await
        .unwrap();
    
    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["status"], "ok");
    assert_eq!(json["service"], "ping");
    assert_eq!(json["version"], "0.1.0");
}

#[tokio::test]
async fn test_ping_endpoint() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3001/ping")
        .json(&json!({"message": "Ping"}))
        .send()
        .await
        .unwrap();
    
    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["response"], "Pong");
}

#[tokio::test]
async fn test_ping_unknown_command() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3001/ping")
        .json(&json!({"message": "Hello"}))
        .send()
        .await
        .unwrap();
    
    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert!(json["response"].as_str().unwrap().contains("Unknown command"));
}
