import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { reviewsApi } from '../api/reviews';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types';

export function useRecentReviews(limit = 20) {
  return useQuery({
    queryKey: ['reviews', 'recent', limit],
    queryFn: () => reviewsApi.getRecent(limit),
  });
}

export function useToggleReviewStatus() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      reviewsApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      enqueueSnackbar('Visibilidade da avaliação atualizada!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao alterar visibilidade', { variant: 'error' });
    },
  });
}

export function useMyReviews() {
  const user = useAuthStore((s) => s.user);
  const isCustomer = user?.role === UserRole.CUSTOMER;
  return useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.getMyReviews(),
    enabled: isCustomer,
  });
}

export function useCreateReview() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ productId, rating, comment }: { productId: number; rating: number; comment?: string }) =>
      reviewsApi.create(productId, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Avaliação enviada com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao enviar avaliação', { variant: 'error' });
    },
  });
}
