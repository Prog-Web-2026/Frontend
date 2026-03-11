import { api } from './client';
import type { ProductReview } from '../types';

export const reviewsApi = {
  getRecent: (limit = 20) =>
    api.get<ProductReview[]>(`/reviews/admin/recent?limit=${limit}`),

  toggleStatus: (id: number, isActive: boolean) =>
    api.patch<ProductReview>(`/reviews/admin/${id}/status`, { isActive }),

  create: (productId: number, data: { rating: number; comment?: string }) =>
    api.post<ProductReview>(`/reviews/product/${productId}`, data),

  getMyReviews: () =>
    api.get<{ reviews: ProductReview[]; total: number; stats: unknown }>('/reviews/user/me?limit=100'),
};
