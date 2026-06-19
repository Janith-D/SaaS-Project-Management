export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: string; // 'WORKSPACE_OWNER' | 'WORKSPACE_ADMIN' | 'PROJECT_MANAGER' | 'MEMBER' | 'VIEWER' | 'PLATFORM_ADMIN'
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserInfo;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}
