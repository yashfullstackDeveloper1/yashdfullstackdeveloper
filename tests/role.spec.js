import { test, expect } from '@playwright/test';

const appUrl = 'https://incomparable-sfogliatella-1c28bb.netlify.app/';

const selectors = {
  emailOrPhone: 'input[placeholder="Enter phone or email"]',
  password: 'input[placeholder="..."]',
  instituteSearch: 'input[placeholder="Search your institute"]',
  instituteCard: '.inst-card',
  roleCard: '.role-card',
};

async function login(page, email, password) {
  await page.goto(appUrl, { waitUntil: 'domcontentloaded' });

  await expect(page.locator(selectors.emailOrPhone)).toBeVisible();
  await page.locator(selectors.emailOrPhone).fill(email);

  await expect(page.locator(selectors.password)).toBeVisible();
  await page.locator(selectors.password).fill(password);

  await page.getByRole('button', { name: 'Continue' }).click();
}

function instituteCard(page, instituteName) {
  return page.locator(selectors.instituteCard).filter({
    has: page.getByRole('heading', { name: instituteName, exact: true }),
  });
}

function roleCard(page, roleName) {
  return page.locator(selectors.roleCard).filter({
    has: page.getByRole('heading', { name: roleName, exact: true }),
  });
}

async function selectInstitute(page, instituteName) {
  await expect(page.locator(selectors.instituteSearch)).toBeVisible({
    timeout: 15000,
  });

  const card = instituteCard(page, instituteName);
  await expect(card).toHaveCount(1, { timeout: 15000 });
  await card.click();
}

async function expectRoleCardVisible(page, roleName) {
  const card = roleCard(page, roleName);
  await expect(card).toHaveCount(1, { timeout: 15000 });
  await expect(card).toBeVisible();
}

test('Display Assigned Roles', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await selectInstitute(page, 'RCOEM Nagpur');

  await expect(page.getByRole('heading', { name: 'Choose Your Role' })).toBeVisible({
    timeout: 15000,
  });
  await expectRoleCardVisible(page, 'Institute Admin');
  await expectRoleCardVisible(page, 'Trainer');
  await expectRoleCardVisible(page, 'Student');
});

test('Role Selection Navigation', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await selectInstitute(page, 'RCOEM Nagpur');

  await roleCard(page, 'Student').click();

  await expect(page.getByRole('heading', { name: /Hey Yash/i })).toBeVisible({
    timeout: 15000,
  });
});

test('Change Institute Navigation', async ({ page }) => {
  await login(page, 'yashd@gmail.com', '123');
  await selectInstitute(page, 'RCOEM Nagpur');

  await page.getByRole('button', { name: 'Change Institute' }).click();

  await expect(page.locator(selectors.instituteSearch)).toBeVisible({
    timeout: 15000,
  });
  await expect(instituteCard(page, 'RCOEM Nagpur')).toHaveCount(1, {
    timeout: 15000,
  });
});
