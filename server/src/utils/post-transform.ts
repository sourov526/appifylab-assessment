import type {
  Comment,
  CommentLike,
  Post,
  PostLike,
  Reply,
  ReplyLike,
  User
} from "@prisma/client";
import { sanitizeUser } from "./auth.js";

type PostWithRelations = Post & {
  author: User;
  likes: (PostLike & { user: User })[];
  comments: (Comment & {
    author: User;
    likes: (CommentLike & { user: User })[];
    replies: (Reply & {
      author: User;
      likes: (ReplyLike & { user: User })[];
    })[];
  })[];
};

export function mapPost(post: PostWithRelations, currentUserId: string | undefined) {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: sanitizeUser(post.author),
    likesCount: post.likes.length,
    likedByMe: !!currentUserId && post.likes.some((like) => like.userId === currentUserId),
    likers: post.likes.map((like) => sanitizeUser(like.user)),
    comments: post.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      author: sanitizeUser(comment.author),
      likesCount: comment.likes.length,
      likedByMe: !!currentUserId && comment.likes.some((like) => like.userId === currentUserId),
      likers: comment.likes.map((like) => sanitizeUser(like.user)),
      replies: comment.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
        author: sanitizeUser(reply.author),
        likesCount: reply.likes.length,
        likedByMe: !!currentUserId && reply.likes.some((like) => like.userId === currentUserId),
        likers: reply.likes.map((like) => sanitizeUser(like.user))
      }))
    }))
  };
}
