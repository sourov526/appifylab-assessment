import path from "node:path";
import cors from "cors";
import express from "express";
import session from "express-session";
import { authRouter } from "./modules/auth/auth.routes.js";
import { commentsRouter } from "./modules/comments/comments.routes.js";
import { postsRouter } from "./modules/posts/posts.routes.js";
import { env } from "./config/env.js";
import { sessionStore } from "./config/redis.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: env.SESSION_COOKIE_NAME,
    store: sessionStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.SESSION_COOKIE_SECURE,
      sameSite: "lax",
      maxAge: env.SESSION_MAX_AGE_MS
    }
  })
);

app.use("/uploads", express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);

app.use(errorMiddleware);
