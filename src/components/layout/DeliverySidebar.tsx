import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Toolbar,
  Tooltip,
} from '@mui/material';
import {
  LocalShipping,
  Assignment,
  History,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 72;

const menuItems = [
  { label: 'Disponíveis', path: '/delivery', icon: <LocalShipping /> },
  { label: 'Minhas Entregas', path: '/delivery/my-deliveries', icon: <Assignment /> },
  { label: 'Histórico', path: '/delivery/history', icon: <History /> },
];

export default function DeliverySidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/delivery') return location.pathname === '/delivery';
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
        <LocalShipping sx={{ color: '#fff', fontSize: 28 }} />
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
