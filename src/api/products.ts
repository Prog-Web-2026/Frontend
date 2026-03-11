import { api } from './client';
import type { Product } from '../types';

interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

function buildQuery(filters: ProductFilters): string {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set('categoryId', String(filters.categoryId));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.inStock !== undefined) params.set('inStock', String(filters.inStock));
  if (filters.search) params.set('search', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const productsApi = {
  getAll: (filters: ProductFilters = {}) =>
    api.get<Product[]>(`/products${buildQuery(filters)}`),

  getById: (id: number) =>
    api.get<Product>(`/products/${id}`),

  create: (formData: FormData) =>
    api.post<{ message: string; product: Product }>('/products', formData),

  update: (id: number, formData: FormData) =>
    api.put<{ message: string; product: Product }>(`/products/${id}`, formData),

  delete: (id: number) =>
    api.del<void>(`/products/${id}`),

  updateStock: (id: number, data: { quantity: number; operation: 'add' | 'subtract' | 'set' }) =>
    api.patch<{ message: string; product: Product }>(`/products/${id}/stock`, data),

  uploadImage: (id: number, formData: FormData) =>
    api.post<{ message: string; product: Product }>(`/products/${id}/image`, formData),
};
