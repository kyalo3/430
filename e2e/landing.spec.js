import { test, expect } from '@playwright/test';

test('landing explains the redistribution journey without invented impact', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Turn surplus into verified community support/i })).toBeVisible();
  await expect(page.getByText(/never invent counters/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Donate resources/i })).toBeVisible();
});

test('guidance describes safety without exposing recipients', async ({ page }) => {
  await page.goto('/guidance');
  await expect(page.getByRole('heading', { name: /Safety and participation guidance/i })).toBeVisible();
  await expect(page.getByText(/deservingness/i)).toBeVisible();
});
