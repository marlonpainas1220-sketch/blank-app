import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional().or(z.literal('')).default(''),
  GOOGLE_API_KEY: z.string().optional().or(z.literal('')).default(''),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  APP_BASE_URL: z.string().min(1),
});

export const env = (() => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }
  return parsed.data;
})();
