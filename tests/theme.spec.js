import { test, expect } from '@playwright/test';

async function openLogin(page) {
  await page.goto('/');
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
}

function themeToggle(page) {
  return page.locator('.top-right-actions .icon-btn').nth(1);
}

function darkTheme(page) {
  return page.locator('.dark-theme');
}

test('Enable Dark Theme', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(darkTheme(page)).toBeVisible();
});

test('Theme Toggle Validation', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(darkTheme(page)).toBeVisible();

  await themeToggle(page).click();
  await expect(darkTheme(page)).toHaveCount(0);
});

test('Theme State After Refresh', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();
  await expect(darkTheme(page)).toBeVisible();

  await page.reload();
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
  await expect(darkTheme(page)).toHaveCount(0);
});

test('Text Readability in Dark Mode', async ({ page }) => {
  await openLogin(page);
  await themeToggle(page).click();

  await expect(page.getByRole('heading', { name: 'Mentrix OS' })).toBeVisible();
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
  await expect(page.getByTestId('login-password')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});
