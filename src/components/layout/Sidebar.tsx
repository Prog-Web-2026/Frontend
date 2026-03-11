import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  RateReview,
  Payment,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 72;

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: <Dashboard /> },
  { label: 'Catálogo', path: '/admin/catalog', icon: <Inventory /> },
  { label: 'Pedidos', path: '/admin/orders', icon: <ShoppingCart /> },
  { label: 'Usuários', path: '/admin/users', icon: <People /> },
  { label: 'Avaliações', path: '/admin/reviews', icon: <RateReview /> },
  { label: 'Pagamentos', path: '/admin/payments', icon: <Payment /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/admin/catalog') {
      return location.pathname.startsWith('/admin/catalog') || location.pathname.startsWith('/admin/products');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#1a237e',
          color: '#fff',
          overflowX: 'hidden',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', minHeight: 64 }}>
        <ShoppingCart sx={{ color: '#fff', fontSize: 28 }} />
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.path} title={item.label} placement="right" arrow>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: 'center',
                px: 2,
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.12)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
