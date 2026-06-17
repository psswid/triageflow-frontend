import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('landing page loads with hero and features', async ({ page }) => {
    await page.goto('/');

    // Hero section heading (renders hero.title from i18n)
    await expect(
      page.getByRole('heading', { name: /first-contact medical specialist/i }),
    ).toBeVisible();

    // App name appears in the header logo link
    await expect(page.getByText('TriageFlow')).toBeVisible();

    // Navigation should show auth links for unauthenticated users
    await expect(page.getByRole('link', { name: 'Log In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  });

  test('about page shows developer info', async ({ page }) => {
    await page.goto('/about');

    // Page renders the "About This Project" heading
    await expect(page.getByRole('heading', { name: /About This Project/i })).toBeVisible();

    // Developer name is present
    await expect(page.getByText('Piotr Świderski')).toBeVisible();
  });

  test('how it works page shows steps', async ({ page }) => {
    await page.goto('/how-it-works');

    // Page renders the "How It Works" heading
    await expect(page.getByRole('heading', { name: /How It Works/i })).toBeVisible();
  });

  test('privacy page has sections', async ({ page }) => {
    await page.goto('/privacy');

    // Page renders the "Privacy Policy" heading
    await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();
  });

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms');

    // Page renders the "Terms of Service" heading
    await expect(page.getByRole('heading', { name: /Terms of Service/i })).toBeVisible();
  });

  test('cookies page explains cookie usage', async ({ page }) => {
    await page.goto('/cookies');

    // Page renders the "Cookie Policy" heading
    await expect(page.getByRole('heading', { name: /Cookie Policy/i })).toBeVisible();
  });

  test('contact page shows contact info', async ({ page }) => {
    await page.goto('/contact');

    // Page renders the "Get in Touch" heading
    await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible();
  });
});
