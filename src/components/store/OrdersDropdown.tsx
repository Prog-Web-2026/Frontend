import { useState, useMemo } from 'react';
import {
  Popover,
  Box,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Collapse,
  Rating,
  TextField,
} from '@mui/material';
import { ExpandMore, ExpandLess, Inventory, Star, Payment, CheckCircle } from '@mui/icons-material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { api } from '../../api/client';
import { queryClient } from '../../lib/queryClient';
import { useCreateReview, useMyReviews } from '../../hooks/useReviews';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor } from '../../lib/formatters';
import { OrderStatus } from '../../types';
import type { Order } from '../../types';
import PaymentModal from './PaymentModal';

interface OrdersDropdownProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

function useCancelOrder() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => api.patch<{ message: string }>(`/orders/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Pedido cancelado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao cancelar pedido', { variant: 'error' });
    },
  });
}

function useConfirmDelivery() {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: number) => api.patch<{ message: string }>(`/orders/${id}/confirm-delivery`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      enqueueSnackbar('Recebimento confirmado com sucesso!', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Erro ao confirmar recebimento', { variant: 'error' });
    },
  });
}

const CANCELLABLE = new Set<string>([OrderStatus.PENDING, OrderStatus.CONFIRMED]);

interface ReviewFormState {
  productId: number;
  rating: number;
  comment: string;
}

export default function OrdersDropdown({ anchorEl, onClose }: OrdersDropdownProps) {
  const isOpen = Boolean(anchorEl);
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get<{ orders: Order[] }>('/orders/my-orders'),
    enabled: isOpen,
  });
  const { data: myReviewsData } = useMyReviews();
  const cancelOrder = useCancelOrder();
  const confirmDelivery = useConfirmDelivery();
  const createReview = useCreateReview();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewFormState | null>(null);
  const [paymentData, setPaymentData] = useState<{ orderId: number; totalAmount: number } | null>(null);

  const orders = data?.orders ?? [];

  // Map productId -> rating for products the user already reviewed
  const reviewedProducts = useMemo(() => {
    const map = new Map<number, number>();
    for (const r of myReviewsData?.reviews ?? []) {
      map.set(r.productId, r.rating);
    }
    return map;
  }, [myReviewsData]);

  const toggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmitReview = () => {
    if (!reviewForm || reviewForm.rating === 0) return;
    createReview.mutate(
      {
        productId: reviewForm.productId,
        rating: reviewForm.rating,
        comment: reviewForm.comment || undefined,
      },
      {
        onSuccess: () => setReviewForm(null),
      },
    );
  };

  return (
    <>
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box sx={{ width: 420, maxHeight: 560, overflow: 'auto' }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 2, pb: 1 }}>
          Meus Pedidos
        </Typography>
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        ) : orders.length === 0 ? (
          <Box textAlign="center" py={3} px={2}>
            <Inventory sx={{ fontSize: 40, color: 'text.disabled', mb: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Você ainda não fez nenhum pedido
            </Typography>
          </Box>
        ) : (
          orders.map((order, idx) => {
            const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
            const isExpanded = expandedId === order.id;
            const canCancel = CANCELLABLE.has(order.status);
            const isDelivered = order.status === OrderStatus.DELIVERED;
            return (
              <Box key={order.id}>
                {idx > 0 && <Divider />}
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => toggle(order.id)}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Pedido #{order.id}
                      </Typography>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                      {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'} - {formatDate(order.createdAt)}
                  </Typography>
                </Box>
                <Collapse in={isExpanded}>
                  <Box sx={{ px: 2, pb: 2 }}>
                    {order.items?.map((item) => {
                      const existingRating = reviewedProducts.get(item.productId);
                      const hasReviewed = existingRating !== undefined;
                      return (
                        <Box key={item.id} mb={1}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {item.quantity}x {item.product?.name ?? `Produto #${item.productId}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency((item.unitPrice ?? item.price ?? 0) * item.quantity)}
                            </Typography>
                          </Box>

                          {isDelivered && hasReviewed && (
                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                              <Rating value={existingRating} readOnly size="small" />
                            </Box>
                          )}

                          {isDelivered && !hasReviewed && reviewForm?.productId !== item.productId && (
                            <Button
                              size="small"
                              startIcon={<Star sx={{ fontSize: 16 }} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewForm({
                                  productId: item.productId,
                                  rating: 0,
                                  comment: '',
                                });
                              }}
                              sx={{ mt: 0.5, textTransform: 'none', fontSize: '0.75rem' }}
                            >
                              Avaliar
                            </Button>
                          )}

                          {reviewForm?.productId === item.productId && (
                            <Box
                              sx={{ mt: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Typography variant="caption" fontWeight="bold" mb={0.5} display="block">
                                Avaliar {item.product?.name}
                              </Typography>
                              <Rating
                                value={reviewForm.rating}
                                onChange={(_, value) =>
                                  setReviewForm((prev) => prev && { ...prev, rating: value ?? 0 })
                                }
                                size="medium"
                              />
                              <TextField
                                placeholder="Escreva sua avaliação (opcional)"
                                multiline
                                rows={2}
                                fullWidth
                                size="small"
                                value={reviewForm.comment}
                                onChange={(e) =>
                                  setReviewForm((prev) => prev && { ...prev, comment: e.target.value })
                                }
                                sx={{ mt: 1 }}
                              />
                              <Box display="flex" gap={1} mt={1}>
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleSubmitReview}
                                  disabled={reviewForm.rating === 0 || createReview.isPending}
                                >
                                  Enviar
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => setReviewForm(null)}
                                >
                                  Cancelar
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                    {order.status === OrderStatus.PENDING && !order.payment && (
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        sx={{ mt: 1.5 }}
                        startIcon={<Payment />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentData({ orderId: order.id, totalAmount: order.totalAmount });
                        }}
                      >
                        Pagar
                      </Button>
                    )}
                    {order.status === OrderStatus.OUT_FOR_DELIVERY && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        fullWidth
                        sx={{ mt: 1.5 }}
                        startIcon={<CheckCircle />}
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelivery.mutate(order.id);
                        }}
                        disabled={confirmDelivery.isPending}
                      >
                        Confirmar Recebimento
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        fullWidth
                        sx={{ mt: 1.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelOrder.mutate(order.id);
                        }}
                        disabled={cancelOrder.isPending}
                      >
                        Cancelar Pedido
                      </Button>
                    )}
                  </Box>
                </Collapse>
              </Box>
            );
          })
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
