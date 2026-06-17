import { test as base, type Page } from '@playwright/test';
import { createToken, mockMe } from '../mocks/auth';

export { expect } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    const token = createToken();

    // Mock /api/me so AuthProvider mount-time validation succeeds
    await mockMe(page);

    // Mock /api/logout to avoid real network calls
    await page.route('**/api/logout', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
    });

    // Navigate first so localStorage is available, then inject token
    await page.goto('/');
    await page.evaluate((t) => localStorage.setItem('jwt_token', t), token);

    // Navigate to triage — ProtectedRoute should allow us through
    await page.goto('/triage');
    await page.waitForURL('/triage');

    await use(page);
  },
});
