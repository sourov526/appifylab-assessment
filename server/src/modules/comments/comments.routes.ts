import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createCommentSchema } from "../posts/posts.schemas.js";
import {
  createReplyController,
  likeCommentController,
  likeReplyController,
  unlikeCommentController,
  unlikeReplyController
} from "./comments.controller.js";

export const commentsRouter = Router();

commentsRouter.use(requireAuth);

commentsRouter.post("/:commentId/replies", validate(createCommentSchema), asyncHandler(createReplyController));
commentsRouter.post("/:commentId/likes", asyncHandler(likeCommentController));
commentsRouter.delete("/:commentId/likes", asyncHandler(unlikeCommentController));
commentsRouter.post("/replies/:replyId/likes", asyncHandler(likeReplyController));
commentsRouter.delete("/replies/:replyId/likes", asyncHandler(unlikeReplyController));
