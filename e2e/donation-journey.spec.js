import { test, expect } from '@playwright/test';

const API = process.env.E2E_API_URL || 'http://127.0.0.1:8000';

test.describe('principal donation journey (API)', () => {
  test.skip(!process.env.E2E_API, 'Set E2E_API=1 with a running backend to run this suite');

  test('register is blocked for admin; health is live', async ({ request }) => {
    const health = await request.get(`${API}/health/live`);
    expect(health.ok()).toBeTruthy();
    const admin = await request.post(`${API}/register`, {
      data: {
        username: `e2eadmin${Date.now()}`,
        email: `e2eadmin${Date.now()}@example.com`,
        password: 'Str0ngPass!',
        role: 'admin',
      },
    });
    expect(admin.status()).toBe(403);
  });
});
