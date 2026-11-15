import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Server-side client: no browser session to persist or refresh
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SECRET_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  },
);
