import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { categoriesApi } from '../api/categories';
import { queryClient } from '../lib/queryClient';
import type { CategoryFormData } from '../schemas/category';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(true),
  });
}

export function useActiveCategories() {
  return useQuery({
    queryKey: ['categories', 'active'],
    queryFn: () => categoriesApi.getAll(false),
  });
}

export function useCreateCategory() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (data: CategoryFormData) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      enqueueSnackbar('Categoria criada com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao criar categoria', { variant: 'error' });
    },
  });
}

export function useUpdateCategory() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & CategoryFormData) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      enqueueSnackbar('Categoria atualizada com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao atualizar categoria', { variant: 'error' });
    },
  });
}

export function useDeleteCategory() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      enqueueSnackbar('Categoria excluída com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao excluir categoria', { variant: 'error' });
    },
  });
}

export function useToggleCategoryStatus() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      categoriesApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      enqueueSnackbar('Status da categoria atualizado!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao alterar status', { variant: 'error' });
    },
  });
}
