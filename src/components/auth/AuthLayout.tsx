import { Box } from '@mui/material';
import type { ReactNode } from 'react';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box display="flex" minHeight="100vh">
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: '50%',
          backgroundImage: `url(${IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>{children}</Box>
      </Box>
    </Box>
  );
}
