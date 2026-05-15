import { client } from '../api/client';
import type { Order, OrderStatus } from '../../type/types';

export const orderGateway = {
  async checkout(userId: string): Promise<Order> {
    const response = await client.post<Order>(`/orders/checkout/${userId}`);
    return response.data;
  },
  async byUser(userId: string): Promise<Order[]> {
    const response = await client.get<Order[]>(`/orders/users/${userId}`);
    return response.data;
  },
  async all(): Promise<Order[]> {
    const response = await client.get<Order[]>('/orders');
    return response.data;
  },
  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const response = await client.patch<Order>(`/orders/${orderId}/status`, undefined, {
      params: { status },
    });
    return response.data;
  },
};
