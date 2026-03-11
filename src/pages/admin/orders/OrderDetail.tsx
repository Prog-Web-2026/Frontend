import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '../../../hooks/useOrders';
import { formatCurrency, formatDate, getPaymentTypeLabel, getStatusLabel } from '../../../lib/formatters';
import { OrderStatus } from '../../../types';
import PageHeader from '../../../components/common/PageHeader';
import StatusChip from '../../../components/common/StatusChip';
import LoadingScreen from '../../../components/common/LoadingScreen';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useOrder(Number(id));
  const updateStatus = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState('');

  if (isLoading) return <LoadingScreen />;

  const order = data?.order;
  if (!order) return <Typography>Pedido não encontrado</Typography>;

  const handleUpdateStatus = () => {
    if (newStatus) {
      updateStatus.mutate({ id: order.id, status: newStatus as OrderStatus });
    }
  };

  return (
    <>
      <PageHeader title={`Pedido #${order.id}`} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informações do Pedido
              </Typography>
              <Box display="flex" gap={4} flexWrap="wrap">
                <Box>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <StatusChip status={order.status} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Data</Typography>
                  <Typography>{formatDate(order.createdAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total</Typography>
                  <Typography fontWeight="bold">{formatCurrency(order.totalAmount)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Itens do Pedido
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Qtd</TableCell>
                    <TableCell align="right">Preço Unit.</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name ?? `Produto #${item.productId}`}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.unitPrice ?? item.price ?? 0)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.totalPrice ?? (item.unitPrice ?? item.price ?? 0) * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cliente
              </Typography>
              <Typography>{order.user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.user?.email}
              </Typography>
              {order.address && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    {order.address.street}, {order.address.number}
                    {order.address.complement && ` - ${order.address.complement}`}
                  </Typography>
                  <Typography variant="body2">
                    {order.address.neighborhood} - {order.address.city}/{order.address.state}
                  </Typography>
                  <Typography variant="body2">{order.address.zipCode}</Typography>
                </>
              )}
            </CardContent>
          </Card>

          {order.payment && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pagamento
                </Typography>
                <Typography variant="body2">
                  Tipo: {getPaymentTypeLabel(order.payment.type)}
                </Typography>
                <Box mt={0.5}>
                  <StatusChip status={order.payment.status} />
                </Box>
                <Typography variant="body2" mt={1}>
                  Valor: {formatCurrency(order.payment.amount)}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atualizar Status
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Novo Status</InputLabel>
                <Select
                  label="Novo Status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {Object.values(OrderStatus)
                    .filter((s) => [OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED].includes(s))
                    .map((s) => (
                      <MenuItem key={s} value={s}>{getStatusLabel(s)}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="contained"
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || updateStatus.isPending}
                >
                  Atualizar
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/orders')}>
                  Voltar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
