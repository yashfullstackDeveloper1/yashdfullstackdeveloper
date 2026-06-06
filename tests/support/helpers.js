import { expect } from '@playwright/test';
import { testInstitutes, testUsers } from './testConfig.js';

function getUserProfile(user) {
  if (user === testUsers.admin) {
    return { id: 1, full_name: testUsers.admin.displayName, email: testUsers.admin.email };
  }

  if (user === testUsers.multiInstitute) {
    return {
      id: 2,
      full_name: testUsers.multiInstitute.displayName,
      email: testUsers.multiInstitute.email,
    };
  }

  return { id: 3, full_name: 'Ayush L', email: testUsers.instituteList.email };
}

function getInstitutesForEmail(email) {
  if (email === testUsers.admin.email) {
    return testInstitutes.admin;
  }

  if (email === testUsers.multiInstitute.email) {
    return testInstitutes.multiInstitute;
  }

  if (email === testUsers.instituteList.email) {
    return testInstitutes.instituteList;
  }

  return [];
}

function getUserForCredentials(email, password) {
  return [testUsers.admin, testUsers.multiInstitute, testUsers.instituteList].find(
    (user) => user.email === email && user.password === password
  );
}

export async function mockAuthApi(page) {
  await page.route('**/auth/login', async (route) => {
    const { email, password } = route.request().postDataJSON();
    const user = getUserForCredentials(email, password);

    if (!user) {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid credentials' }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        pre_context_token: `test-token-${email}`,
        user: getUserProfile(user),
      }),
    });
  });

  await page.route('**/auth/my-institutes-roles', async (route) => {
    const authorization = route.request().headers().authorization || '';
    const email = authorization.replace('Bearer test-token-', '');

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: getInstitutesForEmail(email),
      }),
    });
  });
}

export async function login(page, user = testUsers.admin) {
  await mockAuthApi(page);
  await page.goto('/');
  await page.getByTestId('login-email-or-phone').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByTestId('login-submit').click();
}

export async function loginAndExpectDashboard(page, user = testUsers.admin) {
  await login(page, user);
  await expectDashboardLoaded(page, user.displayName);
}

export async function expectDashboardLoaded(page, displayName = testUsers.admin.displayName) {
  await expect(page.getByText(`Hey ${displayName}`)).toBeVisible();
  await expect(page.getByText('Welcome to MentrixOS')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
}

export async function expectLoggedOut(page) {
  await expect(page.getByTestId('login-form')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
}

export async function expectDarkThemeEnabled(page) {
  const loginContainer = page.locator('.login-container');
  await expect(loginContainer).toHaveClass(/dark-theme/);
  await expect(loginContainer).toHaveCSS('background-color', 'rgb(17, 24, 39)');
}

export async function expectDarkThemeDisabled(page) {
  await expect(page.locator('.login-container')).not.toHaveClass(/dark-theme/);
}
