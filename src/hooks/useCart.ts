import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { cartApi } from '../api/cart';
import { queryClient } from '../lib/queryClient';
import { useAuthStore } from '../stores/authStore';

export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      enqueueSnackbar('Produto adicionado ao carrinho!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao adicionar ao carrinho', { variant: 'error' });
    },
  });
}

export function useUpdateCartItem() {
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      enqueueSnackbar('Item removido do carrinho', { variant: 'info' });
    },
  });
}

export function useCheckout() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (selectedCartItemIds: number[]) => cartApi.checkout(selectedCartItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao finalizar compra', { variant: 'error' });
    },
  });
}
