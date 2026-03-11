import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Rating,
  Divider,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close, AddShoppingCart, Inventory } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAddToCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../lib/formatters';
import type { Product, ProductReview } from '../../types';

interface ProductDetailModalProps {
  productId: number | null;
  onClose: () => void;
}

export default function ProductDetailModal({ productId, onClose }: ProductDetailModalProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: product, isLoading } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => api.get<Product>(`/products/${productId}?includeReviews=true`),
    enabled: productId !== null,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['products', productId, 'reviews'],
    queryFn: () => api.get<{ reviews: ProductReview[]; total: number }>(`/products/${productId}/reviews`),
    enabled: productId !== null,
  });

  const reviews = reviewsData?.reviews ?? [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      onClose();
      return;
    }
    if (productId) addToCart.mutate({ productId, quantity: 1 });
  };

  return (
    <Dialog open={productId !== null} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {product?.name ?? 'Detalhes do Produto'}
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : product ? (
          <Box>
            {product.imageUrl && (
              <Box
                sx={{
                  width: '100%',
                  height: 250,
                  backgroundImage: `url(${product.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 1,
                  mb: 2,
                }}
              />
            )}

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(product.price)}
              </Typography>
              <Chip
                icon={<Inventory sx={{ fontSize: 16 }} />}
                label={product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
                color={product.stock > 0 ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Box>

            {product.category && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Categoria: {product.category.name}
              </Typography>
            )}

            {product.description && (
              <Typography variant="body1" color="text.secondary" mb={2}>
                {product.description}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              startIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              disabled={addToCart.isPending || product.stock === 0}
              sx={{ mb: 3 }}
            >
              Adicionar ao Carrinho
            </Button>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Avaliações
              </Typography>
              {reviews.length > 0 && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Rating value={avgRating} readOnly size="small" precision={0.5} />
                  <Typography variant="body2" color="text.secondary">
                    ({reviews.length})
                  </Typography>
                </Box>
              )}
            </Box>

            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nenhuma avaliação ainda
              </Typography>
            ) : (
              reviews.map((review) => (
                <Box key={review.id} mb={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {review.user?.name ?? 'Usuário'}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  {review.comment && (
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  )}
                  <Divider sx={{ mt: 1.5 }} />
                </Box>
              ))
            )}
          </Box>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
