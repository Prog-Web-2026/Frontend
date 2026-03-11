import { useState } from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { useActiveCategories } from '../../hooks/useCategories';
import StoreNavbar from '../../components/store/StoreNavbar';
import CategoryBar from '../../components/store/CategoryBar';
import ProductCard from '../../components/store/ProductCard';
import ProductDetailModal from '../../components/store/ProductDetailModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import type { Product } from '../../types';

export default function StorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [detailProductId, setDetailProductId] = useState<number | null>(null);

  const { data: products, isLoading: productsLoading } = useProducts({
    ...(selectedCategoryId && { categoryId: selectedCategoryId }),
    ...(search && { search }),
  });
  useActiveCategories();

  const productList: Product[] = products ?? [];

  const groupedByCategory = () => {
    const groups: Record<string, Product[]> = {};
    for (const p of productList) {
      const catName = p.category?.name ?? 'Outros';
      if (!groups[catName]) groups[catName] = [];
      groups[catName].push(p);
    }
    return groups;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <StoreNavbar search={search} onSearchChange={setSearch} />
      <CategoryBar
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {productsLoading ? (
          <LoadingScreen />
        ) : selectedCategoryId || search ? (
          <Grid container spacing={3}>
            {productList.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={product} onClickDetail={setDetailProductId} />
              </Grid>
            ))}
            {productList.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Typography color="text.secondary" textAlign="center" py={4}>
                  Nenhum produto encontrado
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          Object.entries(groupedByCategory()).map(([categoryName, categoryProducts]) => (
            <Box key={categoryName} mb={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {categoryName}
              </Typography>
              <Grid container spacing={3}>
                {categoryProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard product={product} onClickDetail={setDetailProductId} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        )}
      </Container>

      <ProductDetailModal
        productId={detailProductId}
        onClose={() => setDetailProductId(null)}
      />
    </Box>
  );
}
