const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const {deploy_url, general_url} = require('../urls');
const percySnapshot = require('@percy/playwright');

let Order_num
test.describe.configure({ mode: 'serial' });
test('Embassy reg', async({page}) => {
  await page.goto(deploy_url + 'embassy-registration')

  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  await expect(page.locator('[name="general.email"]')).toBeVisible()
  await percySnapshot(page, 'EmbassyRegStep1')

  await page.waitForTimeout(3000)
  const departure_date_visible = page.locator('[name="general.departure_date"]')
  await expect(departure_date_visible).toBeVisible()
  await departure_date_visible.click()
  await page.waitForTimeout(1000)
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '16'}).first().click()

  const dropdown_country = page.locator('[name="general.arrival_country"]');
  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.arrival_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

  const host_country = page.locator('[name="general.destination_country"]');
  await expect(host_country).toBeVisible();
  await host_country.click();
  const input_host_country = page.getByTestId('dropdown-general.destination_country');

  await expect(input_host_country).toBeVisible();
  await input_host_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

  const continue_step1 = page.locator('id=btnContinueSidebar')
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()

  await page.waitForURL('**/embassy-registration#step=step_2')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

  await percySnapshot(page, 'EmbassyRegStep2')


  await expect(page.getByTestId('option-Male')).toBeEnabled()
  await page.waitForTimeout(1000)
  await page.getByTestId('option-Male').click()
  await page.waitForTimeout(1000)

  const dropdown_birth_country = page.locator('[name="applicant.0.birth_country"]');
  await expect(dropdown_birth_country).toBeVisible();
  await dropdown_birth_country.click();
  const input_birth_country = page.getByTestId('dropdown-applicant.0.birth_country');

  await expect(input_birth_country).toBeVisible();
  await input_birth_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')

  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')

  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')

  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')

  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)

  const name_applicant = page.getByPlaceholder("John William")
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')
  await page.waitForTimeout(1000)
  const last_name = page.getByPlaceholder("Smith").first()
  await last_name.fill('Test')
  await page.waitForTimeout(1000)
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()
  await page.waitForURL('**/embassy-registration#step=review')

  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)

  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  Order_num = page.url().split("/")[4] 
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('option-WhatsApp').click()
  await page.locator("id=btnContinueUnderSection").click()
  await page.waitForNavigation()
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  const track_application = page.locator('#trackApplication')
  await expect(track_application).toBeVisible()
  await track_application.click()
  await expect(page.locator("#h1-tag-container")).toBeVisible()


})

test('Send order to MIN', async ({page}) => {
  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.getByPlaceholder('1234567 or you@email.com').fill('sergio@admin.com')
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
  await page.getByTestId("agentReviewCheckbox").check()
  await page.getByTestId('min_checkbox_first_name').first().click()
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

test('Fix Min', async ({page}) =>{
  await page.goto(deploy_url + "order/" + Order_num)
  await page.getByTestId("correct-application").click()
  await page.waitForURL(deploy_url + "order/" + Order_num + '/min#step=trav0_step_2')
  await page.getByTestId("min-splash-button").click()
  await page.locator('[name="applicant.0.first_name"]').fill("Test")
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order/" + Order_num)
  await page.waitForTimeout(3000)
})