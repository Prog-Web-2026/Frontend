import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { useOrderStats } from '../../hooks/useOrders';
import { formatCurrency } from '../../lib/formatters';
import LoadingScreen from '../../components/common/LoadingScreen';

interface StatCardProps {
  title: string;
  value: string | number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: '#e8eaf6',
              color: '#1a237e',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
            }}
          >
            <ShoppingBag />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useOrderStats();

  if (isLoading) return <LoadingScreen />;

  const stats = data?.stats;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total de Pedidos" value={stats?.total ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Pedidos Pendentes" value={stats?.pending ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Receita Total" value={formatCurrency(stats?.totalRevenue ?? 0)} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Entregues" value={stats?.delivered ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Confirmados" value={stats?.confirmed ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Preparando" value={stats?.preparing ?? 0} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Cancelados" value={stats?.cancelled ?? 0} />
      </Grid>
    </Grid>
  );
}
