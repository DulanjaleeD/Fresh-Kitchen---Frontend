import { client } from '../api/client';
import type { Payment, PaymentStatus } from '../../type/types';

export const paymentGateway = {
  async byOrder(orderId: number): Promise<Payment> {
    const response = await client.get<Payment>(`/payments/orders/${orderId}`);
    return response.data;
  },
  async createPending(orderId: number): Promise<Payment> {
    const response = await client.post<Payment>(`/payments/orders/${orderId}`);
    return response.data;
  },
  async updateStatus(paymentId: number, status: PaymentStatus): Promise<Payment> {
    const response = await client.patch<Payment>(`/payments/${paymentId}/status`, undefined, {
      params: { status },
    });
    return response.data;
  },
};
