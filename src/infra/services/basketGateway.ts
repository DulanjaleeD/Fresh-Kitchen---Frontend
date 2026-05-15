import { client } from '../api/client';
import type { Basket } from '../../type/types';

export const basketGateway = {
  async fetch(userId: string): Promise<Basket> {
    const response = await client.get<Basket>(`/carts/${userId}`);
    return response.data;
  },
  async add(userId: string, foodItemId: number, quantity: number): Promise<Basket> {
    const response = await client.post<Basket>(`/carts/${userId}/items`, { foodItemId, quantity });
    return response.data;
  },
  async update(userId: string, cartItemId: number, quantity: number): Promise<Basket> {
    const response = await client.put<Basket>(`/carts/${userId}/items/${cartItemId}`, { quantity });
    return response.data;
  },
  async remove(userId: string, cartItemId: number): Promise<Basket> {
    const response = await client.delete<Basket>(`/carts/${userId}/items/${cartItemId}`);
    return response.data;
  },
  async clear(userId: string): Promise<Basket> {
    const response = await client.delete<Basket>(`/carts/${userId}/items`);
    return response.data;
  },
};
