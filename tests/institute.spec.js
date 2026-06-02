import { test, expect } from '@playwright/test';
import { login, users } from './helpers';

test('Institute Selection Test', async ({ page }) => {
  await login(page, users.multiInstitute);

  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
});

test('Three Institutes Validation', async ({ page }) => {
  await login(page, users.threeInstitutes);

  await expect(page.locator('.inst-card')).toHaveCount(3);
});

test('Institute Selection Navigation', async ({ page }) => {
  await login(page, users.multiInstitute);

  await expect(page.locator('.inst-card').first()).toBeVisible();

  await page.locator('.inst-card').first().click();

  await expect(page.getByRole('heading', { name: 'Choose Your Role' })).toBeVisible();
});

test('Search Institute Test', async ({ page }) => {
  await login(page, users.multiInstitute);

  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();

  await page.getByPlaceholder('Search your institute').fill('RCOEM');

  await expect(page.getByText('RCOEM Nagpur')).toBeVisible();
});
