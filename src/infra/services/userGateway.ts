import { client } from '../api/client';
import type { UserProfile } from '../../type/types';

export const userGateway = {
  async findByEmail(email: string): Promise<UserProfile | null> {
    const response = await client.get<UserProfile[]>('/users');
    return response.data.find((user) => user.email === email) ?? null;
  },
};
