import type { Request, Response } from "express";
import { createReply, toggleCommentLike, toggleReplyLike } from "./comments.service.js";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : (value ?? "");
}

export async function createReplyController(request: Request, response: Response) {
  const reply = await createReply(getRouteParam(request.params.commentId), request.session.userId!, request.body.content);
  response.status(201).json({ reply });
}

export async function likeCommentController(request: Request, response: Response) {
  const result = await toggleCommentLike(getRouteParam(request.params.commentId), request.session.userId!, true);
  response.json(result);
}

export async function unlikeCommentController(request: Request, response: Response) {
  const result = await toggleCommentLike(getRouteParam(request.params.commentId), request.session.userId!, false);
  response.json(result);
}

export async function likeReplyController(request: Request, response: Response) {
  const result = await toggleReplyLike(getRouteParam(request.params.replyId), request.session.userId!, true);
  response.json(result);
}

export async function unlikeReplyController(request: Request, response: Response) {
  const result = await toggleReplyLike(getRouteParam(request.params.replyId), request.session.userId!, false);
  response.json(result);
}
