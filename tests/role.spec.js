import { test, expect } from '@playwright/test';
import { login, users } from './helpers';

test('Display Assigned Roles', async ({ page }) => {
  await login(page, users.multiInstitute);
  await page.getByText('RCOEM Nagpur').click();
  await expect(page.getByRole('heading', { name: 'Institute Admin' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Trainer' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Student' })).toBeVisible();
});
test('Role Selection Navigation', async ({ page }) => {
  await login(page, users.multiInstitute);
  await page.getByText('RCOEM Nagpur').click();
  await page.getByRole('heading', { name: 'Student' }).click();
  await expect(page.getByRole('heading', { name: /Hey Yash/i })).toBeVisible();
});
test('Change Institute Navigation', async ({ page }) => {
  await login(page, users.multiInstitute);
  await page.getByText('RCOEM Nagpur').click();
  await page.getByRole('button', { name: 'Change Institute' }).click();
  await expect(page.getByPlaceholder('Search your institute')).toBeVisible();
});
