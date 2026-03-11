import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { CreditCard, Pix, AccountBalance } from '@mui/icons-material';
import { PaymentType } from '../../types';
import { useProcessPayment } from '../../hooks/useOrders';
import { formatCurrency } from '../../lib/formatters';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  orderId: number;
  totalAmount: number;
}

const paymentOptions = [
  { type: PaymentType.PIX, label: 'PIX', icon: <Pix /> },
  { type: PaymentType.CREDIT_CARD, label: 'Cartão de Crédito', icon: <CreditCard /> },
  { type: PaymentType.DEBIT_CARD, label: 'Cartão de Débito', icon: <AccountBalance /> },
] as const;

export default function PaymentModal({ open, onClose, orderId, totalAmount }: PaymentModalProps) {
  const [selected, setSelected] = useState<PaymentType | null>(null);
  const processPayment = useProcessPayment();

  const handleConfirm = () => {
    if (!selected) return;
    processPayment.mutate(
      { orderId, type: selected },
      {
        onSuccess: () => {
          setSelected(null);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Forma de Pagamento</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Total do pedido: <strong>{formatCurrency(totalAmount)}</strong>
        </Typography>
        <Box display="flex" flexDirection="column" gap={1.5}>
          {paymentOptions.map((opt) => (
            <Box
              key={opt.type}
              onClick={() => setSelected(opt.type)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                border: 2,
                borderColor: selected === opt.type ? 'primary.main' : 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: selected === opt.type ? 'primary.50' : 'transparent',
                transition: 'all 0.15s',
                '&:hover': { borderColor: 'primary.light' },
              }}
            >
              <Box sx={{ color: selected === opt.type ? 'primary.main' : 'text.secondary' }}>
                {opt.icon}
              </Box>
              <Typography
                fontWeight={selected === opt.type ? 600 : 400}
                color={selected === opt.type ? 'primary.main' : 'text.primary'}
              >
                {opt.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={processPayment.isPending}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selected || processPayment.isPending}
          startIcon={processPayment.isPending ? <CircularProgress size={16} /> : undefined}
        >
          Confirmar Pagamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}
