import { z } from 'zod';

export const createColumnSchema = z.object({ name: z.string().optional() });

export const updateColumnSchema = z.object({ name: z.string().optional() });
