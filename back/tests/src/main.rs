use reqwest;
use serde_json::json;
use std::time::Duration;

#[tokio::test]
async fn test_ping_service_health() {
    let client = reqwest::Client::new();
    let resp = client
        .get("http://127.0.0.1:3001/health")
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to ping service");

    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["status"], "ok");
    assert_eq!(json["service"], "ping");
    assert_eq!(json["version"], "0.1.0");
}

#[tokio::test]
async fn test_ping_service_ping_endpoint() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3001/ping")
        .json(&json!({"message": "Ping"}))
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to ping service");

    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["response"], "Pong");
}

#[tokio::test]
async fn test_ping_service_unknown_command() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3001/ping")
        .json(&json!({"message": "Hello"}))
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to ping service");

    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert!(json["response"].as_str().unwrap().contains("Unknown command"));
}

#[tokio::test]
async fn test_gateway_health() {
    let client = reqwest::Client::new();
    let resp = client
        .get("http://127.0.0.1:3000/health")
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to gateway");

    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["status"], "ok");
    assert_eq!(json["service"], "gateway");
    assert_eq!(json["version"], "0.1.0");
}

#[tokio::test]
async fn test_gateway_proxy_ping() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3000/api/ping")
        .json(&json!({"message": "Ping"}))
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to gateway");

    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["response"], "Pong");
}

#[tokio::test]
async fn test_gateway_proxy_unknown_path() {
    let client = reqwest::Client::new();
    let resp = client
        .post("http://127.0.0.1:3000/api/unknown")
        .json(&json!({"message": "test"}))
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Failed to connect to gateway");

    assert_eq!(resp.status(), 400);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert!(json["error"].as_str().unwrap().contains("Unknown path"));
}

#[tokio::test]
async fn test_end_to_end_flow() {
    let client = reqwest::Client::new();

    // 1. Check gateway health
    let resp = client
        .get("http://127.0.0.1:3000/health")
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Gateway health check failed");
    assert_eq!(resp.status(), 200);

    // 2. Check ping service health
    let resp = client
        .get("http://127.0.0.1:3001/health")
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Ping service health check failed");
    assert_eq!(resp.status(), 200);

    // 3. Send ping through gateway
    let resp = client
        .post("http://127.0.0.1:3000/api/ping")
        .json(&json!({"message": "Ping"}))
        .timeout(Duration::from_secs(5))
        .send()
        .await
        .expect("Gateway proxy failed");
    assert_eq!(resp.status(), 200);
    let json: serde_json::Value = resp.json().await.unwrap();
    assert_eq!(json["response"], "Pong");
}
