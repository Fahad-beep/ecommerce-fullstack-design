export type AuthRole = 'admin';

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  role: AuthRole;
}

export interface AuthPayload extends AuthUser {
  type: 'access' | 'refresh';
}

export interface AuthTokens {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
