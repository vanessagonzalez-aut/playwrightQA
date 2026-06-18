const { test, expect, devices } = require('@playwright/test');
const { deploy_url } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});
test('Go to my orders page from homepage', async ({ page }) => {
    await page.goto(deploy_url);
    await page.locator('id=loginBtn').click()
    await page.waitForURL("**/account")
})