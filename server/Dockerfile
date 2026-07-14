FROM node:20-bookworm-slim AS deps
WORKDIR /app/server
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY server/package.json server/package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY prisma ./prisma
COPY server ./server
WORKDIR /app/server
RUN npx prisma generate --schema ../prisma/schema.prisma
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY prisma ./prisma
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/server/package-lock.json ./server/package-lock.json
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist
RUN mkdir -p /app/server/uploads
WORKDIR /app/server
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy --schema ../prisma/schema.prisma && node dist/server.js"]
