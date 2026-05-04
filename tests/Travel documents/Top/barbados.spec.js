const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Barbados ED Card', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'barbados/apply-now')
  await appFunctions.autofillExisting(page, "barbados/apply-now/edit-traveler/0")
  await page.waitForURL("**/barbados/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/barbados/apply-now/contact-details")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  await selectors.arrival_date(page)
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=travel_general")
  await selectors.booleanOptions(page, 'general.flight_reservation', 'option-No')
  await selectors.dropdownSelector(page, "general.journey_originate_from", "dropdown-general.journey_originate_from", "mexico", "MX")
  await selectors.inputText(page, 'general.journey_originate_port', '123')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_step_3c")
  await selectors.inputText(page, "applicant.0.passport_num", "123456789")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_personal")
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})