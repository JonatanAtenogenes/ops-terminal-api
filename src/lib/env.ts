import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

// Fail fast: a missing key should stop the server at boot, not on the first request
if (!parsed.success) {
  console.error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

export const env = parsed.data;
