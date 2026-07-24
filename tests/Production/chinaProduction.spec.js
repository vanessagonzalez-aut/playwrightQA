const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions');
const { deploy_url, email_test } = require('../urls');

test('China', async ({ page }) => {
  await page.goto(`${deploy_url}china/apply-now`);
  await appFunctions.step_1(page);
  await appFunctions.step_1(page)
  await page.waitForTimeout(2000)
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/china/apply-now/passport-details/0", {waitUntil: 'domcontentloaded'})
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/china/apply-now/address-details/0", {waitUntil: 'domcontentloaded'})
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/china/apply-now/additional-info/0", {waitUntil: 'domcontentloaded'})
  await appFunctions.additionalInfo(page, continue_sidebar, "CH")
  await page.waitForURL("**/china/apply-now/traveler-review**", {waitUntil: 'domcontentloaded'})
  await continue_sidebar.click()
  await page.waitForURL("**/china/apply-now/contact-details**", {waitUntil: 'domcontentloaded'})
  await expect(page.locator('[name="general.email"]')).toBeVisible()
  await page.locator('[name="general.email"]').fill(email_test)
  await continue_sidebar.click()
  await page.waitForURL("**/china/apply-now/checkout", {waitUntil: 'domcontentloaded'})
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
})
