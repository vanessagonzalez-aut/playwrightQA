const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Egypt eVisa', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'egypt/apply-now')
  await appFunctions.autofillExisting(page, "egypt/apply-now/edit-traveler/0")
  await page.waitForURL("**/egypt/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/egypt/apply-now/contact-details")
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

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_personal")
  await selectors.booleanOptions(page, "applicant.0.marital_status", "option-Single")
  await selectors.booleanOptions(page, "applicant.0.occupation", "option-Unemployed")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_residency_information_after_payment")
  await selectors.addressApi(page, "applicant.0.home_address")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_documents")
  await selectors.passportPhoto(page)
  
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue/#step=trav0_ocr_review")
  await page.waitForTimeout(4000)
  const passportPostPaymentModal = await page.getByText("Use selected details").isVisible()
  if (passportPostPaymentModal){
    await page.getByText("Use selected details").click()
  }
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await expect(passport_issue_day).toBeVisible()
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)  
  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2022')  
  await page.waitForTimeout(1000)

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