import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAuthStore } from '../../stores/authStore';
import { useLogout } from '../../hooks/useAuth';
import { DRAWER_WIDTH } from './Sidebar';

export default function Topbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
      }}
    >
      <Toolbar>
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
  );
}
