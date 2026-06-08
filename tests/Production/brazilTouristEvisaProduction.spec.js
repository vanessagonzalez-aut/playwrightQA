const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions');
const { deploy_url, email_test } = require('../urls');

test('Brazil Tourist Evisa', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'nationalityFromPassport',
      value: 'AU',
      url: deploy_url
    }
  ]);
  await page.goto(`${deploy_url}brazil/apply-now`);
  await appFunctions.step_1(page);
  await appFunctions.step_1(page)
  await page.waitForTimeout(2000)
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/brazil/apply-now/passport-details/0**", {waitUntil: 'domcontentloaded'})
  await page.locator('[name="applicant.0.nationality_country"]').waitFor({state: 'attached'})
  await page.locator('[name="applicant.0.nationality_country"]').click()
  await page.getByTestId('down-applicant.0.nationality_country').waitFor({state: 'visible'})
  await page.getByTestId('down-applicant.0.nationality_country').fill('Australia')
  await page.locator('[name="applicant.0.nationality_country"]').getByRole('option', {value: 'AU'}).click()
  await page.waitForTimeout(2000)

  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/brazil/apply-now/address-details/0**", {waitUntil: 'domcontentloaded'})
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/brazil/apply-now/additional-info/0**", {waitUntil: 'domcontentloaded'})
  await appFunctions.additionalInfo(page, continue_sidebar)
  await page.waitForURL("**/brazil/apply-now/traveler-review**", {waitUntil: 'domcontentloaded'})
  await continue_sidebar.click()
  await page.waitForURL("**/brazil/apply-now/contact-details**", {waitUntil: 'domcontentloaded'})
  await expect(page.locator('[name="general.email"]')).toBeVisible()
  await page.locator('[name="general.email"]').fill(email_test)
  await continue_sidebar.click()
  await page.waitForURL("**/brazil/apply-now/checkout**", {waitUntil: 'domcontentloaded'})
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
})
