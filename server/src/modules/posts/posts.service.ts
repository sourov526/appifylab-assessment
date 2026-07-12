import type { Visibility } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { AppError } from "../../utils/app-error.js";
import { mapPost } from "../../utils/post-transform.js";
import { toPublicUploadPath } from "../uploads/upload.js";

type CreatePostInput = {
  content: string;
  visibility: Visibility;
  imageFilename?: string;
  authorId: string;
};

async function fetchPostOrThrow(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
}

export async function listVisiblePosts(userId: string, cursor: string | undefined, take: number) {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ visibility: "PUBLIC" }, { authorId: userId }]
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor }
        }
      : {}),
    include: {
      author: true,
      likes: { include: { user: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          author: true,
          likes: { include: { user: true } },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: true,
              likes: { include: { user: true } }
            }
          }
        }
      }
    }
  });

  return {
    posts: posts.map((post) => mapPost(post, userId)),
    nextCursor: posts.length === take ? posts[posts.length - 1]?.id : null
  };
}

export async function createPost(input: CreatePostInput) {
  const post = await prisma.post.create({
    data: {
      authorId: input.authorId,
      content: input.content,
      visibility: input.visibility,
      imageUrl: input.imageFilename ? toPublicUploadPath(input.imageFilename) : null
    },
    include: {
      author: true,
      likes: { include: { user: true } },
      comments: {
        include: {
          author: true,
          likes: { include: { user: true } },
          replies: {
            include: {
              author: true,
              likes: { include: { user: true } }
            }
          }
        }
      }
    }
  });

  return mapPost(post, input.authorId);
}

export async function togglePostLike(postId: string, userId: string, shouldLike: boolean) {
  const post = await fetchPostOrThrow(postId);

  if (post.visibility === "PRIVATE" && post.authorId !== userId) {
    throw new AppError("Post not found", 404);
  }

  if (shouldLike) {
    await prisma.postLike.upsert({
      where: {
        postId_userId: { postId, userId }
      },
      update: {},
      create: { postId, userId }
    });
  } else {
    await prisma.postLike.deleteMany({
      where: { postId, userId }
    });
  }

  const likers = await prisma.postLike.findMany({
    where: { postId },
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

export async function createComment(postId: string, userId: string, content: string) {
  const post = await fetchPostOrThrow(postId);

  if (post.visibility === "PRIVATE" && post.authorId !== userId) {
    throw new AppError("Post not found", 404);
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: userId,
      content
    },
    include: {
      author: true,
      likes: { include: { user: true } },
      replies: {
        include: {
          author: true,
          likes: { include: { user: true } }
        }
      }
    }
  });

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    author: {
      id: comment.author.id,
      firstName: comment.author.firstName,
      lastName: comment.author.lastName,
      email: comment.author.email
    },
    likesCount: 0,
    likedByMe: false,
    likers: [],
    replies: []
  };
}
