import { test, expect } from '@playwright/test';

async function login(page, email, password) {
  await page.goto('/');
  await page.getByTestId('login-email-or-phone').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

test('Invalid login test', async ({ page }) => {
  await login(page, 'wrong@gmail.com', 'wrong123');

  await expect(page.getByTestId('login-error')).toContainText('Invalid credentials');
});

test('Valid login test', async ({ page }) => {
  await login(page, 'ayushn@gmail.com', '123');

  await expect(page.getByText('Hey Ayush N')).toBeVisible();
});

test('Logout test', async ({ page }) => {
  await login(page, 'ayushn@gmail.com', '123');

  await expect(page.getByText('Hey Ayush N')).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});
