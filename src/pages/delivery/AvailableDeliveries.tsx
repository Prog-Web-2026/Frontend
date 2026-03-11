import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  LocationOn,
  Inventory,
  LocalShipping,
  NearMe,
} from '@mui/icons-material';
import { useAvailableDeliveries, useAcceptDelivery } from '../../hooks/useDelivery';
import { useAddressStore } from '../../stores/addressStore';
import { formatCurrency } from '../../lib/formatters';
import LoadingScreen from '../../components/common/LoadingScreen';
import type { Order } from '../../types';

function getTotalItems(order: Order): number {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export default function AvailableDeliveries() {
  const { data, isLoading } = useAvailableDeliveries();
  const acceptDelivery = useAcceptDelivery();
  const hasAddress = Boolean(useAddressStore((s) => s.bairro));

  if (isLoading) return <LoadingScreen />;

  const orders = data?.orders ?? [];

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Entregas Disponíveis
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {orders.length} {orders.length === 1 ? 'entrega aguardando' : 'entregas aguardando'} você
        {hasAddress && ' (raio de 20km)'}
      </Typography>

      {!hasAddress && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Defina seu endereço na barra superior para ver entregas próximas e poder aceitá-las.
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box textAlign="center" py={8}>
          <LocalShipping sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma entrega disponível no momento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Novas entregas aparecerão aqui automaticamente
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={order.id}>
              <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
                      label={formatCurrency(parseFloat(String(order.totalAmount)) * 0.1)}
                      color="success"
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={0.5} mb={1.5} mt={1}>
                    <LocationOn sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {order.deliveryAddress}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} mt="auto" mb={2}>
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

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => acceptDelivery.mutate(order.id)}
                    disabled={acceptDelivery.isPending || !hasAddress}
                    sx={{
                      bgcolor: '#1a237e',
                      '&:hover': { bgcolor: '#0d1642' },
                    }}
                  >
                    Aceitar Entrega
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
