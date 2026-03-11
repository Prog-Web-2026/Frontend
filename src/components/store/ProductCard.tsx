import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Rating,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAddToCart } from '../../hooks/useCart';
import { useAuthStore } from '../../stores/authStore';
import { formatCurrency } from '../../lib/formatters';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClickDetail?: (productId: number) => void;
}

export default function ProductCard({ product, onClickDetail }: ProductCardProps) {
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': { boxShadow: 4 },
        transition: 'box-shadow 0.2s',
      }}
      onClick={() => onClickDetail?.(product.id)}
    >
      <CardMedia
        component="div"
        sx={{
          height: 180,
          bgcolor: product.imageUrl ? undefined : '#e0e0e0',
          backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {product.name}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} my={0.5}>
          <Rating value={product.averageRating ?? 0} readOnly size="small" precision={0.5} />
          <Typography variant="caption" color="text.secondary">
            ({product.reviewCount ?? 0})
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatCurrency(product.price)}
          </Typography>
          <Typography
            variant="caption"
            color={product.stock > 0 ? 'success.main' : 'error.main'}
            fontWeight={500}
          >
            {product.stock > 0 ? `${product.stock} em estoque` : 'Sem estoque'}
          </Typography>
        </Box>
      </CardContent>
      <Box display="flex" justifyContent="flex-end" px={1} pb={1} gap={0.5}>
        <IconButton
          color="primary"
          onClick={handleAddToCart}
          disabled={addToCart.isPending || product.stock === 0}
          title="Adicionar ao carrinho"
        >
          <AddShoppingCart />
        </IconButton>
      </Box>
    </Card>
  );
}
