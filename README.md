# Appifylab Assessment

This project has 2 main parts:

- `client/` - Next.js frontend
- `server/` - Express API

It also uses:

- `prisma/` - Prisma schema
- PostgreSQL
- Redis
- Docker Compose

## Features

- Session-based authentication
- Protected feed route
- Public and private posts
- Image upload for posts
- Post likes and liker lists
- Comments, replies, and like/unlike on both

## Routes

- `/login`
- `/register`
- `/feed`

## Project Structure

```text
appifylab_assessment/
├─ client/
├─ server/
├─ prisma/
├─ .env.local
├─ .env.production
├─ docker-compose.yml
└─ deploy.sh
```

## Environment Files

Use these real env files:

- `.env.local`
- `.env.production`

Example files are included:

- `.env.local.example`
- `.env.production.example`

Update the real env files before running the project.

## Local Development

### 1. Install dependencies

From the project root:

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Check local env

Review:

```bash
.env.local
```

Important local defaults:

- frontend: `http://localhost:3000`
- api: `http://localhost:4000/api`
- postgres: `localhost:5432`
- redis: `localhost:6379`

### 3. Start the full local project

The easiest way:

```bash
bash deploy.sh --local
```

This script will:

- start PostgreSQL and Redis
- wait for PostgreSQL
- run Prisma generate
- run Prisma migrate
- build and start the containers

### 4. Open the app

- frontend: `http://localhost:3000`
- api health: `http://localhost:4000/api/health`

## Local Prisma Commands

Run these from the project root:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

Prisma Studio opens at:

```text
http://localhost:5555
```

## Production Deployment

### 1. Update production env

Review:

```bash
.env.production
```

Set the correct values for:

- `PUBLIC_HOST`
- `CLIENT_ORIGIN`
- `NEXT_PUBLIC_API_URL`
- `SESSION_SECRET`

### 2. Run production deploy

```bash
bash deploy.sh --production
```

This will:

- start PostgreSQL and Redis
- build and start the containers

Note:

- production uses Prisma `migrate deploy` inside the server container
- local uses Prisma `migrate dev`

## Useful Commands

Build all containers:

```bash
docker compose --env-file .env.local build
```

Stop containers:

```bash
docker compose --env-file .env.local down
```

## Notes

- The auth pages follow the provided design.
- The feed keeps the provided design while using the backend features.
- Uploaded images are served from the Express server under `/uploads`.
- For now I uploaded images to the `/uploads`. but in real production this can be uploade AWS S3 or other cloud store
