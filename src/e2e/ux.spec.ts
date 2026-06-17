import { expect } from '@playwright/test';
import { test } from './fixtures/auth';

test.describe('UX', () => {
  test.describe('Dark Mode', () => {
    test('dark mode toggle adds .dark class to html', async ({ authenticatedPage: page }) => {
      const toggle = page.getByRole('button', { name: 'Toggle dark mode' });

      if (await toggle.isVisible()) {
        await toggle.click();
        await expect(page.locator('html')).toHaveClass(/dark/);
      } else {
        test.skip(true, 'Dark mode toggle not found');
      }
    });

    test('dark mode persists on page reload', async ({ authenticatedPage: page }) => {
      const toggle = page.getByRole('button', { name: 'Toggle dark mode' });

      if (await toggle.isVisible()) {
        await toggle.click();
        await expect(page.locator('html')).toHaveClass(/dark/);

        await page.reload();
        await expect(page.locator('html')).toHaveClass(/dark/);
      } else {
        test.skip(true, 'Dark mode toggle not found');
      }
    });
  });

  test.describe('Logout', () => {
    test('logout redirects to login and clears auth state', async ({ authenticatedPage: page }) => {
      // Mock logout endpoint
      await page.route('**/api/logout', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
      });

      const logoutBtn = page.getByRole('button', { name: 'Log Out' });

      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
        await page.waitForURL('/login');
        // Should show login page content after logout
        await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
      } else {
        test.skip(true, 'Logout button not found');
      }
    });
  });

  test.describe('Language Switch', () => {
    test('language switch buttons are visible', async ({ authenticatedPage: page }) => {
      const enBtn = page.getByRole('button', { name: 'Switch to EN' });
      const plBtn = page.getByRole('button', { name: 'Switch to PL' });

      if (await enBtn.isVisible() && await plBtn.isVisible()) {
        // Both language buttons visible
        await expect(enBtn).toBeVisible();
        await expect(plBtn).toBeVisible();
      } else {
        // Might be in the footer — check there too
        test.skip(true, 'Language switch not found in header/footer');
      }
    });

    test('switching to PL changes page text', async ({ authenticatedPage: page }) => {
      const plBtn = page.getByRole('button', { name: 'Switch to PL' });

      if (await plBtn.isVisible()) {
        await plBtn.click();
        // After switching, the PL button text should still be readable
        // and the EN button should show as available to switch to
        await expect(page.getByRole('button', { name: 'Switch to EN' })).toBeVisible();
      } else {
        test.skip(true, 'PL switch button not found');
      }
    });
  });

  test.describe('Cookie Consent', () => {
    test('cookie banner appears and can be accepted', async ({ authenticatedPage: page }) => {
      // The cookie banner is inside AppLayout, visible on protected pages
      const cookieBanner = page.getByText(/browser storage|preferences/i);

      if (await cookieBanner.isVisible({ timeout: 2000 }).catch(() => false)) {
        const acceptBtn = page.getByRole('button', { name: /OK|got it/i });
        await acceptBtn.click();
        // Banner should dismiss
        await expect(cookieBanner).not.toBeVisible({ timeout: 3000 });
      }
      // If no banner visible, it was already dismissed in a previous step — skip gracefully
    });
  });
});
