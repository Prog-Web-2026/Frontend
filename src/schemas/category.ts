import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
