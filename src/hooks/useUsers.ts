import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { usersApi } from '../api/users';
import { queryClient } from '../lib/queryClient';

export function useUsers(filters: { role?: string; isActive?: string } = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getAll(filters),
  });
}

export function useToggleUserStatus() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      usersApi.toggleStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      enqueueSnackbar('Status do usuário atualizado!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao alterar status', { variant: 'error' });
    },
  });
}
