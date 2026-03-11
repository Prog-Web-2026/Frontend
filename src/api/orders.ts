import { api } from './client';
import type { Order, OrderStatsResponse, OrderStatus, PaymentType } from '../types';

interface OrderFilters {
  status?: string;
  limit?: number;
  offset?: number;
}

function buildQuery(filters: OrderFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.offset !== undefined) params.set('offset', String(filters.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const ordersApi = {
  getAll: (filters: OrderFilters = {}) =>
    api.get<{ orders: Order[] }>(`/orders/all${buildQuery(filters)}`),

  getById: (id: number) =>
    api.get<{ order: Order }>(`/orders/${id}`),

  updateStatus: (id: number, status: OrderStatus) =>
    api.patch<{ message: string; order: Order }>(`/orders/${id}/status`, { status }),

  getStats: () =>
    api.get<OrderStatsResponse>('/orders/stats'),

  delete: (id: number) =>
    api.del<void>(`/orders/${id}`),

  processPayment: (orderId: number, type: PaymentType) =>
    api.post<{ message: string; payment: unknown }>(`/orders/${orderId}/payment`, { type }),
};
