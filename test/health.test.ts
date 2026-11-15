import { describe, it, expect } from 'vitest';
import { app } from '../src/app';

describe('GET /health', () => {
  it('return ok status', async () => {
    const res = await app.request('/health');

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
