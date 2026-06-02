import { expect } from '@playwright/test';

export const users = {
  admin: { email: 'ayushn@gmail.com', password: '123' },
  multiInstitute: { email: 'yashd@gmail.com', password: '123' },
  threeInstitutes: { email: 'ayushl@gmail.com', password: '123' },
};

export async function openLogin(page) {
  await page.goto('/');
  await expect(page.getByTestId('login-email-or-phone')).toBeVisible();
}

export async function login(page, user) {
  await openLogin(page);
  await page.getByTestId('login-email-or-phone').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByTestId('login-submit').click();
}