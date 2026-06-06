import { test, expect } from '@playwright/test';
import { login, loginAndExpectDashboard, expectLoggedOut } from './support/helpers.js';
import { testUsers } from './support/testConfig.js';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication', () => {
  test('shows an error for invalid credentials', async ({ page }) => {
    await login(page, testUsers.invalid);

    await expect(page.getByTestId('login-error')).toContainText('Invalid credentials');
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('allows a valid user to log in', async ({ page }) => {
    await loginAndExpectDashboard(page, testUsers.admin);
  });

  test('clears the session on logout', async ({ page }) => {
    await loginAndExpectDashboard(page, testUsers.admin);

    await page.getByRole('button', { name: 'Logout' }).click();

    await expectLoggedOut(page);
    await expect(page.evaluate(() => localStorage.getItem('user'))).resolves.toBeNull();
  });
});
