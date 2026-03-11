import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { paymentsApi } from '../api/payments';
import { queryClient } from '../lib/queryClient';

export function usePaymentByOrder(orderId: number) {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: () => paymentsApi.getByOrderId(orderId),
    enabled: !!orderId,
  });
}

export function useRefundPayment() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => paymentsApi.refund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      enqueueSnackbar('Reembolso realizado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao realizar reembolso', { variant: 'error' });
    },
  });
}
