import { useState } from 'react';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Edit, Delete, Refresh } from '@mui/icons-material';
import { queryClient } from '../../../lib/queryClient';
import { useOrders } from '../../../hooks/useOrders';
import { useRefundPayment } from '../../../hooks/usePayments';
import { formatCurrency, formatDateShort, getPaymentTypeLabel, getStatusLabel, getStatusColor } from '../../../lib/formatters';
import { PaymentStatus } from '../../../types';
import type { Order } from '../../../types';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import LoadingScreen from '../../../components/common/LoadingScreen';

interface PaymentRow {
  id: number;
  orderId: number;
  customerName: string;
  type: string;
  status: PaymentStatus;
  amount: number;
  createdAt: string;
}

export default function PaymentList() {
  const { data, isLoading } = useOrders();
  const refund = useRefundPayment();
  const [refundId, setRefundId] = useState<number | null>(null);

  const rows: PaymentRow[] = (data?.orders ?? [])
    .filter((order: Order) => order.payment)
    .map((order: Order) => ({
      id: order.payment!.id,
      orderId: order.id,
      customerName: order.user?.name ?? '-',
      type: order.payment!.type,
      status: order.payment!.status,
      amount: order.payment!.amount,
      createdAt: order.payment!.createdAt,
    }));

  const columns: GridColDef<PaymentRow>[] = [
    { field: 'orderId', headerName: 'Pedido', width: 90 },
    { field: 'customerName', headerName: 'Cliente', flex: 1, minWidth: 150 },
    {
      field: 'type',
      headerName: 'Tipo',
      width: 160,
      renderCell: (params) => (
        <Chip label={getPaymentTypeLabel(params.value)} size="small" />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          size="small"
          color={getStatusColor(params.value)}
        />
      ),
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 130,
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: 'createdAt',
      headerName: 'Data',
      width: 130,
      valueFormatter: (value: string) => formatDateShort(value),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton size="small" disabled={params.row.status !== PaymentStatus.SUCCESS}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            disabled={params.row.status !== PaymentStatus.SUCCESS}
            onClick={() => setRefundId(params.row.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Tooltip title="Atualizar">
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['orders'] })}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        disableRowSelectionOnClick
      />
      <ConfirmDialog
        open={refundId !== null}
        title="Reembolsar Pagamento"
        message="Tem certeza que deseja reembolsar este pagamento?"
        confirmLabel="Reembolsar"
        onConfirm={() => {
          if (refundId) refund.mutate(refundId);
          setRefundId(null);
        }}
        onCancel={() => setRefundId(null)}
      />
    </>
  );
}
