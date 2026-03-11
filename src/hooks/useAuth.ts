import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authApi } from '../api/auth';
import { useAuthStore } from '../stores/authStore';
import type { LoginFormData } from '../schemas/auth';
import { UserRole } from '../types';

export function useLogin(userType: 'customer' | 'delivery' = 'customer') {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) =>
      userType === 'delivery' ? authApi.deliveryLogin(data) : authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
      if (data.user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else if (data.user.role === UserRole.DELIVERY) {
        navigate('/delivery');
      } else {
        navigate('/');
      }
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao fazer login', { variant: 'error' });
    },
  });
}

export function useRegister(userType: 'customer' | 'delivery' = 'customer') {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string; phone?: string }) => {
      if (userType === 'delivery') {
        return authApi.deliveryRegister({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone!,
        });
      }
      return authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    },
    onSuccess: () => {
      enqueueSnackbar('Conta criada com sucesso! Faça login.', { variant: 'success' });
      navigate('/login');
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao criar conta', { variant: 'error' });
    },
  });
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.getMe(),
    enabled: isAuthenticated,
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      enqueueSnackbar('Logout realizado', { variant: 'info' });
      navigate('/login');
    },
    onError: () => {
      clearAuth();
      navigate('/login');
    },
  });
}
