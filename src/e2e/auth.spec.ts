import { test, expect } from '@playwright/test';
import { mockRegister, mockLogin, mockMe } from './mocks/auth';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await mockMe(page);
  });

  test.describe('Registration', () => {
    test('register with valid data creates account and redirects to login', async ({ page }) => {
      await mockRegister(page);

      await page.goto('/register');
      await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();

      await page.getByLabel('Email').fill('newuser@example.com');
      await page.getByLabel('Password').fill('test1234');
      await page.getByLabel('Confirm password').fill('test1234');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await page.waitForURL('/login');
      await expect(page.getByText(/Account created/i)).toBeVisible();
    });

    test('register with password mismatch shows client-side validation error', async ({ page }) => {
      await mockRegister(page);

      await page.goto('/register');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('test1234');
      await page.getByLabel('Confirm password').fill('different1234');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('register with duplicate email shows API error', async ({ page }) => {
      await mockRegister(page, {
        failWith: { status: 422, detail: 'The email has already been taken.' },
      });

      await page.goto('/register');
      await page.getByLabel('Email').fill('existing@example.com');
      await page.getByLabel('Password').fill('test1234');
      await page.getByLabel('Confirm password').fill('test1234');
      await page.getByRole('button', { name: 'Create Account' }).click();

      await expect(page.getByText(/email/i)).toBeVisible();
    });
  });

  test.describe('Login', () => {
    test('login with valid credentials redirects to triage', async ({ page }) => {
      await mockLogin(page);

      await page.goto('/login');
      await page.getByLabel('Email').fill('test@example.com');
      await page.getByLabel('Password').fill('test1234');
      await page.getByRole('button', { name: 'Log In' }).click();

      await page.waitForURL('/triage');
      await expect(page.locator('#symptom-description')).toBeVisible();
    });

    test('login with invalid credentials shows error', async ({ page }) => {
      await mockLogin(page, {
        failWith: { status: 401, message: 'Invalid credentials.' },
      });

      await page.goto('/login');
      await page.getByLabel('Email').fill('wrong@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Log In' }).click();

      await expect(page.getByText(/Invalid credentials|Invalid email or password/i)).toBeVisible();
    });

    test('unauthenticated user is redirected from /triage to /login', async ({ page }) => {
      await page.goto('/triage');
      await page.waitForURL('/login');
    });
  });

  test.describe('Email Verification', () => {
    test('verify email page renders', async ({ page }) => {
      await page.goto('/verify-email?token=mock-token');
      await expect(page.getByText(/verify/i)).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate from login to register page', async ({ page }) => {
      await page.goto('/login');
      await page.getByRole('link', { name: 'Register' }).click();
      await page.waitForURL('/register');
      await expect(page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
    });

    test('can navigate from register to login page', async ({ page }) => {
      await page.goto('/register');
      await page.getByRole('link', { name: 'Log In' }).click();
      await page.waitForURL('/login');
      await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
    });
  });
});
