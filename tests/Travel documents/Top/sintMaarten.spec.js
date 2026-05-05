const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Sint Maarten ED Card', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'sint-maarten/apply-now')
  await appFunctions.autofillExisting(page, "sint-maarten/apply-now/edit-traveler/0")
  await page.waitForURL("**/sint-maarten/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/sint-maarten/apply-now/contact-details")
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
  await selectors.departure_date(page, "general.departure_date")
  
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=accommodation")
  await page.waitForTimeout(2000)
  await selectors.booleanOptions(page, 'general.type_accommodation', 'option-Hotel/Guesthouse')
  await selectors.inputText(page, "general.accommodation_name", 'Test')
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_step_3c")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_personal")
  await page.waitForTimeout(3000)
  await selectors.inputText(page, "applicant.0.state_of_birth", "Test")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "applicant.0.birth_city", "Test")
  await selectors.booleanOptions(page, 'applicant.0.marital_status', 'option-Single')

  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_work")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "applicant.0.profession_occupation", "Test")
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_travel")
  await selectors.booleanOptions(page, "applicant.0.flight_reservation", "option-No")
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