const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
test('Continue with your application banner', async({page}) => {
  await page.goto(deploy_url + 'united-kingdom/apply-now')
  await appFunctions.autofillExisting(page, "united-kingdom/apply-now/edit-traveler/0", '', false, 'UK')
  await page.waitForURL("**/united-kingdom/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/united-kingdom/apply-now/contact-details")
  await continue_sidebar.click() 
  await page.goto(deploy_url)
  await page.goto(deploy_url + 'thailand/apply-now')
  await expect(page.locator("id=finishApplication")).toBeVisible()
  await expect(page.locator("id=finishApplication")).toContainText("Finish Application")
  await percySnapshot(page, 'Continue with application banner');
})