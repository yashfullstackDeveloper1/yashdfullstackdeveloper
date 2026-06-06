import { test, expect } from '@playwright/test';
import { expectDashboardLoaded, expectLoggedOut } from './support/helpers.js';
import { testUsers } from './support/testConfig.js';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expectDashboardLoaded(page, testUsers.admin.displayName);
  });

  test('loads the authenticated dashboard from saved state', async ({ page }) => {
    await expect(page.getByText('Welcome to MentrixOS Admin Panel!')).toBeVisible();
  });

  test('displays the signed-in user information', async ({ page }) => {
    await expect(page.getByText(`Hey ${testUsers.admin.displayName}`)).toBeVisible();
  });

  test('shows the key dashboard metrics', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Active Institutes', exact: true })).toBeVisible();
    await expect(page.getByText('08')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Total Users', exact: true })).toBeVisible();
    await expect(page.getByText('50+')).toBeVisible();
  });

  test('logs out from the dashboard', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();

    await expectLoggedOut(page);
  });

  test('does not restore the dashboard after logout and back navigation', async ({ page }) => {
    await page.getByRole('button', { name: 'Logout' }).click();

    await expectLoggedOut(page);

    await page.goBack();

    await expect(page.getByText(`Hey ${testUsers.admin.displayName}`)).not.toBeVisible();
  });
});
