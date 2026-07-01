const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const appFunctions = require('../functions')

test('Processing speeds appear and work', async({page}) => {
  await page.goto(deploy_url + 'india/apply-now')
  await appFunctions.autofillExisting(page, "india/apply-now/edit-traveler/0", "", false, "IN")
  await page.waitForURL("**/india/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/india/apply-now/contact-details")
  await continue_sidebar.click() 
  await page.waitForTimeout(4000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByTestId('processing-standard').first().click()
  const correct_total = page.getByRole('complementary').getByTestId('order-total')
  await expect(correct_total).toHaveText('$125.99')
  await page.getByTestId('processing-rush').first().click()
  await page.waitForTimeout(3000)
  await expect(correct_total).toHaveText('$145.99')
  await page.getByTestId('processing-super_rush').first().click()
  await page.waitForTimeout(3000)
  await expect(correct_total).toHaveText('$205.99')
  await appFunctions.newPaymentCheckout(page,'6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
})