import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { productsApi } from '../api/products';
import { queryClient } from '../lib/queryClient';

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (formData: FormData) => productsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Produto criado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao criar produto', { variant: 'error' });
    },
  });
}

export function useUpdateProduct() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      productsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Produto atualizado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao atualizar produto', { variant: 'error' });
    },
  });
}

export function useDeleteProduct() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Produto excluído com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao excluir produto', { variant: 'error' });
    },
  });
}

export function useUpdateStock() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; quantity: number; operation: 'add' | 'subtract' | 'set' }) =>
      productsApi.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Estoque atualizado!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao atualizar estoque', { variant: 'error' });
    },
  });
}
