import { useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryFormData } from '../../../schemas/category';
import { useCreateCategory, useUpdateCategory } from '../../../hooks/useCategories';
import type { Category } from '../../../types';

interface CategoryFormProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

export default function CategoryForm({ open, category, onClose }: CategoryFormProps) {
  const isEditing = !!category;
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? { name: category.name, description: category.description ?? '' }
          : { name: '', description: '' }
      );
    }
  }, [open, category, reset]);

  const onSubmit = (data: CategoryFormData) => {
    if (isEditing) {
      updateCategory.mutate(
        { id: category.id, ...data },
        { onSuccess: () => onClose() }
      );
    } else {
      createCategory.mutate(data, { onSuccess: () => onClose() });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            {...register('description')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createCategory.isPending || updateCategory.isPending}
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
