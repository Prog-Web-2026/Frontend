import { Box, Checkbox, IconButton, Rating, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { queryClient } from '../../../lib/queryClient';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useRecentReviews, useToggleReviewStatus } from '../../../hooks/useReviews';
import { formatDateShort } from '../../../lib/formatters';
import type { ProductReview } from '../../../types';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function ReviewList() {
  const { data, isLoading } = useRecentReviews();
  const toggleStatus = useToggleReviewStatus();

  const columns: GridColDef<ProductReview>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'product',
      headerName: 'Produto',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: ProductReview) => row.product?.name ?? '-',
    },
    {
      field: 'user',
      headerName: 'Usuário',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: ProductReview) => row.user?.name ?? '-',
    },
    {
      field: 'rating',
      headerName: 'Nota',
      width: 150,
      renderCell: (params) => <Rating value={params.value} readOnly size="small" />,
    },
    {
      field: 'comment',
      headerName: 'Comentário',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'isActive',
      headerName: 'Visível',
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={() =>
            toggleStatus.mutate({ id: params.row.id, isActive: !params.value })
          }
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Data',
      width: 130,
      valueFormatter: (value: string) => formatDateShort(value),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['reviews'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={data ?? []}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
    </>
  );
}
