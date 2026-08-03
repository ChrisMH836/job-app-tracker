import z from 'zod';

const updateMeSchema = z.object({
  email: z.string('email must be a string'),
  name: z.string('name must be a string'),
});
const updatePasswordSchema = z.object({
  password: z.string('Password must be a string'),
});

export { updateMeSchema, updatePasswordSchema };
