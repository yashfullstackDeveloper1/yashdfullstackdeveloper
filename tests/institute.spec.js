import { test, expect } from '@playwright/test';

const appUrl = 'https://incomparable-sfogliatella-1c28bb.netlify.app/';

const selectors = {
  emailOrPhone: 'input[placeholder="Enter phone or email"]',
  password: 'input[placeholder="..."]',
  instituteSearch: 'input[placeholder="Search your institute"]',
  instituteCard: '.inst-card',
};

const testInstitutes = [
  {
    institute_id: 1,
    tenant_id: 1,
    institute_name: 'RCOEM Nagpur',
    roles: [{ role_id: 1, role_name: 'Student' }],
  },
  {
    institute_id: 2,
    tenant_id: 1,
    institute_name: 'YCCE Nagpur',
    roles: [{ role_id: 2, role_name: 'Trainer' }],
  },
  {
    institute_id: 3,
    tenant_id: 1,
    institute_name: 'GNIET Nagpur',
    roles: [{ role_id: 3, role_name: 'Institute Admin' }],
  },
];

async function mockAuthApi(page) {
  await page.route('**/auth/login', async (route) => {
    const credentials = route.request().postDataJSON();
    const firstName = credentials.email.split('@')[0];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        pre_context_token: 'test-pre-context-token',
        user: {
          full_name: firstName === 'yashd' ? 'Yash Dhapke' : 'Ayush L',
          email: credentials.email,
        },
      }),
    });
  });

  await page.route('**/auth/my-institutes-roles', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: testInstitutes,
      }),
    });
  });
}

async function login(page, email, password) {
  await mockAuthApi(page);
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });

  await expect(page.locator(selectors.emailOrPhone)).toBeVisible();
  await page.locator(selectors.emailOrPhone).fill(email);

  await expect(page.locator(selectors.password)).toBeVisible();
  await page.locator(selectors.password).fill(password);

  await page.getByRole('button', { name: 'Continue' }).click();
}

async function waitForInstituteSelectionPage(page) {
  await expect(page.locator(selectors.instituteSearch)).toBeVisible({
    timeout: 15000,
  });

  await expect(page.locator(selectors.instituteCard).first()).toBeVisible({
    timeout: 15000,
  });
}

test('Institute Selection Test', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');

  await waitForInstituteSelectionPage(page);
});

test('Three Institutes Validation', async ({ page }) => {
  await login(page, 'ayushl@gmail.com', '123');
  await waitForInstituteSelectionPage(page);

  const instituteCards = page.locator(selectors.instituteCard);

  await expect(instituteCards).toHaveCount(3, { timeout: 15000 });

  for (let index = 0; index < 3; index += 1) {
    await expect(instituteCards.nth(index)).toBeVisible();
  }
});
