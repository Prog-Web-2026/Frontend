import { Box, Button } from '@mui/material';
import { useActiveCategories } from '../../hooks/useCategories';

interface CategoryBarProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export default function CategoryBar({ selectedCategoryId, onSelectCategory }: CategoryBarProps) {
  const { data } = useActiveCategories();
  const categories = data?.categories ?? [];

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        bgcolor: '#1a237e',
        display: 'flex',
        gap: 1,
        px: 2,
        py: 1,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { height: 4 },
      }}
    >
      <Button
        size="small"
        variant={selectedCategoryId === null ? 'contained' : 'text'}
        sx={{
          color: '#fff',
          whiteSpace: 'nowrap',
          ...(selectedCategoryId === null && { bgcolor: 'rgba(255,255,255,0.2)' }),
        }}
        onClick={() => onSelectCategory(null)}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          size="small"
          variant={selectedCategoryId === cat.id ? 'contained' : 'text'}
          sx={{
            color: '#fff',
            whiteSpace: 'nowrap',
            ...(selectedCategoryId === cat.id && { bgcolor: 'rgba(255,255,255,0.2)' }),
          }}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </Box>
  );
}
