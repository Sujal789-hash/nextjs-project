import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters long' })
      .max(60, { message: 'Full name must not exceed 60 characters' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .toLowerCase(),
    phone: z
      .string()
      .min(7, { message: 'Phone number must be at least 7 digits' })
      .max(20, { message: 'Phone number must not exceed 20 digits' }),
    role: z.enum(['startup', 'investor', 'admin'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(100, { message: 'Password cannot exceed 100 characters' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

export const startupProfileSchema = z.object({
  startupName: z.string().min(2, 'Startup name is required'),
  founderName: z.string().min(2, 'Founder name is required'),
  industry: z.string().min(2, 'Industry is required'),
  description: z.string().min(20, 'Please provide a descriptive overview (at least 20 chars)'),
  website: z.string().url('Must be a valid URL').or(z.literal('')),
  location: z.string().min(2, 'Location is required'),
  foundedYear: z.coerce.number().min(1980).max(new Date().getFullYear()),
  teamSize: z.string().min(1, 'Team size is required'),
  startupStage: z.enum(['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B+']),
  businessModel: z.string().min(2, 'Business model is required'),
  targetAudience: z.string().min(2, 'Target audience is required'),
  fundingRequired: z.coerce.number().min(1000, 'Minimum funding required is $1,000'),
  currentValuation: z.coerce.number().min(1000, 'Minimum valuation is $1,000'),
});

export const investorProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  organization: z.string().min(2, 'Organization is required'),
  title: z.string().min(2, 'Title is required'),
  biography: z.string().min(20, 'Please provide a detailed biography'),
  location: z.string().min(2, 'Location is required'),
  checkSizeMin: z.coerce.number().min(1000, 'Minimum check size is $1,000'),
  checkSizeMax: z.coerce.number().min(5000, 'Maximum check size must be at least $5,000'),
});

