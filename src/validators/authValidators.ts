import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string('email must be a string')
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: 'Invalid email address' })),
  password: z
    .string('password must be a string')
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),
});
