import z from 'zod';
//columnId, company, title, deadline, notes

export const jobStatusSchema = z.enum([
  'SAVED',
  'APPLIED',
  'INTERVIEW',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
]);

export const createJobItemSchema = z.object({
  columnId: z.uuid(),
  company: z.string(),
  title: z.string(),
  deadline: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: jobStatusSchema.default('SAVED'),
  order: z.coerce.number().int().optional(),
  minSalary: z.number(),
  maxSalary: z.number(),
});
export const updateJobItemSchema = createJobItemSchema.partial();
