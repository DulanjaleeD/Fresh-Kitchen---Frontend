import type { UserRole } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
}
