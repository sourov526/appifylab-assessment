import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/app-error.js";

async function getCommentOrThrow(commentId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true
    }
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  return comment;
}

async function getReplyOrThrow(replyId: string) {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: {
      comment: {
        include: {
          post: true
        }
      }
    }
  });

  if (!reply) {
    throw new AppError("Reply not found", 404);
  }

  return reply;
}

function ensureVisible(ownerId: string, viewerId: string, visibility: "PUBLIC" | "PRIVATE") {
  if (visibility === "PRIVATE" && ownerId !== viewerId) {
    throw new AppError("Content not found", 404);
  }
}

export async function createReply(commentId: string, userId: string, content: string) {
  const comment = await getCommentOrThrow(commentId);
  ensureVisible(comment.post.authorId, userId, comment.post.visibility);

  const reply = await prisma.reply.create({
    data: {
      commentId,
      authorId: userId,
      content
    },
    include: {
      author: true
    }
  });

  return {
    id: reply.id,
    content: reply.content,
    createdAt: reply.createdAt.toISOString(),
    updatedAt: reply.updatedAt.toISOString(),
    author: {
      id: reply.author.id,
      firstName: reply.author.firstName,
      lastName: reply.author.lastName,
      email: reply.author.email
    },
    likesCount: 0,
    likedByMe: false,
    likers: []
  };
}

export async function toggleCommentLike(commentId: string, userId: string, shouldLike: boolean) {
  const comment = await getCommentOrThrow(commentId);
  ensureVisible(comment.post.authorId, userId, comment.post.visibility);

  if (shouldLike) {
    await prisma.commentLike.upsert({
      where: {
        commentId_userId: { commentId, userId }
      },
      update: {},
      create: { commentId, userId }
    });
  } else {
    await prisma.commentLike.deleteMany({
      where: { commentId, userId }
    });
  }

  const likers = await prisma.commentLike.findMany({
    where: { commentId },
    include: { user: true }
  });

  return {
    likesCount: likers.length,
    likedByMe: shouldLike,
    likers: likers.map((like) => ({
      id: like.user.id,
      firstName: like.user.firstName,
      lastName: like.user.lastName,
      email: like.user.email
    }))
  };
}

export async function toggleReplyLike(replyId: string, userId: string, shouldLike: boolean) {
  const reply = await getReplyOrThrow(replyId);
  ensureVisible(reply.comment.post.authorId, userId, reply.comment.post.visibility);

  if (shouldLike) {
    await prisma.replyLike.upsert({
      where: {
        replyId_userId: { replyId, userId }
      },
      update: {},
      create: { replyId, userId }
    });
  } else {
    await prisma.replyLike.deleteMany({
      where: { replyId, userId }
    });
  }

  const likers = await prisma.replyLike.findMany({
    where: { replyId },
    include: { user: true }
  });

  return {
    likesCount: likers.length,
    likedByMe: shouldLike,
    likers: likers.map((like) => ({
      id: like.user.id,
      firstName: like.user.firstName,
      lastName: like.user.lastName,
      email: like.user.email
    }))
  };
}
