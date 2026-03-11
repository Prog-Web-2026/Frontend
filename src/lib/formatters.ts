import { OrderStatus, PaymentStatus, PaymentType } from '../types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendente',
  [OrderStatus.CONFIRMED]: 'Confirmado',
  [OrderStatus.PREPARING]: 'Preparando',
  [OrderStatus.READY_FOR_PICKUP]: 'Pronto para Retirada',
  [OrderStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [OrderStatus.DELIVERED]: 'Entregue',
  [OrderStatus.CANCELLED]: 'Cancelado',
};

const orderStatusColors: Record<OrderStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.CONFIRMED]: 'info',
  [OrderStatus.PREPARING]: 'secondary',
  [OrderStatus.READY_FOR_PICKUP]: 'primary',
  [OrderStatus.OUT_FOR_DELIVERY]: 'info',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendente',
  [PaymentStatus.SUCCESS]: 'Aprovado',
  [PaymentStatus.FAILED]: 'Falhou',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
};

const paymentStatusColors: Record<PaymentStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.SUCCESS]: 'success',
  [PaymentStatus.FAILED]: 'error',
  [PaymentStatus.REFUNDED]: 'info',
};

const paymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.CREDIT_CARD]: 'Cartão de Crédito',
  [PaymentType.DEBIT_CARD]: 'Cartão de Débito',
  [PaymentType.PIX]: 'PIX',
};

export function getStatusLabel(status: OrderStatus | PaymentStatus): string {
  if (status in orderStatusLabels) return orderStatusLabels[status as OrderStatus];
  if (status in paymentStatusLabels) return paymentStatusLabels[status as PaymentStatus];
  return status;
}

export function getStatusColor(status: OrderStatus | PaymentStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (status in orderStatusColors) return orderStatusColors[status as OrderStatus];
  if (status in paymentStatusColors) return paymentStatusColors[status as PaymentStatus];
  return 'default';
}

export function getPaymentTypeLabel(type: PaymentType): string {
  return paymentTypeLabels[type] || type;
}
