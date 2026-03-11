import { api } from './client';
import type { Category } from '../types';

export const categoriesApi = {
  getAll: (includeInactive = true) =>
    api.get<{ categories: Category[] }>(`/categories?includeInactive=${includeInactive}`),

  getById: (id: number) =>
    api.get<{ category: Category }>(`/categories/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post<{ message: string; category: Category }>('/categories', data),

  update: (id: number, data: { name?: string; description?: string }) =>
    api.put<{ message: string; category: Category }>(`/categories/${id}`, data),

  delete: (id: number) =>
    api.del<void>(`/categories/${id}`),

  toggleStatus: (id: number, isActive: boolean) =>
    api.patch<{ message: string; category: Category }>(`/categories/${id}/status`, { isActive }),
};
