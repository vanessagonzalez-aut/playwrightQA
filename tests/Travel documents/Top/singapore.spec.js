const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Singapore Arrival Card', async ({ page }) => {
  await page.goto(deploy_url + 'singapore/apply-now')
  await appFunctions.autofillExisting(page, "singapore/apply-now/edit-traveler/0")
  await page.waitForURL("**/singapore/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/singapore/apply-now/contact-details")
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
  await selectors.booleanOptions(page, "general.flight_reservation", "option-No")
  await selectors.departure_date(page, "general.departure_date")
  await selectors.booleanOptions(page, "general.hotel_info_us", "option-No")
  
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3c")
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.dropdownSelector(page, "applicant.0.shipping_state", "dropdown-applicant.0.shipping_state", "Alabama", "Alabama")
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await submit_post_payment.click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  
  await page.locator('id=trackApplication').click()
  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})