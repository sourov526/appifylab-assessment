import type {
  AuthResponse,
  CommentLikeState,
  CreateCommentInput,
  CreatePostInput,
  CreateReplyInput,
  FeedPost,
  LoginInput,
  PagedPostsResponse,
  RegisterInput,
  ReplyLikeState
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const API_ORIGIN = new URL(API_BASE_URL).origin;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown>;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json()) as { message?: string } & T;

  if (!response.ok) {
    throw new ApiError(data.message ?? "Request failed", response.status);
  }

  return data as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {})
    },
    body:
      body && !isFormData && typeof body !== "string"
        ? JSON.stringify(body)
        : (body as BodyInit | undefined)
  });

  return parseResponse<T>(response);
}

export function resolveApiAssetUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function register(payload: RegisterInput) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload
  });
}

export function login(payload: LoginInput) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export function logout() {
  return apiRequest<void>("/auth/logout", {
    method: "POST"
  });
}

export function getMe() {
  return apiRequest<AuthResponse>("/auth/me");
}

export function getPosts() {
  return apiRequest<PagedPostsResponse>("/posts");
}

export async function createPost(payload: CreatePostInput) {
  const formData = new FormData();
  formData.append("content", payload.content);
  formData.append("visibility", payload.visibility);
  if (payload.image) {
    formData.append("image", payload.image);
  }

  return apiRequest<{ post: FeedPost }>("/posts", {
    method: "POST",
    body: formData
  });
}

export function likePost(postId: string) {
  return apiRequest<Pick<FeedPost, "likesCount" | "likedByMe" | "likers">>(`/posts/${postId}/likes`, {
    method: "POST"
  });
}

export function unlikePost(postId: string) {
  return apiRequest<Pick<FeedPost, "likesCount" | "likedByMe" | "likers">>(`/posts/${postId}/likes`, {
    method: "DELETE"
  });
}

export function createComment(postId: string, payload: CreateCommentInput) {
  return apiRequest<{ comment: FeedPost["comments"][number] }>(`/posts/${postId}/comments`, {
    method: "POST",
    body: payload
  });
}

export function createReply(commentId: string, payload: CreateReplyInput) {
  return apiRequest<{ reply: FeedPost["comments"][number]["replies"][number] }>(
    `/comments/${commentId}/replies`,
    {
      method: "POST",
      body: payload
    }
  );
}

export function likeComment(commentId: string) {
  return apiRequest<CommentLikeState>(`/comments/${commentId}/likes`, {
    method: "POST"
  });
}

export function unlikeComment(commentId: string) {
  return apiRequest<CommentLikeState>(`/comments/${commentId}/likes`, {
    method: "DELETE"
  });
}

export function likeReply(replyId: string) {
  return apiRequest<ReplyLikeState>(`/comments/replies/${replyId}/likes`, {
    method: "POST"
  });
}

export function unlikeReply(replyId: string) {
  return apiRequest<ReplyLikeState>(`/comments/replies/${replyId}/likes`, {
    method: "DELETE"
  });
}
