export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Visibility = "PUBLIC" | "PRIVATE";

export type LikeUser = AuthUser;

export type Reply = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: AuthUser;
  likesCount: number;
  likedByMe: boolean;
  likers: LikeUser[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: AuthUser;
  likesCount: number;
  likedByMe: boolean;
  likers: LikeUser[];
  replies: Reply[];
};

export type FeedPost = {
  id: string;
  content: string;
  imageUrl: string | null;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  author: AuthUser;
  likesCount: number;
  likedByMe: boolean;
  likers: LikeUser[];
  comments: Comment[];
};

export type AuthResponse = {
  user: AuthUser;
};

export type PagedPostsResponse = {
  posts: FeedPost[];
  nextCursor: string | null;
};

export type RegisterInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type CreatePostInput = {
  content: string;
  visibility: Visibility;
  image?: File | null;
};

export type CreateCommentInput = {
  content: string;
};

export type CreateReplyInput = {
  content: string;
};

export type CommentLikeState = Pick<Comment, "likesCount" | "likedByMe" | "likers">;
export type ReplyLikeState = Pick<Reply, "likesCount" | "likedByMe" | "likers">;
