import { test, expect } from '@playwright/test';

const appUrl = 'https://incomparable-sfogliatella-1c28bb.netlify.app/';

async function mockAuthApi(page) {
  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        pre_context_token: 'test-pre-context-token',
        user: { full_name: 'Ayush N', email: 'ayushn@gmail.com' },
      }),
    });
  });

  await page.route('**/auth/my-institutes-roles', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [
          {
            institute_id: 1,
            tenant_id: 1,
            institute_name: 'Young Engineers Lab Nagpur',
            roles: [{ role_id: 1, role_name: 'Admin' }],
          },
        ],
      }),
    });
  });
}

async function login(page) {
  await mockAuthApi(page);
  await page.goto(appUrl);
  await page.locator('input').nth(0).fill('ayushn@gmail.com');
  await page.locator('input').nth(1).fill('123');
  await page.getByText('Continue').click();
  await expect(page.getByText('Hey Ayush N')).toBeVisible();
}

test('Dashboard Initial Load', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Hey Ayush N')).toBeVisible();
});

test('User Information Display', async ({ page }) => {
  await login(page);
  await expect(page.getByText('Hey Ayush N')).toBeVisible();
});

test('Dashboard UI Verification', async ({ page }) => {
  await login(page);
  await expect(page.getByRole('heading', { name: 'Welcome to MentrixOS Admin Panel!' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Active Institutes', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Total Users' })).toBeVisible();
});

test('Logout Functionality', async ({ page }) => {
  await login(page);
  await page.getByText('Logout').click();
  await expect(page.getByText('Continue')).toBeVisible();
});

test('Back Navigation After Logout', async ({ page }) => {
  await login(page);
  await page.getByText('Logout').click();
  await expect(page.getByText('Continue')).toBeVisible();

  await page.goBack().catch(() => null);
  await page.goto(appUrl);

  await expect(page.getByText('Continue')).toBeVisible();
  await expect(page.getByText('Logout')).not.toBeVisible();
});
