import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  CheckCircle,
  Inventory,
  AttachMoney,
  TrendingUp,
  LocalShipping,
  CalendarToday,
  AccessTime,
} from '@mui/icons-material';
import { useMyDeliveries } from '../../hooks/useDelivery';
import { formatCurrency, formatDate } from '../../lib/formatters';
import LoadingScreen from '../../components/common/LoadingScreen';
import { OrderStatus } from '../../types';
import type { Order } from '../../types';

type FilterType = 'all' | 'today' | 'yesterday' | 'week';

const DELIVERY_COMMISSION = 0.1;

function getTotalItems(order: Order): number {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

function isToday(date: string): boolean {
  return new Date(date).toDateString() === new Date().toDateString();
}

function isYesterday(date: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(date).toDateString() === yesterday.toDateString();
}

function isLastWeek(date: string): boolean {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return new Date(date) >= weekAgo;
}

export default function DeliveryHistory() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data, isLoading } = useMyDeliveries();

  const deliveredOrders = useMemo(() => {
    const orders = (data?.orders ?? []).filter(
      (o) => o.status === OrderStatus.DELIVERED,
    );

    if (filter === 'today') return orders.filter((o) => o.deliveredAt && isToday(o.deliveredAt));
    if (filter === 'yesterday') return orders.filter((o) => o.deliveredAt && isYesterday(o.deliveredAt));
    if (filter === 'week') return orders.filter((o) => o.deliveredAt && isLastWeek(o.deliveredAt));
    return orders;
  }, [data, filter]);

  const stats = useMemo(() => {
    const count = deliveredOrders.length;
    const totalOrderValue = deliveredOrders.reduce(
      (sum, o) => sum + parseFloat(String(o.totalAmount)),
      0,
    );
    const totalCommission = totalOrderValue * DELIVERY_COMMISSION;
    const avgPerDelivery = count > 0 ? totalCommission / count : 0;
    return { count, totalCommission, avgPerDelivery };
  }, [deliveredOrders]);

  if (isLoading) return <LoadingScreen />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Histórico de Entregas
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Acompanhe suas entregas e ganhos (10% de comissão por entrega)
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, value) => value && setFilter(value)}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">Todos</ToggleButton>
        <ToggleButton value="today">Hoje</ToggleButton>
        <ToggleButton value="yesterday">Ontem</ToggleButton>
        <ToggleButton value="week">Última Semana</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocalShipping sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Entregas
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {stats.count}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Total Ganho (10%)
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(stats.totalCommission)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUp sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Média/Entrega
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {formatCurrency(stats.avgPerDelivery)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {deliveredOrders.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma entrega encontrada para o período selecionado
          </Typography>
        </Box>
      ) : (
        deliveredOrders.map((order) => {
          const commission = parseFloat(String(order.totalAmount)) * DELIVERY_COMMISSION;
          return (
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
                      <Box display="flex" flexWrap="wrap" gap={2} mt={0.5}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Inventory sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {getTotalItems(order)} {getTotalItems(order) === 1 ? 'item' : 'itens'}
                          </Typography>
                        </Box>
                        {order.deliveredAt && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(order.deliveredAt)}
                            </Typography>
                          </Box>
                        )}
                        {order.distance != null && (
                          <Typography variant="caption" color="text.secondary">
                            {order.distance} km
                          </Typography>
                        )}
                        {order.estimatedTime != null && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {order.estimatedTime} min
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="subtitle2" color="success.main" fontWeight="bold" flexShrink={0}>
                    +{formatCurrency(commission)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}
    </Box>
  );
}
