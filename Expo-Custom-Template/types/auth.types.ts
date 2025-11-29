
export interface SignInProps {
  success: boolean
  message: string
  user: User
  token: string
}

export interface User {
  _id: string
  name: string
  email: string
  password: string
  avatar: string
  bookmarkedPrompts: any[]
  createdAt: string
  updatedAt: string
  __v: number
  id: string
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}