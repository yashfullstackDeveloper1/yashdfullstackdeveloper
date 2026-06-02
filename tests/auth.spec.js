import { test, expect } from '@playwright/test';
import { login, users } from './helpers';

test('Invalid login test', async ({ page }) => {
  await login(page, { email: 'wrong@gmail.com', password: 'wrong123' });

  await expect(
    page.getByTestId('login-error')
  ).toContainText(/invalid|incorrect|please enter/i);
});

test(' loValidgin test', async ({ page }) => {
  await login(page, users.admin);

  await expect(page.getByRole('heading', { name: /Hey Ayush N/i })).toBeVisible();
});

test('Logout test', async ({ page }) => {
  await login(page, users.admin);

  await expect(page.getByRole('heading', { name: /Hey Ayush N/i })).toBeVisible();

  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});
