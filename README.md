# Aboba

Fullstack project with **React Native** frontend and Rust/NX backend.

## Architecture

### Backend (`back/`)
- **NX monorepo** structure
- **Rust** microservices in `services/[service-name]`
- **API Gateway** in `apps/api-gateway`
- Services communicate via HTTP

### Frontend (`front/`)
- **React Native** with `react-native-web` for Web
- **Expo** toolchain
- Targets: **Android**, **iOS**, **Web**
- Dark theme inspired by ChatGPT
- Swipe-to-go-back navigation via custom `SwipeView` component

## Features
- Dark theme inspired by ChatGPT
- Ping/Pong communication between frontend and backend
- Chat list with swipe navigation

## Requirements
- Rust + Cargo
- Node.js + npm (for NX)
- Expo CLI

## Quick Start

### Backend
```bash
# Run Ping service
cd back && cargo run --release -p ping

# Run API Gateway (in another terminal)
cd back && cargo run --release -p api-gateway
```

### Frontend

#### Web
```bash
cd front && npx expo start --web
```

#### Android
```bash
cd front && npx expo run:android
```

#### iOS
```bash
cd front && npx expo run:ios
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 3000 | Routes requests to services |
| Ping | 3001 | Responds "Pong" to "Ping" |
