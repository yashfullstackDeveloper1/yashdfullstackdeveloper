import { test, expect } from '@playwright/test';
import { expectDarkThemeDisabled, expectDarkThemeEnabled } from './support/helpers.js';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
  });

  test('enables dark theme', async ({ page }) => {
    await page.getByTestId('theme-toggle').click();

    await expectDarkThemeEnabled(page);
    await expect(page.getByTestId('theme-toggle')).toHaveAttribute('aria-pressed', 'true');
  });

  test('toggles dark theme off again', async ({ page }) => {
    await page.getByTestId('theme-toggle').click();
    await expectDarkThemeEnabled(page);

    await page.getByTestId('theme-toggle').click();

    await expectDarkThemeDisabled(page);
    await expect(page.getByTestId('theme-toggle')).toHaveAttribute('aria-pressed', 'false');
  });

  test('persists theme state after refresh', async ({ page }) => {
    await page.getByTestId('theme-toggle').click();
    await expectDarkThemeEnabled(page);

    await page.reload();

    await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
    await expectDarkThemeEnabled(page);
    await expect(page.evaluate(() => localStorage.getItem('theme'))).resolves.toBe('dark');
  });

  test('keeps login controls readable in dark mode', async ({ page }) => {
    await page.getByTestId('theme-toggle').click();

    await expectDarkThemeEnabled(page);
    await expect(page.getByRole('heading', { name: 'Mentrix OS' })).toBeVisible();
    await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  });
});
