# Appifylab Assessment

Full-stack implementation using:

- `client/`: Next.js frontend
- `server/`: Express API with session-based auth
- `prisma/`: Prisma schema for PostgreSQL
- `docker-compose.yml`: PostgreSQL and Redis services

## Features

- Session-based authentication
- Protected feed route
- Public and private posts
- Image upload for posts
- Post likes and liker lists
- Comments, replies, and like/unlike on both

## Project Structure

```text
appifylab_assessment/
├─ client/
├─ server/
├─ prisma/
├─ .env.example
└─ docker-compose.yml
```

## Local Setup

1. Copy `.env.example` to `.env` and update values if needed.
2. Start PostgreSQL and Redis:

```bash
docker compose up -d
```

3. Install client dependencies:

```bash
cd client
npm install
```

4. Install server dependencies:

```bash
cd ../server
npm install
```

5. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Start the API server:

```bash
npm run dev
```

7. In a second terminal, start the frontend:

```bash
cd ../client
npm run dev
```

8. Open `http://localhost:3000`

## Available Pages

- `/login`
- `/register`
- `/feed`

## Notes

- The frontend keeps the provided auth-page design and uses a simpler functional feed layout.
- The feed only shows private posts to the author.
- Uploaded images are served from the Express server under `/uploads`.
