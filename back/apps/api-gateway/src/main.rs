use axum::{
    body::Body,
    extract::Request,
    response::Response,
    routing::any,
    Router,
    http::StatusCode,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};

async fn proxy_handler(req: Request) -> Result<Response<Body>, StatusCode> {
    let path = req.uri().path();
    let client = reqwest::Client::new();

    let target_url = if path.starts_with("/api/ping") {
        "http://127.0.0.1:3001/ping".to_string()
    } else {
        return Err(StatusCode::NOT_FOUND);
    };

    let method = req.method().clone();
    let headers = req.headers().clone();
    let body_bytes = axum::body::to_bytes(req.into_body(), usize::MAX)
        .await
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    let mut request_builder = client.request(method, &target_url);

    for (key, value) in headers.iter() {
        if key.as_str() != "host" {
            request_builder = request_builder.header(key.as_str(), value);
        }
    }

    let response = request_builder
        .body(body_bytes)
        .send()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let status = StatusCode::from_u16(response.status().as_u16()).unwrap_or(StatusCode::OK);
    let mut axum_response = Response::builder().status(status);

    for (key, value) in response.headers().iter() {
        axum_response = axum_response.header(key.as_str(), value);
    }

    let body_bytes = response.bytes().await.map_err(|_| StatusCode::BAD_GATEWAY)?;
    let response = axum_response
        .body(Body::from(body_bytes))
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(response)
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_methods(Any)
        .allow_headers(Any)
        .allow_origin(Any);

    let app = Router::new()
        .route("/api/{*path}", any(proxy_handler))
        .route("/api", any(proxy_handler))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("API Gateway running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
