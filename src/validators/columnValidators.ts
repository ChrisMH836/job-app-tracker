import { z } from 'zod';

export const createColumnSchema = z.object({ name: z.string().optional() });
export const removeColumnSchema = z.object({}).strict();
export const updateColumnSchema = createColumnSchema.partial();
