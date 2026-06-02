import { test, expect } from '@playwright/test';

async function login(page, email, password) {
  await page.goto('/');
  await page.getByTestId('login-email-or-phone').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

test('Display Assigned Roles', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await page.getByText('RCOEM Nagpur').click();
  await expect(page.getByRole('heading', { name: 'Institute Admin' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Trainer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Student' })).toBeVisible();
});
test('Role Selection Navigation', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await page.getByText('RCOEM Nagpur').click();
  await page.getByRole('heading', { name: 'Student' }).click();
  await expect(page.getByText('Hey Yash')).toBeVisible();
});

test('Change Institute Navigation', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await page.getByText('RCOEM Nagpur').click();
  await page.getByRole('button', { name: 'Change Institute' }).click();
  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
});
