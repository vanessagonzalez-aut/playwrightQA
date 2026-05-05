const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Israel ETA', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'israel/apply-now')
  await appFunctions.autofillExisting(page, "israel/apply-now/edit-traveler/0")
  await page.waitForURL("**/israel/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/israel/apply-now/contact-details")
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
  await selectors.departure_date(page, 'general.departure_date')
  
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_personal")
  await selectors.booleanOptions(page, "applicant.0.marital_status", "option-Single")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_work")
  await selectors.booleanOptions(page, "applicant.0.current_occupation", "option-Unemployed")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_family")
  await selectors.booleanOptions(page, "applicant.0.applicable_statement","option-No, I don’t know their names")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_past_travel")
  await page.waitForTimeout(2000)
  await selectors.dropdownOptions(page, "dropdown-applicant.0.applied_document_israel", "No, I haven’t applied for any of these")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_documents")
  await selectors.passportPhoto(page)
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_ocr_review")
  await page.getByText("Use selected details").click()
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