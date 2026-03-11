import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const routeLabels: Record<string, string> = {
  admin: 'Admin',
  catalog: 'Catálogo',
  products: 'Produtos',
  orders: 'Pedidos',
  users: 'Usuários',
  reviews: 'Avaliações',
  payments: 'Pagamentos',
  new: 'Novo',
  edit: 'Editar',
};

export default function AdminBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      {segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/');
        const label = routeLabels[segment] ?? (isNaN(Number(segment)) ? segment : `#${segment}`);
        const isLast = index === segments.length - 1;

        if (isLast) {
          return (
            <Typography key={path} color="text.primary" fontWeight={500}>
              {label}
            </Typography>
          );
        }

        return (
          <Link
            key={path}
            component={RouterLink}
            to={path}
            underline="hover"
            color="inherit"
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
