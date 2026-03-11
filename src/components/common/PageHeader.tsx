import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export default function PageHeader({ title, actionLabel, actionIcon, onAction }: PageHeaderProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
