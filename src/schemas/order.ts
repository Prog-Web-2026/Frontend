import { z } from 'zod';
import { OrderStatus } from '../types';

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus, { message: 'Status inválido' }),
});

export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
