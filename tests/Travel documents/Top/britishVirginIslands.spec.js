const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test.skip('British Virgin Islands ED Card', async ({ page }) => {
  test.slow()
  const month = new Intl.DateTimeFormat('en-US', { month: 'numeric' }).format(new Date());
  const now = new Date();
  const day = now.getDate();
  await page.goto('https://www.flightstats.com/v2/flight-tracker/arrivals/EIS?year=2026&month=' + month + '&date=' + day +'&hour=12')
  const getFlightInfo = await page.locator('.table__CellText-sc-1x7nv9w-15').nth(3).textContent()
  const getFlightAirline = await page.locator('.table__SubText-sc-1x7nv9w-16').nth(3).textContent()
  const flight_number = getFlightInfo.replace(/\D/g, "");

  await page.goto(deploy_url + 'british-virgin-islands/apply-now')
  await appFunctions.autofillExisting(page, "british-virgin-islands/apply-now/edit-traveler/0")
  await page.waitForURL("**/british-virgin-islands/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/british-virgin-islands/apply-now/contact-details")
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
  await selectors.booleanOptions(page, "general.traveling_with_others", "option-No")
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")
  await page.waitForTimeout(2000)
  await selectors.flightDropdown(page, "general.arrival_flight_airline", "dropdown-general.arrival_flight_airline", getFlightAirline)
  await page.waitForTimeout(2000)
  await selectors.inputText(page, 'general.arrival_flight_number', flight_number)
  await selectors.inputText(page, "general.embarkation_port", "sad")
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=accommodation")
  await selectors.booleanOptions(page, "general.type_of_contact", "option-Hotel")
  await selectors.addressApi(page, 'general.residential_address')
  await selectors.inputText(page, 'general.residential_zip', '12345')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.booleanOptions(page, 'applicant.0.gender', 'option-Female')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_residency_information_after_payment")
  await page.waitForTimeout(2000)
  await selectors.addressApi(page, 'applicant.0.home_address')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_travel")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, 'applicant.0.accompanied_luggage', '1')
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  await selectors.passportPhoto(page)
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.getByText("Use selected details").click()
  await selectors.datePicker(page, "applicant.0.passport_issued_date", '1', '9', '2013')
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