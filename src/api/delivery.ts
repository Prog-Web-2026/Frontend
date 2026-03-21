import { api } from './client';
import type { Order, OrderStatsResponse } from '../types';

export const deliveryApi = {
  getAvailable: () =>
    api.get<{ orders: Order[] }>('/orders/delivery/available'),

  getMyDeliveries: () =>
    api.get<{ orders: Order[] }>('/orders/delivery/my-deliveries'),

  acceptDelivery: (id: number) =>
    api.post<{ message: string; order: Order }>(`/orders/delivery/${id}/accept`),

  confirmPickup: (id: number) =>
    api.patch<{ message: string; order: Order }>(`/orders/delivery/${id}/pickup`),

  getStats: () =>
    api.get<OrderStatsResponse>('/orders/stats'),
};
