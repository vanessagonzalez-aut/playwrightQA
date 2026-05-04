const { test, expect } = require('@playwright/test');
const {general_url, deploy_url} = require('../../urls');
const path = require('path');
const appFunctions = require('../../functions')
const passportSteps = require('../../Functions/passport')
const selectors = require('../../selectors')
const randomEmail = require('random-email')
const percySnapshot = require('@percy/playwright');
let fastpassportEmail = randomEmail({domain: "fastpassport.com"})

test.describe.configure({ mode: 'serial' });
test.skip('FastPassport - USPS Emergency - Complete', async({page, context}) => {
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states'
    }
 ])
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states')
  await page.reload()
  await page.getByRole('button').getByText('Start your renewal').click()
  await page.waitForURL('**/passport-renewal/united-states/application/#step=step_1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  
  await passportSteps.step_1_passport(page,  fastpassportEmail)
  await continue_sidebar.click()
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()

  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByText("Emergency Service", {exact: true}).click()
  await page.waitForURL('**/passport-renewal/united-states/application/#step=review')
  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  // Post Payment
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  let Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(2000)
  await selectors.dropdownSelector(page, "applicant.0.state_of_birth", "dropdown-applicant.0.state_of_birth", 'alaska', 'AK - ALASKA')
  await page.locator('[name="applicant.0.birth_city"]').fill('aaaaaaaaa')
  await selectors.dropdownSelector(page, "applicant.0.appearance_1", "dropdown-applicant.0.appearance_1", 'amber', 'Amber')
  await selectors.dropdownOptions(page, "dropdown-applicant.0.appearence_2", "Brown")
  await page.locator("id=feet-applicant.0.height_fsr").fill('5')
  await page.locator("id=inches-applicant.0.height_fsr").fill('5')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await selectors.booleanOptions(page, "applicant.0.marital_status", "option-Single")
  await selectors.booleanOptions(page, "applicant.0.father_information", "option-No")
  await selectors.booleanOptions(page, "applicant.0.mother_information", "option-No")

  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.locator('[name="applicant.0.ssn"]').click()
  await page.waitForTimeout(1000)
  await page.keyboard.type("123456")
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')
  await expect(next_btn).toBeEnabled()
  await page.waitForTimeout(1000)
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await selectors.datePicker(page, "applicant.0.passport_issued_date", "13", "7", "2012")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "13", "7", "2023")
  await page.locator('[name="applicant.0.passport_num"]').fill('111111111')
  const submit_post_payment = page.locator("id=btnSubmitApplication")
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
  const track_application = page.locator('#trackApplication')
  await expect(track_application).toBeVisible()

  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
  await page.getByRole("button", {name: 'Continue'}).click()
  
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL('**/admin')
  await page.waitForTimeout(3000)
  page.on('dialog', async (dialog) => {
      await dialog.accept(Order_num);
  });
  const search_order = page.locator('//li[@onclick="searchOrderID();"]');
  await search_order.click()
  await page.locator('[name="change-status"]').selectOption('prepare_for_shipping')
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await expect(page.getByText("All Passport Renewal applicants must have a Gov Application and Applicant Photo deliverable.")).toBeVisible()
  await page.getByTestId("alert-modal-button").click()
  await page.locator("id=goBackButton").click()
  await page.getByTestId("applicant-details").click()
  
  await page.getByTestId('show-docs-applicant-0').click()
  await page.getByTestId('upload-docs-0').selectOption('applicant_photo_cleaned')
  await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.resolve('tests/Passport-tests/uploads_passport/passport.jpg'))
  await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()
  await page.getByTestId('save-uploaded-docs-0').click()
  await page.waitForTimeout(8000)
  await expect(page.locator('.upload-input-wrap')).toBeVisible()
  // Applicant image
  await page.getByTestId('upload-docs-0').selectOption('passport_renewal_gov_application')
  await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.resolve('tests/Passport-tests/uploads_passport/passport.jpg'))
  await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()
  await page.getByTestId('save-uploaded-docs-0').click()
  await page.waitForTimeout(8000)
  await expect(page.locator('.upload-input-wrap')).toBeVisible()
  await page.locator('[name="change-status"]').selectOption('prepare_for_shipping')
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')

  await search_order.click()
  await page.getByTestId("dl-manage-order-title").click()
  await page.getByRole("button").locator("span").getByText('Change status to "Shipped to Customer"').click()
  await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})

test.skip('Check complete orders', async({browser}) => {
  test.slow()
  const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'testivisa5!',
      },
  });
  const page = await context.newPage();
  await page.goto(deploy_url + 'mail')
  await page.getByText("	It’s on the way!").first().click()
  await page.waitForTimeout(5000)
  await percySnapshot(page, "completeEmailPassport")
})