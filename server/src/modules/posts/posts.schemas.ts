import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  visibility: z.enum(["PUBLIC", "PRIVATE"])
});

export const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000)
});

export const listPostsQuerySchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().min(1).max(50).default(20)
});
