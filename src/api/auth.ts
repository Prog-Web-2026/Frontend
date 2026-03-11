import { api } from './client';
import type { LoginResponse, User } from '../types';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', data),

  deliveryLogin: (data: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/delivery/login', data),

  register: (data: { name: string; email: string; password: string }) =>
    api.post<void>('/auth/register', data),

  deliveryRegister: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post<void>('/auth/delivery/register', data),

  getMe: () =>
    api.get<{ user: User }>('/auth/me'),

  refresh: () =>
    api.post<{ token: string }>('/auth/refresh'),

  logout: () =>
    api.post<void>('/auth/logout'),
};
