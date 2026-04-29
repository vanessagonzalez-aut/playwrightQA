const { test, expect } = require('@playwright/test');
const {general_url, deploy_url} = require('../../urls');
const appFunctions = require('../../functions')
const passportSteps = require('../../Functions/passport')
const selectors = require('../../selectors')
const percySnapshot = require('@percy/playwright');
let fastpassportEmail = "automations93@fastpassport.com"

let Order_num
test.describe.configure({ mode: 'serial' });
test('Fastpassport - Account creation, logging and password creation', async ({page, context}) => {
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states'
    }
 ])
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states')
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'fastPassportHomepage')
  await page.getByRole('button').getByText('Start your renewal').click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=step_1')
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'fastPassportStep1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await passportSteps.step_1_passport(page, fastpassportEmail)
  await continue_sidebar.click()
  await page.waitForTimeout(3000)
  const passwordModal = await page.locator("[name='password']").isVisible()
  if(passwordModal){
    return
  }
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()
  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await appFunctions.newPaymentCheckout(page, "4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await expect(page.locator("id=save-and-exit-button")).toBeEnabled()
  await page.locator("id=save-and-exit-button").click()
  await page.getByTestId('confirmExitModalBtn').click()
  await page.waitForURL('**/account')
  await page.locator("id=loggedInUserContainer").click()
  await page.getByRole("menu").getByText('My account').click()
  await page.waitForURL('**/account/settings')
  await page.getByTestId('Security & Privacy').click()
  await page.locator('id=new_password').fill('testivisa5!')
  await page.locator('id=password_repeat').fill('testivisa5!')
  await page.getByTestId("updatePasswordBtn").click()
  
  await page.waitForTimeout(5000)
  await page.goto(general_url + 'fastpassport.visachinaonline.com/login')
  await page.getByRole("button").getByText("OK").click()
  await page.locator("id=loggedInUserContainer").click()
  await page.locator("id=btnLogout").click()
  await page.goto(general_url + 'fastpassport.visachinaonline.com/login')
  await page.locator("id=email_login_input").fill(fastpassportEmail)
  await page.locator("id=continue_button").click()
  await page.locator("id=password_login_input").fill("testivisa5!")
  await page.locator("id=log_in_button").click()
  await page.waitForNavigation()
  await expect(page.locator("id=loggedInUserContainer")).toBeVisible()
})

test('FastPassport - Online Passport and MIN status', async({page, context}) =>{
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
  await page.waitForURL('**/passport-renewal/united-states/application#step=step_1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await passportSteps.step_1_passport(page, fastpassportEmail)
  await continue_sidebar.click()
  await page.locator("[name='password']").fill('testivisa5!')
  await page.getByTestId("login-modal-submit").click()
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()

  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByText('Standard Service', { exact: true }).click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=review')
  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  // Post Payment
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  let Order_num = page.url().split("/")[4] 
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=general_after_payment')
  await selectors.dropdownSelector(page, "applicant.0.state_of_birth", "dropdown-applicant.0.state_of_birth", 'alaska', 'AK - ALASKA')
  await selectors.inputText(page,'applicant.0.birth_city', "test")
  await selectors.dropdownSelector(page, "applicant.0.appearance_1", "dropdown-applicant.0.appearance_1", 'amber', 'Amber')
  await selectors.dropdownOptions(page, "dropdown-applicant.0.appearence_2", "Brown")
  await page.locator("id=feet-applicant.0.height_fsr").fill('5')
  await page.locator("id=inches-applicant.0.height_fsr").fill('5')
  await selectors.dropdownOptions(page, "dropdown-applicant.0.occupation", "self-employed")
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_ssn_number')
  await page.locator('[name="applicant.0.ssn"]').click()
  await page.waitForTimeout(1000)
  await page.keyboard.type("123456")
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')
  await expect(next_btn).toBeEnabled()
  await page.waitForTimeout(1000)
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_documents')
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
  // Admin portal MIN 
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
  await page.getByTestId('applicant-details').click()
  await page.getByTestId('min_checkbox_birth_city').first().click()
  await expect(page.locator('.popup-inner')).toBeVisible()
  await page.getByTestId('Non-English characters').click()
  await page.waitForTimeout(2000)
  await expect(page.getByTestId('Non-English characters')).toBeVisible()
  await page.locator('#close').click()    
  await page.reload()
  await page.locator('[name="change-status"]').selectOption('info_needed')
  await page.getByTestId('minModalYes').click()
  await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})

test('Fix Min', async({browser}) => {
  test.slow()
  const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'testivisa5!',
      },
  });
  const page = await context.newPage();
  await page.goto(deploy_url + 'mail')
  await page.getByText("ACTION REQUIRED: Updates needed for your application").first().click()
  const iframe = page.frameLocator('iframe');
  const [newTab] = await Promise.all([
    page.context().waitForEvent('page'),
    page.waitForTimeout(3000),
    percySnapshot(page, "minEmailPassport"),
    iframe.getByText('Update details now').click(),
  ]);
  await newTab.waitForLoadState()
  await page.waitForTimeout(3000)
  await percySnapshot(newTab, "MinScreen")
  await newTab.getByTestId("min-splash-button").click()
  await newTab.waitForTimeout(3000)
  await percySnapshot(newTab, "SolveMin")
  await selectors.inputText(newTab, "applicant.0.birth_city", "Test")
  await newTab.locator("id=btnSubmitApplication").click()
  await newTab.waitForNavigation({waitUntil: 'load'})

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
  await page.locator("section").locator('[aria-labelledby="order-annotations-title"]').click()
  await page.getByTestId("add_annotation_button").click()
  await page.getByTestId("annotation_type_select").selectOption("gov_confirmation_id")
  await page.locator("section").locator('[aria-labelledby="order-annotations-title"]').locator("input").fill("1234")
  await page.getByTestId("save_annotation_button").click()
  await expect(page.locator("h3").getByText("Closed")).toBeVisible()
})
  
test('Check complete orders', async({browser}) => {
  test.slow()
  const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'testivisa5!',
    },
  });
  const page = await context.newPage();
  await page.goto(deploy_url + 'mail')
  await page.getByText("It’s on the way!").first().click()
  await page.waitForTimeout(5000)
  await percySnapshot(page, "completeEmailPassport")
})