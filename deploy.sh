#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

MODE=""
MODE_ENV_FILE=""

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

if [[ "$MODE" == "production" ]]; then
  MODE_ENV_FILE="$PROJECT_DIR/.env.production"
else
  MODE_ENV_FILE="$PROJECT_DIR/.env.local"
fi

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command docker
require_command openssl

if [[ "$MODE" == "local" ]]; then
  require_command npm
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Docker Compose is not available. Install either 'docker compose' or 'docker-compose'." >&2
  exit 1
fi

run_compose() {
  if [[ "$COMPOSE_CMD" == "docker compose" ]]; then
    docker compose --env-file "$MODE_ENV_FILE" "$@"
  else
    docker-compose --env-file "$MODE_ENV_FILE" "$@"
  fi
}

wait_for_postgres() {
  local retries=30

  until run_compose exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
    retries=$((retries - 1))

    if (( retries == 0 )); then
      echo "PostgreSQL did not become ready in time." >&2
      exit 1
    fi

    sleep 2
  done
}

if [[ -f "$MODE_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$MODE_ENV_FILE"
  set +a
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
CLIENT_BIND_IP="${CLIENT_BIND_IP:-0.0.0.0}"
SERVER_BIND_IP="${SERVER_BIND_IP:-0.0.0.0}"
POSTGRES_BIND_IP="${POSTGRES_BIND_IP:-127.0.0.1}"
REDIS_BIND_IP="${REDIS_BIND_IP:-127.0.0.1}"
POSTGRES_DB="${POSTGRES_DB:-appifylab}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
SESSION_COOKIE_NAME="${SESSION_COOKIE_NAME:-appifylab.sid}"
SESSION_COOKIE_SECURE="${SESSION_COOKIE_SECURE:-false}"
SESSION_MAX_AGE_MS="${SESSION_MAX_AGE_MS:-604800000}"
UPLOAD_DIR="${UPLOAD_DIR:-uploads}"

if [[ -z "${SESSION_SECRET:-}" ]]; then
  SESSION_SECRET="$(openssl rand -hex 32)"
fi

CLIENT_ORIGIN="${CLIENT_ORIGIN:-http://${PUBLIC_HOST}:${CLIENT_PORT}}"
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://${PUBLIC_HOST}:${SERVER_PORT}/api}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}}"
REDIS_URL="${REDIS_URL:-redis://localhost:${REDIS_PORT}}"

mkdir -p "$PROJECT_DIR/server/uploads"

export PUBLIC_HOST
export NODE_ENV
export CLIENT_PORT
export SERVER_PORT
export POSTGRES_PORT
export REDIS_PORT
export CLIENT_BIND_IP
export SERVER_BIND_IP
export POSTGRES_BIND_IP
export REDIS_BIND_IP
export POSTGRES_DB
export POSTGRES_USER
export POSTGRES_PASSWORD
export CLIENT_ORIGIN
export NEXT_PUBLIC_API_URL
export DATABASE_URL
export REDIS_URL
export SESSION_SECRET
export SESSION_COOKIE_NAME
export SESSION_COOKIE_SECURE
export SESSION_MAX_AGE_MS
export UPLOAD_DIR

echo "Deploying in ${MODE} mode with:"
echo "  Node env: $NODE_ENV"
echo "  Env file: $MODE_ENV_FILE"
echo "  Frontend: $CLIENT_ORIGIN"
echo "  API:      $NEXT_PUBLIC_API_URL"

run_compose pull postgres redis
run_compose up -d postgres redis
wait_for_postgres

if [[ "$MODE" == "local" ]]; then
  npm run prisma:generate
  npm run prisma:migrate
fi

run_compose up -d --build
run_compose ps

echo
echo "Deployment complete."
echo "Mode:     $MODE"
echo "Frontend: $CLIENT_ORIGIN"
echo "API:      $NEXT_PUBLIC_API_URL"
