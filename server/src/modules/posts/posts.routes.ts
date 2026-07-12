import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { upload } from "../uploads/upload.js";
import {
  createCommentController,
  createPostController,
  likePostController,
  listPostsController,
  unlikePostController
} from "./posts.controller.js";
import { createCommentSchema, createPostSchema, listPostsQuerySchema } from "./posts.schemas.js";

export const postsRouter = Router();

postsRouter.use(requireAuth);

postsRouter.get("/", validate(listPostsQuerySchema, "query"), asyncHandler(listPostsController));
postsRouter.post("/", upload.single("image"), asyncHandler(createPostController));
postsRouter.post("/:postId/likes", asyncHandler(likePostController));
postsRouter.delete("/:postId/likes", asyncHandler(unlikePostController));
postsRouter.post("/:postId/comments", validate(createCommentSchema), asyncHandler(createCommentController));
