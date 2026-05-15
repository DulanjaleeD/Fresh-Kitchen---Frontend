import { client } from '../api/client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../../type/auth';

export const authGateway = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await client.post<AuthResponse>('/auth/signup', payload);
    return response.data;
  },
};
