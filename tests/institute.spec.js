import { test, expect } from '@playwright/test';

async function login(page, email, password) {
  await page.goto('/');
  await page.getByTestId('login-email-or-phone').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

test('Institute Selection Test', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');

  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
});

test('Three Institutes Validation', async ({ page }) => {
  await login(page, 'ayushl@gmail.com', '123');

  await expect(page.locator('.inst-card')).toHaveCount(3);
});

test('Institute Selection Navigation', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');

  await expect(page.locator('.inst-card').first()).toBeVisible();

  await page.locator('.inst-card').first().click();

  await expect(page.getByRole('heading', { name: 'Choose Your Role' })).toBeVisible();
});

test('Search Institute Test', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');

  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();

  await page.getByPlaceholder('Search your institute').fill('RCOEM');

  await expect(page.getByText('RCOEM Nagpur')).toBeVisible();
});
