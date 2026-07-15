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
├─ .env.local
├─ .env.production
└─ docker-compose.yml
```

## Local Setup

1. Review `.env.local` and update values if needed.
2. Start PostgreSQL and Redis:

```bash
docker compose --env-file .env.local up -d
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
cd ..
cd appifylab_assessment
npm run prisma:generate
npm run prisma:migrate
```

Prisma Studio:

```bash
cd /Users/sourov/Downloads/Appifylab/appifylab_assessment
npm run prisma:studio
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

## Deployment

- Local Docker deploy:

```bash
bash deploy.sh --local
```

- Production Docker deploy:

```bash
bash deploy.sh --production
```

## Available Pages

- `/login`
- `/register`
- `/feed`

## Notes

- The frontend keeps the provided auth-page design and uses a simpler functional feed layout.
- The feed only shows private posts to the author.
- Uploaded images are served from the Express server under `/uploads`.
