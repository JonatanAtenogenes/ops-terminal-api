import { Hono } from 'hono';
import { logger } from 'hono/logger';

export const app = new Hono();

// Logs method, path, status and duration for every request
app.use(logger());

// Lightweight endpoint to verify the service is up (used by Render health checks)
app.get('/health', (c) => c.json({ status: 'ok' }));
