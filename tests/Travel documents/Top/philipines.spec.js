const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Philippines eArrival Card', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'philippines/apply-now')
  await appFunctions.autofillExisting(page, "philippines/apply-now/edit-traveler/0")
  await page.waitForURL("**/philippines/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/philippines/apply-now/contact-details")
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
  await page.waitForTimeout(2000)
  await selectors.dropdownSelector(page, 'general.arrival_flight_airline',"dropdown-general.arrival_flight_airline","Advance", "ADVANCE JET AVIATION")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "general.arrival_flight_number", '12345')
  await page.waitForTimeout(2000)
  await selectors.dropdownSelector(page, "general.port_of_arrival", "dropdown-general.port_of_arrival", "sfs", "Subic Bay International Airport (SFS)")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_personal")
  await selectors.booleanOptions(page, "applicant.0.gender", "option-Female")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_passport_after_payment")
  await selectors.datePicker(page, 'applicant.0.passport_issued_date', '1', '4', '2013')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_residency_information_after_payment")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_documents")
  await selectors.applicantPhoto(page)
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()
  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})