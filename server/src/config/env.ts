import dotenvFlow from 'dotenv-flow';
import { z } from 'zod';

dotenvFlow.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Join all issues into a readable message
  const details = parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message }));
  const error = { message: 'Invalid environment configuration', code: 'ENV_VALIDATION_FAILED', details };
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
