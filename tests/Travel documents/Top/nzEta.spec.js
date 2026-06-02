const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const { deploy_url } = require('../../urls');
const selectors = require('../../selectors')
const path = require('path');


let Order_num

test('New Zealand ETA', async ({ page }) => {
  await page.goto(deploy_url + 'new-zealand/apply-now')
  await appFunctions.autofillExisting(page, "new-zealand/apply-now/edit-traveler/0")
  await page.waitForURL("**/new-zealand/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/new-zealand/apply-now/contact-details")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  
  
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_passport_after_payment")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  await page.locator('id=instructions-continue').click()

  await page.getByTestId("try-another-way-button").click()
  await page.setInputFiles('input[type="file"]', path.join(__dirname, '..' ,'uploads_passport/Applicant-Photo.jpg'));
  await expect(page.locator("id=document-loading")).toBeVisible()
  await page.waitForTimeout(14000)
  await expect(page.locator("id=document-loading")).toBeHidden()
  await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
  
  await page.locator('id=review-continue').click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
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