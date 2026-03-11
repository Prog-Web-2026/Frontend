import { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart, useUpdateCartItem, useRemoveCartItem, useCheckout } from '../../hooks/useCart';
import { formatCurrency } from '../../lib/formatters';
import PaymentModal from './PaymentModal';

interface CartDropdownProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function CartDropdown({ anchorEl, onClose }: CartDropdownProps) {
  const { data: cart } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const checkout = useCheckout();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [paymentData, setPaymentData] = useState<{ orderId: number; totalAmount: number } | null>(null);

  const items = cart?.items ?? [];

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDecrease = (itemId: number, currentQty: number) => {
    if (currentQty <= 1) {
      removeItem.mutate(itemId);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(itemId); return next; });
    } else {
      updateItem.mutate({ itemId, quantity: currentQty - 1 });
    }
  };

  const handleIncrease = (itemId: number, currentQty: number) => {
    updateItem.mutate({ itemId, quantity: currentQty + 1 });
  };

  const handleCheckout = () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    checkout.mutate(ids, {
      onSuccess: (data) => {
        setSelectedIds(new Set());
        onClose();
        setPaymentData({ orderId: data.order.id, totalAmount: data.order.totalAmount });
      },
    });
  };

  const selectedTotal = items
    .filter((item) => selectedIds.has(item.id))
    .reduce((sum, item) => sum + item.itemTotal, 0);

  return (
    <>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: 400, maxHeight: 480, overflow: 'auto' }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 2, pb: 1 }}>
            Carrinho
          </Typography>
          {items.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
              Carrinho vazio
            </Typography>
          ) : (
            <>
              {items.map((item, idx) => (
                <Box key={item.id}>
                  {idx > 0 && <Divider />}
                  <Box sx={{ px: 1, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox
                      size="small"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(item.product.price)} un.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 70, textAlign: 'right' }}>
                      {formatCurrency(item.itemTotal)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem.mutate(item.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total: {formatCurrency(selectedIds.size > 0 ? selectedTotal : cart?.subtotal ?? 0)}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  disabled={selectedIds.size === 0 || checkout.isPending}
                  onClick={handleCheckout}
                >
                  Comprar ({selectedIds.size})
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Popover>
      {paymentData && (
        <PaymentModal
          open={!!paymentData}
          onClose={() => setPaymentData(null)}
          orderId={paymentData.orderId}
          totalAmount={paymentData.totalAmount}
        />
      )}
    </>
  );
}
