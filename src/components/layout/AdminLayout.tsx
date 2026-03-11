import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import Topbar from './Topbar';
import AdminBreadcrumbs from '../common/AdminBreadcrumbs';

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Topbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        <Toolbar />
        <AdminBreadcrumbs />
        <Outlet />
      </Box>
    </Box>
  );
}
