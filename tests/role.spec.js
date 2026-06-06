import { test, expect } from '@playwright/test';
import { login } from './support/helpers.js';
import { testUsers } from './support/testConfig.js';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Role selection', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, testUsers.multiInstitute);
    await page.getByText('RCOEM Nagpur').click();
    await expect(page.getByRole('heading', { name: 'Choose Your Role' })).toBeVisible();
  });

  test('displays assigned roles for the selected institute', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Institute Admin' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Trainer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Student' })).toBeVisible();
  });

  test('navigates to the selected role dashboard', async ({ page }) => {
    await page.getByRole('heading', { name: 'Student' }).click();

    await expect(page.getByText(`Hey ${testUsers.multiInstitute.displayName}`)).toBeVisible();
    await expect(page.getByText('Welcome to MentrixOS Student Panel!')).toBeVisible();
  });

  test('returns to institute selection from role selection', async ({ page }) => {
    await page.getByRole('button', { name: 'Change Institute' }).click();

    await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
    await expect(page.getByText('RCOEM Nagpur')).toBeVisible();
  });
});
