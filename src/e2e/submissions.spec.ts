import { expect } from '@playwright/test';
import { test } from './fixtures/auth';
import { mockMySubmissions, mockTriageResult } from './mocks/submissions';

test.describe('My Submissions', () => {
  test('displays list of submissions', async ({ authenticatedPage: page }) => {
    await mockMySubmissions(page);

    await page.goto('/submissions');
    await page.waitForTimeout(1000);

    // mockMySubmissions returns sub-1 (completed, CARDIOLOGIST), sub-2 (awaiting_answer), sub-3 (failed)
    await expect(page.getByText('sub-1')).toBeVisible();
  });

  test('clicking view result navigates to result page', async ({ authenticatedPage: page }) => {
    await mockMySubmissions(page);
    await mockTriageResult(page, { submissionId: 'sub-1' });

    await page.goto('/submissions');
    // Click the first "View Result" link
    await page.getByRole('link', { name: 'View Result' }).first().click();

    await page.waitForURL('/triage/sub-1/result');
    await expect(page.getByText(/Recommended:/)).toBeVisible();
    await expect(page.getByText('CARDIOLOGIST')).toBeVisible();
  });

  test('shows conversation history on result page', async ({ authenticatedPage: page }) => {
    await mockTriageResult(page, { submissionId: 'sub-1' });

    await page.goto('/triage/sub-1/result');
    await expect(page.getByText('I have chest pain and shortness of breath')).toBeVisible();
  });

  test('empty state for user with no submissions', async ({ authenticatedPage: page }) => {
    await mockMySubmissions(page, { empty: true });

    await page.goto('/submissions');
    // Should show empty state text
    await expect(page.getByText(/no submissions|haven't submitted/i)).toBeVisible();
  });
});
