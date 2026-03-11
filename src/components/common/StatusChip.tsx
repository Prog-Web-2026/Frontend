import { Chip } from '@mui/material';
import type { OrderStatus, PaymentStatus } from '../../types';
import { getStatusLabel, getStatusColor } from '../../lib/formatters';

interface StatusChipProps {
  status: OrderStatus | PaymentStatus;
}

export default function StatusChip({ status }: StatusChipProps) {
  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size="small"
    />
  );
}
