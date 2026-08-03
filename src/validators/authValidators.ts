import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string('email must be a string'),
  password: z.string('password must be a string'),
  name: z.string('name must be a string'),
});

export const loginSchema = z.object({
  email: z.string('email must be a string'),
  password: z.string('password must be a string'),
});
