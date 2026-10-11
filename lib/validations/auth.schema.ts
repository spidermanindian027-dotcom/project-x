import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name must not exceed 100 characters.' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address.' })
    .max(255, { message: 'Email address must not exceed 255 characters.' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(100, { message: 'Password must not exceed 100 characters.' })
    .regex(/[A-Za-z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Please provide a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .max(100, { message: 'Password must not exceed 100 characters.' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const roleUpdateSchema = z.object({
  userId: z.string().min(1, { message: 'User ID is required.' }),
  role: z.enum(['USER', 'ADMIN'], {
    message: 'Role must be either USER or ADMIN.',
  }),
});

export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
