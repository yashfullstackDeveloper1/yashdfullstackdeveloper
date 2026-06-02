import { test, expect } from '@playwright/test';

async function loginAsAdmin(page) {
  await page.goto('/');
  await page.getByTestId('login-email-or-phone').fill('ayushn@gmail.com');
  await page.getByTestId('login-password').fill('123');
  await page.getByTestId('login-submit').click();
  await expect(page.getByText('Hey Ayush N')).toBeVisible();
}

test('Dashboard Initial Load', async ({ page }) => {
  await loginAsAdmin(page);
});

test('User Information Display', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByText('Hey Ayush N')).toBeVisible();
});

test('Dashboard UI Verification', async ({ page }) => {
  await loginAsAdmin(page);

  await expect(page.getByText('Welcome to MentrixOS')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Active Institutes', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total Users', exact: true })).toBeVisible();
});

test('Logout Functionality', async ({ page }) => {
  await loginAsAdmin(page);

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});

test('Back Navigation After Logout', async ({ page }) => {
  await loginAsAdmin(page);

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  await page.goBack();

  await expect(page.getByText('Hey Ayush N')).not.toBeVisible();
});
