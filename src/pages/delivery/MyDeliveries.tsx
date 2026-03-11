import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Inventory,
  Phone,
  CheckCircle,
  FiberManualRecord,
  NearMe,
} from '@mui/icons-material';
import { useMyDeliveries, useMarkDelivered } from '../../hooks/useDelivery';
import { formatCurrency, formatDate } from '../../lib/formatters';
import LoadingScreen from '../../components/common/LoadingScreen';
import { OrderStatus } from '../../types';
import type { Order } from '../../types';

function getTotalItems(order: Order): number {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

const DELIVERY_COMMISSION = 0.1;

export default function MyDeliveries() {
  const { data, isLoading } = useMyDeliveries();
  const markDelivered = useMarkDelivered();

  if (isLoading) return <LoadingScreen />;

  const orders = data?.orders ?? [];

  const activeOrders = orders.filter(
    (o) => o.status === OrderStatus.OUT_FOR_DELIVERY,
  );

  const deliveredOrders = orders
    .filter((o) => o.status === OrderStatus.DELIVERED)
    .slice(0, 5);

  const todayDelivered = orders.filter((o) => {
    if (o.status !== OrderStatus.DELIVERED || !o.deliveredAt) return false;
    const today = new Date().toDateString();
    return new Date(o.deliveredAt).toDateString() === today;
  });

  const todayCommission = todayDelivered.reduce(
    (sum, o) => sum + parseFloat(String(o.totalAmount)) * DELIVERY_COMMISSION,
    0,
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Minhas Entregas
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Hoje: {todayDelivered.length} {todayDelivered.length === 1 ? 'entrega' : 'entregas'}
        {'  '}
        <Typography component="span" variant="body2" fontWeight="bold">
          {formatCurrency(todayCommission)} ganhos (10%)
        </Typography>
      </Typography>

      {activeOrders.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Em Andamento
          </Typography>

          {activeOrders.map((order) => (
            <Card key={order.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FiberManualRecord sx={{ fontSize: 12, color: 'info.main' }} />
                    <Typography variant="body2" color="info.main" fontWeight={500}>
                      Entregando ao cliente
                    </Typography>
                  </Box>
                  {order.updatedAt && (
                    <Typography variant="caption" color="text.secondary">
                      Aceito às {new Date(order.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {order.customer?.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Inventory sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {getTotalItems(order)} {getTotalItems(order) === 1 ? 'item' : 'itens'}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={formatCurrency(parseFloat(String(order.totalAmount)) * DELIVERY_COMMISSION)}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>

                <Box display="flex" alignItems="flex-start" gap={0.5} mb={1.5}>
                  <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {order.deliveryAddress}
                  </Typography>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip
                    icon={<NearMe sx={{ fontSize: 16 }} />}
                    label={order.distance != null ? `${order.distance} km` : 'N/D'}
                    size="small"
                    variant="outlined"
                    color={order.distance != null ? 'primary' : 'default'}
                  />
                  <Chip
                    icon={<AccessTime sx={{ fontSize: 16 }} />}
                    label={order.estimatedTime != null ? `${order.estimatedTime} min` : 'N/D'}
                    size="small"
                    variant="outlined"
                    color={order.estimatedTime != null ? 'primary' : 'default'}
                  />
                </Box>

                <Box display="flex" gap={2}>
                  {order.customer?.phone && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Phone />}
                      href={`tel:${order.customer.phone}`}
                    >
                      Ligar
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => markDelivered.mutate(order.id)}
                    disabled={markDelivered.isPending}
                    sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1642' } }}
                  >
                    Finalizar Entrega &rarr;
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {activeOrders.length === 0 && (
        <Box textAlign="center" py={4} mb={3}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma entrega em andamento
          </Typography>
        </Box>
      )}

      {deliveredOrders.length > 0 && (
        <>
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            Histórico
          </Typography>

          {deliveredOrders.map((order) => (
            <Card key={order.id} variant="outlined" sx={{ mb: 1.5 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box display="flex" gap={1} alignItems="flex-start">
                    <CheckCircle color="success" sx={{ fontSize: 20, mt: 0.3 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {order.customer?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.deliveryAddress}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Inventory sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {getTotalItems(order)} {getTotalItems(order) === 1 ? 'item' : 'itens'}
                          </Typography>
                        </Box>
                        {order.distance != null && (
                          <Typography variant="caption" color="text.secondary">
                            {order.distance} km
                          </Typography>
                        )}
                        {order.estimatedTime != null && (
                          <Typography variant="caption" color="text.secondary">
                            {order.estimatedTime} min
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                      +{formatCurrency(parseFloat(String(order.totalAmount)) * DELIVERY_COMMISSION)}
                    </Typography>
                    {order.deliveredAt && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(order.deliveredAt)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}
