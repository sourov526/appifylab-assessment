export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Visibility = "PUBLIC" | "PRIVATE";

export type FeedPost = {
  id: string;
  content: string;
  imageUrl?: string | null;
  visibility: Visibility;
  createdAt: string;
  author: AuthUser;
};
