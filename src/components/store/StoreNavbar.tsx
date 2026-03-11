import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search,
  ShoppingCart,
  Person,
  ListAlt,
  Storefront,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAddressStore } from '../../stores/addressStore';
import { useAuthStore } from '../../stores/authStore';
import { useCart } from '../../hooks/useCart';
import { useLogout } from '../../hooks/useAuth';
import CepPopover from './CepPopover';
import CartDropdown from './CartDropdown';
import OrdersDropdown from './OrdersDropdown';

interface StoreNavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function StoreNavbar({ search, onSearchChange }: StoreNavbarProps) {
  const navigate = useNavigate();
  const { bairro, cep } = useAddressStore();
  const { isAuthenticated, user } = useAuthStore();
  const { data: cart } = useCart();
  const logout = useLogout();

  const [cepAnchor, setCepAnchor] = useState<HTMLElement | null>(null);
  const [cartAnchor, setCartAnchor] = useState<HTMLElement | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [ordersAnchor, setOrdersAnchor] = useState<HTMLElement | null>(null);

  const itemCount = cart?.itemCount ?? 0;

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
          <Box display="flex" alignItems="center" gap={2} sx={{ flexShrink: 0 }}>
            <Box
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Storefront sx={{ fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" noWrap>
                ShopHub
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {bairro ? (
                <Typography variant="body2" noWrap>
                  A entrega será feita em: {bairro} {cep}
                </Typography>
              ) : (
                <Typography variant="body2" noWrap>
                  Informe seu CEP
                </Typography>
              )}
              <Button
                size="small"
                variant="text"
                sx={{ color: '#fff', textDecoration: 'underline', whiteSpace: 'nowrap' }}
                onClick={(e) => setCepAnchor(e.currentTarget)}
              >
                Atualizar CEP
              </Button>
            </Box>
          </Box>

          <TextField
            placeholder="Buscar produtos..."
            size="small"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              flexGrow: 1,
              bgcolor: '#fff',
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box display="flex" alignItems="center" gap={0.5} sx={{ flexShrink: 0 }}>
            <Button
              color="inherit"
              startIcon={
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCart />
                </Badge>
              }
              onClick={(e) => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                setCartAnchor(e.currentTarget);
              }}
            >
              Carrinho
            </Button>
            <Button
              color="inherit"
              startIcon={<ListAlt />}
              onClick={(e) => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                setOrdersAnchor(e.currentTarget);
              }}
            >
              Pedidos
            </Button>
            <IconButton
              color="inherit"
              onClick={(e) => {
                if (!isAuthenticated) {
                  navigate('/login');
                  return;
                }
                setProfileAnchor(e.currentTarget);
              }}
            >
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <CepPopover anchorEl={cepAnchor} onClose={() => setCepAnchor(null)} />
      {isAuthenticated && (
        <>
          <CartDropdown anchorEl={cartAnchor} onClose={() => setCartAnchor(null)} />
          <OrdersDropdown anchorEl={ordersAnchor} onClose={() => setOrdersAnchor(null)} />
        </>
      )}

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <Typography variant="body2">{user?.name}</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
          setProfileAnchor(null);
          logout.mutate();
        }}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          <ListItemText>Sair</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
