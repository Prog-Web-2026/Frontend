import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  price: z.coerce.number({ error: 'Informe o preço' }).positive('O preço deve ser maior que zero'),
  stock: z.coerce.number({ error: 'Informe o estoque' }).int('O estoque deve ser um número inteiro').min(0, 'O estoque não pode ser negativo'),
  categoryId: z.coerce.number({ error: 'Selecione uma categoria' }).int().positive('Selecione uma categoria'),
  isActive: z.boolean().optional().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;
