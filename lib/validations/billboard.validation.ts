import { z } from 'zod';

export const BillboardSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  imageUrl: z
    .string()
    .min(1, 'Image is required')
    .url('Please provide a valid image URL'),
  category: z
    .string()
    .min(1, 'Category is required'),
  isActive: z.boolean().default(true),
});

export type BillboardFormData = z.infer<typeof BillboardSchema>;