import { test, expect } from '@playwright/test';

test.describe('TriageFlow E2E', () => {
  test('health endpoint returns ok', async ({ request }) => {
    const response = await request.get('http://localhost:8000/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('frontend loads and redirects to login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('/login');
    await expect(page.getByText('TriageFlow')).toBeVisible();
    await expect(page.getByText('Sign in to your account')).toBeVisible();
  });

  test('can navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.getByText('Register').first().click();
    await page.waitForURL('/register');
    await expect(page.getByText('Create your account')).toBeVisible();
  });

  test('register and login flow', async ({ page }) => {
    const email = `e2e-${Date.now()}@test.com`;

    // Register
    await page.goto('/register');
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'test1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/login');
    await expect(page.getByText('Account created')).toBeVisible();

    // Login
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', 'test1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/triage');
    await expect(page.getByText('Describe your symptoms')).toBeVisible();
  });
});
