import z from 'zod';
//columnId, company, title, deadline, notes

export const jobStatusSchema = z.enum([
  'SAVED',
  'APPLIED',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
]);

export const createJobItemSchema = z.object({
  columnId: z.uuid(),
  company: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  deadline: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: jobStatusSchema.default('SAVED'),
  order: z.coerce.number().int().optional(),
});
export const removeJobItemSchema = z.object({});
export const updateJobItemSchema = createJobItemSchema.partial();
