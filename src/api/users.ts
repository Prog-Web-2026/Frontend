import { api } from './client';
import type { User } from '../types';

interface UserFilters {
  role?: string;
  isActive?: string;
}

function buildQuery(filters: UserFilters): string {
  const params = new URLSearchParams();
  if (filters.role) params.set('role', filters.role);
  if (filters.isActive !== undefined) params.set('isActive', filters.isActive);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const usersApi = {
  getAll: (filters: UserFilters = {}) =>
    api.get<User[]>(`/users${buildQuery(filters)}`),

  toggleStatus: (id: number, isActive: boolean) =>
    api.patch<{ message: string; user: User }>(`/users/${id}/status`, { isActive }),
};
