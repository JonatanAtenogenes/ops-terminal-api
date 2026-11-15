import { serve } from '@hono/node-server';
import { app } from './app';

// Render injects PORT; fall back to 3000 locally
const port = Number(process.env.PORT ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`ops-terminal-api listening on http://localhost:${info.port}`);
});
