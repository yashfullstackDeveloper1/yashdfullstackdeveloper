import { test, expect } from '@playwright/test';
import { openLogin } from './helpers';

function themeToggle(page) {
  return page.locator('.top-right-actions .icon-btn').nth(1);
}

function loginContainer(page) {
  return page.locator('.login-container');
}

test('Enable Dark Theme', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(loginContainer(page)).toHaveClass(/dark-theme/);
});

test('Theme Toggle Validation', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(loginContainer(page)).toHaveClass(/dark-theme/);

  await themeToggle(page).click();
  await expect(loginContainer(page)).not.toHaveClass(/dark-theme/);
});

test('Theme State After Refresh', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(loginContainer(page)).toHaveClass(/dark-theme/);

  await page.reload();
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
  await expect(loginContainer(page)).not.toHaveClass(/dark-theme/);
});

test('Text Readability in Dark Mode', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();

  await expect(page.getByRole('heading', { name: /Mentrix\s*OS/i })).toBeVisible();
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
  await expect(page.getByTestId('login-password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});
