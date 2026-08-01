import { z } from 'zod';

export const createColumnSchema = z.object({
  name: z.string().optional(),
  order: z.number().int().optional(),
});

export const updateColumnSchema = createColumnSchema.partial();
