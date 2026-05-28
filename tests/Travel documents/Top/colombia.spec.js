const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url, general_url } = require('../../urls');
const percySnapshot  = require('@percy/playwright');

let Order_num

test.describe.configure({ mode: 'serial' });
test('Colombia Check-MIG and MIN status', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'colombia/apply-now')
  await page.waitForTimeout(2000)
  await percySnapshot(page, 'autofillModal')
  await appFunctions.autofillExisting(page, "colombia/apply-now/edit-traveler/0")
  await page.waitForURL("**/colombia/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/colombia/apply-now/contact-details")
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
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")
  await selectors.dropdownSelector(page, 'general.arrival_location', 'dropdown-general.arrival_location', 'Armenia', 'Armenia (AXM), El Eden Airport')
  await selectors.inputText(page, 'general.arrival_flight_number', '123')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3c")
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
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

test('Send order to MIN', async ({page}) => {
  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.locator('#email_login_input').fill('david@admin.com')
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
  await page.waitForURL(deploy_url + "order/" + Order_num + '/min#step=trav0_step_3a')
  await page.getByTestId("min-splash-button").click()
  await page.locator('[name="applicant.0.first_name"]').fill("Test")
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order/" + Order_num)
  await page.waitForTimeout(3000)
  await percySnapshot(page, "AfterMinSolveScreen")
})