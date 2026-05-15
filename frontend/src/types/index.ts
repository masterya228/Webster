export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

export interface Design {
  id: string;
  title: string;
  thumbnail?: string;
  canvasData: object;
  width: number;
  height: number;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail?: string;
  canvasData: object;
  width: number;
  height: number;
  userId?: string;     // null/undefined = system template; set = user template
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
