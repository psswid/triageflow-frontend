import { expect } from '@playwright/test';
import { test } from './fixtures/auth';
import { mockTriageApi, mockTriageNotFound } from './mocks/triage';

test.describe('Triage Interview', () => {
  test('quick result — submit shows result page immediately', async ({ authenticatedPage: page }) => {
    await mockTriageApi(page, { quickResult: true });

    await page.goto('/triage');
    await expect(page.locator('#symptom-description')).toBeVisible();

    await page.locator('#symptom-description').fill('I have a severe headache and dizziness');
    await page.getByRole('button', { name: 'Submit Symptoms' }).click();

    await page.waitForURL(/\/triage\/.+\/result/);
    await expect(page.getByText(/Recommended:/)).toBeVisible();
  });

  test('full triage pipeline with multiple turns', async ({ authenticatedPage: page }) => {
    await mockTriageApi(page);

    await page.goto('/triage');
    await page.locator('#symptom-description').fill('Chest pain when breathing deeply');
    await page.getByRole('button', { name: 'Submit Symptoms' }).click();

    // Wait for first AI question
    await expect(page.getByPlaceholder('Type your answer here...')).toBeVisible({ timeout: 10000 });

    // Answer the question
    await page.getByPlaceholder('Type your answer here...').fill('It started 3 days ago, sharp pain');
    await page.getByRole('button', { name: 'Send Answer' }).click();

    // Wait for result or another question
    await page.waitForURL(/\/triage\/.+\/result/, { timeout: 15000 });
    await expect(page.getByText(/Recommended:/)).toBeVisible();
  });

  test('character limit on symptom input (500 chars)', async ({ authenticatedPage: page }) => {
    await page.goto('/triage');

    const textarea = page.locator('#symptom-description');
    const longText = 'A'.repeat(600);
    await textarea.fill(longText);

    const value = await textarea.inputValue();
    expect(value.length).toBeLessThanOrEqual(500);
  });

  test('submit button disabled when input empty', async ({ authenticatedPage: page }) => {
    await page.goto('/triage');
    const submitButton = page.getByRole('button', { name: 'Submit Symptoms' });

    await page.waitForTimeout(500); // let React render
    await expect(submitButton).toBeDisabled();
  });

  test('404 on invalid submission ID shows not found', async ({ authenticatedPage: page }) => {
    await mockTriageNotFound(page);

    await page.goto('/triage/invalid-id-123/result');
    await expect(page.getByText('Result Not Found')).toBeVisible({ timeout: 5000 });
  });
});
