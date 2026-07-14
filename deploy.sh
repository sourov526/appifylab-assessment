#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

MODE=""

usage() {
  cat <<'EOF'
Usage:
  ./deploy.sh --local
  ./deploy.sh --production

Options can also be overridden with environment variables before running the script.
Examples:
  PUBLIC_HOST=16.171.31.136 SESSION_SECRET=my-secret ./deploy.sh --production
  PUBLIC_HOST=localhost CLIENT_PORT=3000 ./deploy.sh --local
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --local)
      MODE="local"
      shift
      ;;
    --production)
      MODE="production"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "A deployment mode is required." >&2
  usage
  exit 1
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command docker
require_command openssl

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin is required but not available." >&2
  exit 1
fi

if [[ "$MODE" == "production" ]]; then
  PUBLIC_HOST="${PUBLIC_HOST:-16.171.31.136}"
  NODE_ENV="${NODE_ENV:-production}"
else
  PUBLIC_HOST="${PUBLIC_HOST:-localhost}"
  NODE_ENV="${NODE_ENV:-development}"
fi

CLIENT_PORT="${CLIENT_PORT:-3000}"
SERVER_PORT="${SERVER_PORT:-4000}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
REDIS_PORT="${REDIS_PORT:-6379}"
POSTGRES_DB="${POSTGRES_DB:-appifylab}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
SESSION_COOKIE_NAME="${SESSION_COOKIE_NAME:-appifylab.sid}"
SESSION_MAX_AGE_MS="${SESSION_MAX_AGE_MS:-604800000}"
UPLOAD_DIR="${UPLOAD_DIR:-uploads}"

if [[ -z "${SESSION_SECRET:-}" ]]; then
  SESSION_SECRET="$(openssl rand -hex 32)"
fi

CLIENT_ORIGIN="${CLIENT_ORIGIN:-http://${PUBLIC_HOST}:${CLIENT_PORT}}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://${PUBLIC_HOST}:${SERVER_PORT}/api}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}}"
REDIS_URL="${REDIS_URL:-redis://redis:6379}"

mkdir -p "$PROJECT_DIR/server/uploads"

export PUBLIC_HOST
export NODE_ENV
export CLIENT_PORT
export SERVER_PORT
export POSTGRES_PORT
export REDIS_PORT
export POSTGRES_DB
export POSTGRES_USER
export POSTGRES_PASSWORD
export CLIENT_ORIGIN
export NEXT_PUBLIC_API_URL
export DATABASE_URL
export REDIS_URL
export SESSION_SECRET
export SESSION_COOKIE_NAME
export SESSION_MAX_AGE_MS
export UPLOAD_DIR

cat > "$PROJECT_DIR/.env" <<EOF
PUBLIC_HOST=$PUBLIC_HOST
NODE_ENV=$NODE_ENV
CLIENT_PORT=$CLIENT_PORT
SERVER_PORT=$SERVER_PORT
POSTGRES_PORT=$POSTGRES_PORT
REDIS_PORT=$REDIS_PORT
CLIENT_ORIGIN=$CLIENT_ORIGIN
NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
POSTGRES_DB=$POSTGRES_DB
POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URL=$DATABASE_URL
REDIS_URL=$REDIS_URL
SESSION_SECRET=$SESSION_SECRET
SESSION_COOKIE_NAME=$SESSION_COOKIE_NAME
SESSION_MAX_AGE_MS=$SESSION_MAX_AGE_MS
UPLOAD_DIR=$UPLOAD_DIR
EOF

echo "Deploying in ${MODE} mode with:"
echo "  Node env: $NODE_ENV"
echo "  Frontend: $CLIENT_ORIGIN"
echo "  API:      $NEXT_PUBLIC_API_URL"

docker compose pull postgres redis
docker compose up -d --build
docker compose ps

echo
echo "Deployment complete."
echo "Mode:     $MODE"
echo "Frontend: $CLIENT_ORIGIN"
echo "API:      $NEXT_PUBLIC_API_URL"
