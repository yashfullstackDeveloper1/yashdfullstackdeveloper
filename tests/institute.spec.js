import { test, expect } from '@playwright/test';
import { login } from './support/helpers.js';
import { testUsers } from './support/testConfig.js';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Institute selection', () => {
  test('shows institute search after login', async ({ page }) => {
    await login(page, testUsers.multiInstitute);

    await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
    await expect(page.getByText(`Hi, ${testUsers.multiInstitute.displayName}`)).toBeVisible();
  });

  test('shows the expected institute count for institute-list user', async ({ page }) => {
    await login(page, testUsers.instituteList);

    await expect(page.locator('.inst-card')).toHaveCount(testUsers.instituteList.expectedInstituteCount);
  });

  test('navigates to role selection after choosing an institute with multiple roles', async ({ page }) => {
    await login(page, testUsers.multiInstitute);

    await expect(page.locator('.inst-card').first()).toBeVisible();

    await page.locator('.inst-card').first().click();

    await expect(page.getByRole('heading', { name: 'Choose Your Role' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Change Institute' })).toBeVisible();
  });

  test('filters institutes by search text', async ({ page }) => {
    await login(page, testUsers.multiInstitute);

    await expect(page.getByPlaceholder('Search your institute')).toBeVisible();

    await page.getByPlaceholder('Search your institute').fill('RCOEM');

    await expect(page.locator('.inst-card')).toHaveCount(1);
    await expect(page.getByText('RCOEM Nagpur')).toBeVisible();
  });
});
