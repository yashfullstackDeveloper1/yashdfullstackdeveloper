import { test, expect } from '@playwright/test';
import { login, users } from './helpers';

async function loginAsAdmin(page) {
  await login(page, users.admin);
  await expect(page.getByRole('heading', { name: /Hey Ayush N/i })).toBeVisible();
}

test('Dashboard Initial Load', async ({ page }) => {
  await loginAsAdmin(page);
});

test('User Information Display', async ({ page }) => {
  await loginAsAdmin(page);
  await expect(page.getByRole('heading', { name: /Hey Ayush N/i })).toBeVisible();
});

test('Dashboard UI Verification', async ({ page }) => {
  await loginAsAdmin(page);

  await expect(page.getByRole('heading', { name: /Welcome to MentrixOS/i })).toBeVisible();
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

  await expect(page.getByRole('heading', { name: /Hey Ayush N/i })).not.toBeVisible();
});
