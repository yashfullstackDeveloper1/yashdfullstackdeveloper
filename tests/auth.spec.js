import { test, expect } from '@playwright/test';

const appUrl = 'https://incomparable-sfogliatella-1c28bb.netlify.app/';

async function mockAuthApi(page) {
    await page.route('**/auth/login', async (route) => {
        const credentials = route.request().postDataJSON();

        if (credentials.email === 'ayushn@gmail.com' && credentials.password === '123') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    pre_context_token: 'test-pre-context-token',
                    user: { full_name: 'Ayush N', email: 'ayushn@gmail.com' },
                }),
            });
            return;
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                success: false,
                message: 'Invalid credentials',
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

test('Invalid login test', async ({ page }) => {

    await mockAuthApi(page);
    await page.goto(appUrl);
    await page.locator('input').nth(0).fill('wrong@gmail.com');
    await page.locator('input').nth(1).fill('wrong123');
    await page.getByText('Continue').click();
    await expect(
        page.locator('text=/invalid|incorrect|please enter/i')
    ).toBeVisible();

});

test('Valid login test', async ({ page }) => {

    await login(page);
    await expect(page.getByText('Hey Ayush N')).toBeVisible();

});

test('Logout Test', async ({ page }) => {

    await login(page);
    await page.getByText('Logout').click();
    await expect(page.getByText('Continue')).toBeVisible();

});
