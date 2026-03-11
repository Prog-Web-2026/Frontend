import { useState } from 'react';
import { AppBar, Box, Breadcrumbs, Button, Link as MuiLink, Toolbar, Typography } from '@mui/material';
import { LocationOn, Logout, NavigateNext } from '@mui/icons-material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import DeliverySidebar, { DRAWER_WIDTH } from './DeliverySidebar';
import { useAuthStore } from '../../stores/authStore';
import { useAddressStore } from '../../stores/addressStore';
import { useLogout } from '../../hooks/useAuth';
import CepPopover from '../store/CepPopover';

const breadcrumbLabels: Record<string, string> = {
  '/delivery': 'Entregas Disponíveis',
  '/delivery/my-deliveries': 'Minhas Entregas',
  '/delivery/history': 'Histórico',
};

export default function DeliveryLayout() {
  const user = useAuthStore((s) => s.user);
  const { bairro, cep } = useAddressStore();
  const logout = useLogout();
  const location = useLocation();
  const [cepAnchor, setCepAnchor] = useState<HTMLElement | null>(null);

  const currentLabel = breadcrumbLabels[location.pathname] || '';
  const hasAddress = Boolean(bairro);

  return (
    <Box sx={{ display: 'flex' }}>
      <DeliverySidebar />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
        }}
      >
        <Toolbar>
          <Button
            color="inherit"
            startIcon={<LocationOn />}
            onClick={(e) => setCepAnchor(e.currentTarget)}
            sx={{ textTransform: 'none' }}
          >
            {hasAddress ? `${bairro} - ${cep}` : 'Definir endereço'}
          </Button>
          {!hasAddress && (
            <Typography variant="caption" sx={{ ml: 1, color: 'warning.light' }}>
              Defina seu endereço para aceitar entregas
            </Typography>
          )}
          <Box flexGrow={1} />
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}
          </Typography>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={() => logout.mutate()}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        <Toolbar />
        {currentLabel && (
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/delivery" underline="hover" color="inherit">
              Entregas
            </MuiLink>
            <Typography color="text.primary">{currentLabel}</Typography>
          </Breadcrumbs>
        )}
        <Outlet />
      </Box>

      <CepPopover anchorEl={cepAnchor} onClose={() => setCepAnchor(null)} />
    </Box>
  );
}
