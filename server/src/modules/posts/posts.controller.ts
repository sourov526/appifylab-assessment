import type { Request, Response } from "express";
import { createComment, createPost, listVisiblePosts, togglePostLike } from "./posts.service.js";
import { createPostSchema } from "./posts.schemas.js";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : (value ?? "");
}

export async function listPostsController(request: Request, response: Response) {
  const data = await listVisiblePosts(
    request.session.userId!,
    typeof request.query.cursor === "string" ? request.query.cursor : undefined,
    Number(request.query.take ?? 20)
  );

  response.json(data);
}

export async function createPostController(request: Request, response: Response) {
  const payload = createPostSchema.parse({
    content: request.body.content,
    visibility: request.body.visibility
  });

  const post = await createPost({
    authorId: request.session.userId!,
    content: payload.content,
    visibility: payload.visibility,
    imageFilename: request.file?.filename
  });

  response.status(201).json({ post });
}

export async function likePostController(request: Request, response: Response) {
  const result = await togglePostLike(getRouteParam(request.params.postId), request.session.userId!, true);
  response.json(result);
}

export async function unlikePostController(request: Request, response: Response) {
  const result = await togglePostLike(getRouteParam(request.params.postId), request.session.userId!, false);
  response.json(result);
}

export async function createCommentController(request: Request, response: Response) {
  const comment = await createComment(getRouteParam(request.params.postId), request.session.userId!, request.body.content);
  response.status(201).json({ comment });
}
