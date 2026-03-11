import { api } from './client';
import type { Payment } from '../types';

export const paymentsApi = {
  getByOrderId: (orderId: number) =>
    api.get<{ payment: Payment }>(`/payments/order/${orderId}`),

  refund: (id: number) =>
    api.post<{ message: string; payment: Payment }>(`/payments/${id}/refund`),
};
