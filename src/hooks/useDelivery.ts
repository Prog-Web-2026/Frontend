import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { deliveryApi } from '../api/delivery';
import { queryClient } from '../lib/queryClient';

export function useAvailableDeliveries() {
  return useQuery({
    queryKey: ['delivery', 'available'],
    queryFn: () => deliveryApi.getAvailable(),
    refetchInterval: 30000,
  });
}

export function useMyDeliveries() {
  return useQuery({
    queryKey: ['delivery', 'my-deliveries'],
    queryFn: () => deliveryApi.getMyDeliveries(),
    refetchInterval: 30000,
  });
}

export function useAcceptDelivery() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => deliveryApi.acceptDelivery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery'] });
      enqueueSnackbar('Entrega aceita com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao aceitar entrega', { variant: 'error' });
    },
  });
}

export function useMarkDelivered() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => deliveryApi.markDelivered(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery'] });
      enqueueSnackbar('Entrega finalizada!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao finalizar entrega', { variant: 'error' });
    },
  });
}

export function useDeliveryStats() {
  return useQuery({
    queryKey: ['delivery', 'stats'],
    queryFn: () => deliveryApi.getStats(),
  });
}
