import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { productSchema, type ProductFormData } from '../../../schemas/product';
import { useProduct, useCreateProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { useActiveCategories } from '../../../hooks/useCategories';
import PageHeader from '../../../components/common/PageHeader';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: product, isLoading: loadingProduct } = useProduct(Number(id));
  const { data: categoriesData } = useActiveCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (product && isEditing) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        isActive: product.isActive,
      });
      if (product.imageUrl) {
        const base = import.meta.env.VITE_API_BASE_URL;
        setImagePreview(`${base}${product.imageUrl.startsWith('/') ? '' : '/'}${product.imageUrl}`);
      }
    }
  }, [product, isEditing, reset]);

  const onSubmit = (data: FieldValues) => {
    const typed = data as ProductFormData;
    const formData = new FormData();
    formData.append('name', typed.name);
    if (typed.description) formData.append('description', typed.description);
    formData.append('price', String(typed.price));
    formData.append('stock', String(typed.stock));
    formData.append('categoryId', String(typed.categoryId));
    if (typed.isActive !== undefined) formData.append('isActive', String(typed.isActive));
    if (imageFile) formData.append('image', imageFile);

    if (isEditing) {
      updateProduct.mutate(
        { id: Number(id), formData },
        { onSuccess: () => navigate('/admin/catalog') }
      );
    } else {
      if (!imageFile) return;
      createProduct.mutate(formData, {
        onSuccess: () => navigate('/admin/catalog'),
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (isEditing && loadingProduct) return <LoadingScreen />;

  const categories = categoriesData?.categories ?? [];
  const isPending = createProduct.isPending || updateProduct.isPending;

  return (
    <>
      <PageHeader title={isEditing ? 'Editar Produto' : 'Novo Produto'} />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Nome"
              fullWidth
              margin="normal"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
            <TextField
              label="Descrição"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              {...register('description')}
            />
            <TextField
              label="Preço"
              type="number"
              fullWidth
              margin="normal"
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message as string}
              slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
            />
            <TextField
              label="Estoque"
              type="number"
              fullWidth
              margin="normal"
              {...register('stock')}
              error={!!errors.stock}
              helperText={errors.stock?.message as string}
              slotProps={{ htmlInput: { min: '0' } }}
            />
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
                  <InputLabel>Categoria</InputLabel>
                  <Select label="Categoria" {...field} value={field.value ?? ''}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <FormHelperText>{errors.categoryId.message as string}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Box mt={2}>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Imagem {!isEditing && '(obrigatória)'}
              </Typography>
              <Button variant="outlined" component="label">
                Selecionar Imagem
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              {!isEditing && !imageFile && (
                <Typography variant="caption" color="error" display="block" mt={0.5}>
                  Selecione uma imagem para o produto
                </Typography>
              )}
              {imagePreview && (
                <Box mt={1}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>

            <Box display="flex" gap={2} mt={3}>
              <Button
                type="submit"
                variant="contained"
                disabled={isPending || (!isEditing && !imageFile)}
              >
                {isPending ? <CircularProgress size={24} /> : isEditing ? 'Salvar' : 'Criar'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/admin/catalog')}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
