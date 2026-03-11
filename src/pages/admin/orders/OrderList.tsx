import { useState } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, IconButton, Tooltip } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Edit, Delete, Refresh } from '@mui/icons-material';
import { queryClient } from '../../../lib/queryClient';
import { useNavigate } from 'react-router-dom';
import { useOrders, useDeleteOrder } from '../../../hooks/useOrders';
import { formatCurrency, formatDate, getStatusLabel } from '../../../lib/formatters';
import { OrderStatus } from '../../../types';
import type { Order } from '../../../types';
import StatusChip from '../../../components/common/StatusChip';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function OrderList() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useOrders(statusFilter ? { status: statusFilter } : {});
  const deleteOrder = useDeleteOrder();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const columns: GridColDef<Order>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'user',
      headerName: 'Cliente',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Order) => row.user?.name ?? '-',
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      width: 130,
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'createdAt',
      headerName: 'Data',
      width: 160,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" onClick={() => navigate(`/admin/orders/${params.row.id}`)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => setDeleteId(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Status</InputLabel>
          <Select
            label="Filtrar por Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.values(OrderStatus).map((s) => (
              <MenuItem key={s} value={s}>
                {getStatusLabel(s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={data?.orders ?? []}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
      <ConfirmDialog
        open={deleteId !== null}
        title="Excluir Pedido"
        message="Tem certeza que deseja excluir este pedido?"
        onConfirm={() => {
          if (deleteId) deleteOrder.mutate(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
