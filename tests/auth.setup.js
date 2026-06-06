import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { test as setup } from '@playwright/test';
import { authFile, testUsers } from './support/testConfig.js';
import { loginAndExpectDashboard } from './support/helpers.js';

setup('authenticate as admin', async ({ page }) => {
  await loginAndExpectDashboard(page, testUsers.admin);

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
