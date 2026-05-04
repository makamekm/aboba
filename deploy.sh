#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="aboba"
FRONT_PORT="8081"
BACK_PORT="8000"
BACK_DIR="${SCRIPT_DIR}/back"
FRONT_DIR="${SCRIPT_DIR}/front"
PM2_ECOSYSTEM="${SCRIPT_DIR}/ecosystem.config.json"

cd "${SCRIPT_DIR}"

echo "=== [${PROJECT_NAME}] Deploy started ==="

# ── FRONTEND ──
echo "→ Building frontend..."
cd "${FRONT_DIR}"

rm -rf dist .expo

if [ ! -d "node_modules" ]; then
    echo "→ Installing frontend deps..."
    npm ci
fi

npx expo export --platform web

echo "→ Starting frontend server on port ${FRONT_PORT}..."
pm2 delete "${PROJECT_NAME}-front" 2>/dev/null || true
pm2 start "npx" \
    --name "${PROJECT_NAME}-front" \
    --cwd "${FRONT_DIR}" \
    -- serve "${FRONT_DIR}/dist" -l ${FRONT_PORT} -s

# ── BACKEND ──
echo "→ Building backend..."
cd "${BACK_DIR}"

cargo build --release -p api-gateway

echo "→ Restarting backend service..."
pm2 delete "${PROJECT_NAME}-gateway" 2>/dev/null || true

pm2 start "${PM2_ECOSYSTEM}"

# ── DONE ──
echo ""
echo "=== Deploy complete ==="
pm2 list | grep "${PROJECT_NAME}"
echo ""
echo "Frontend: http://localhost:${FRONT_PORT}"
echo "API Gateway: http://localhost:${BACK_PORT}"
