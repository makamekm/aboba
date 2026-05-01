# Aboba

Fullstack project with Kotlin Multiplatform frontend and Rust/NX backend.

## Architecture

### Backend (`back/`)
- **NX monorepo** structure
- **Rust** microservices in `services/[service-name]`
- **API Gateway** in `apps/api-gateway`
- Services communicate via HTTP

### Frontend (`front/`)
- **Kotlin Multiplatform** (KMP)
- Targets: **Android**, **iOS**, **Web (WASM)**
- **Compose Multiplatform** UI
- **Reaktive** for reactive state management
- Singleton services with `AsyncInit` pattern

## Features
- Dark theme inspired by ChatGPT
- Ping/Pong communication between frontend and backend

## Requirements
- Rust + Cargo
- Node.js + npm (for NX)
- JDK 17+
- Android SDK (for Android builds)
- Xcode (for iOS builds)

## Quick Start

### Backend
```bash
# Run Ping service
cd back && cargo run --release -p ping

# Run API Gateway (in another terminal)
cd back && cargo run --release -p api-gateway
```

### Frontend

#### Web (WASM)
```bash
cd front && ./gradlew :composeApp:wasmJsBrowserDevelopmentRun
```
Open http://localhost:8080

#### Android
```bash
cd front && ./gradlew :composeApp:installDebug
```

#### iOS
Open `front/iosApp/iosApp.xcodeproj` in Xcode and run.

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Routes requests to services |
| Ping | 3001 | Responds "Pong" to "Ping" |
