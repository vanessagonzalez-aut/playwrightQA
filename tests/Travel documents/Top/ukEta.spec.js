const { test, expect } = require('@playwright/test');
const {deploy_url, general_url} = require('../../urls');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const path = require('path');

let Order_num
test.describe.configure({ mode: 'serial' });
test('UK ETA', async({page}) => {
  test.slow()
  await page.goto(deploy_url + 'united-kingdom/apply-now')
  await appFunctions.autofillExisting(page, "united-kingdom/apply-now/edit-traveler/0", "", false, 'UK')
  await page.waitForURL("**/united-kingdom/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/united-kingdom/apply-now/contact-details**")
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
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3a") 
  await selectors.booleanOptions(page, "applicant.0.are_employed", "option-Retired")
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")    
  await selectors.booleanOptions(page, "applicant.0.occupation", "option-Unemployed")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  
  await page.locator('id=instructions-continue').click()
  await page.getByTestId("try-another-way-button").click()
  await page.setInputFiles('input[type="file"]', path.join(__dirname, '..' ,'uploads_passport/2.jpg'));
  await expect(page.locator("id=document-loading")).toBeVisible()
  await page.waitForTimeout(14000)
  await expect(page.locator("id=document-loading")).toBeHidden()
  await page.locator('id=review-continue').click()
  // Confirm instructions appear Passport photo
  // Upload wrong file Passport photo
  await page.locator('id=instructions-continue').click()
  
  // Upload Correct Photo
  await page.getByTestId("try-another-way-button").click()
  await page.setInputFiles('input[type="file"]', path.join(__dirname, '..' ,'uploads_passport/passport.jpg'));
  await expect(page.locator("id=document-loading")).toBeVisible()
  await page.waitForTimeout(10000)
  await expect(page.locator("id=document-loading")).toBeHidden()
  await page.locator('id=review-continue').click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.waitForTimeout(4000)
  const passportPostPaymentModal = await page.getByText("Use selected details").isVisible()
  if (passportPostPaymentModal){
    await page.getByText("Use selected details").click()
  }
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.getByRole('button').getByText('Skip').click()
})

test('Send order to WOG', async ({page}) => {
  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.locator('#email_login_input').fill('david@admin.com')
   
  
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL('**/admin')
  await page.getByTestId('admin-search-input').fill(Order_num)
  await page.getByTestId('admin-search-submit').click()
  await page.getByTestId('applicant-details').click()
  await page.getByTestId("show-docs-applicant-0").click()
  await page.locator("div").getByText("Passport Personal Details Scan").first().click()
  await page.getByRole("button").getByText("Correct Info").click()
  await page.locator("div").getByText("Applicant Photo").first().click()
  await page.getByRole("button").getByText("Correct Info").click()
  await page.waitForTimeout(3000)
  await page.locator('[name="change-status"]').selectOption('ready_for_bot')
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
  await page.getByTestId('admin-search-input').fill(Order_num)
  await page.getByTestId('admin-search-submit').click()
  await page.waitForTimeout(3000)
  await page.locator("section").locator('[aria-labelledby="order-annotations-title"]').click()
  await page.getByTestId("add_annotation_button").click()
  await page.getByTestId("annotation_type_select").selectOption("gov_confirmation_id")
  await page.locator("section").locator('[aria-labelledby="order-annotations-title"]').locator("input").fill("1234")
  await page.getByTestId("save_annotation_button").click()
  await page.getByTestId("dl-manage-order-title").click()
  await page.locator('[name="change-status"]').selectOption('waiting_on_gov')
  await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})