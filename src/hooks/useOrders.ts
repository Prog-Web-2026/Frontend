import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { ordersApi } from '../api/orders';
import { queryClient } from '../lib/queryClient';
import type { OrderStatus, PaymentType } from '../types';

export function useOrders(filters: { status?: string } = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getAll(filters),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: () => ordersApi.getStats(),
  });
}

export function useDeleteOrder() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      enqueueSnackbar('Pedido excluído com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao excluir pedido', { variant: 'error' });
    },
  });
}

export function useProcessPayment() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ orderId, type }: { orderId: number; type: PaymentType }) =>
      ordersApi.processPayment(orderId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      enqueueSnackbar('Pagamento realizado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao processar pagamento', { variant: 'error' });
    },
  });
}

export function useUpdateOrderStatus() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Status do pedido atualizado!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao atualizar status', { variant: 'error' });
    },
  });
}
