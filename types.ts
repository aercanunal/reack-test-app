export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown-like content
  imageUrl: string;
  createdAt: string;
  author: User;
  tags: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}