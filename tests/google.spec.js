import { test, expect } from '@playwright/test';

test('Google Automation', async ({ page }) => {
  await page.goto('https://www.google.com');
  await page.locator('textarea[name="q"]').fill('Yash Dhapke');
  await page.keyboard.press('Enter');
  await expect(page).toHaveTitle(/Yash/i);

});