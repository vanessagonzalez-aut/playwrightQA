const { test, expect } = require('@playwright/test');
const {deploy_url, general_url} = require('../urls');
const appFunctions = require('../functions')
const percySnapshot = require('@percy/playwright');
const path = require('path');
const selectors = require('../selectors')

test('Different currency', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'turkey/apply-now');
  await appFunctions.autofillExisting(page, "turkey/apply-now/edit-traveler/0")
  await page.waitForURL("**/turkey/apply-now/traveler-review")
  const currency = page.locator('id=currencyHeader');
  await expect(currency).toBeVisible()
  await currency.click()

  await page.waitForTimeout(2000)
  await page.keyboard.press("ArrowDown")
  await page.waitForTimeout(2000)
  await page.keyboard.press("ArrowDown")
  await page.waitForTimeout(1000)
  await page.keyboard.press("Enter")
  await page.keyboard.press("Enter")
  await page.waitForTimeout(2000)
  
  const dropdown_currency = page.getByTestId('filter-value').filter({hasText: 'USD $'})
  await expect(dropdown_currency).toBeVisible()
  await dropdown_currency.click()
  const input_currency = page.getByTestId('dropdown-modal-currency')
  await input_currency.fill('mxn')
  const confirm_currency = page.locator("[value='MXN']")
  await expect(confirm_currency).toBeVisible()
  await confirm_currency.click()
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Update currency modal');
  await page.locator('id=updatePrefButton').click()
  await page.waitForTimeout(3000)
  
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/turkey/apply-now/contact-details")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '4111 1111 1111 1111', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForTimeout(5000)
  const dsModal = await page.locator('primer-portal-dialog').isVisible()
  if(dsModal){
    await page.frameLocator(".challenge-iframe").getByText('Pass challenge').click()
  }

  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  let Order_num = page.url().split("/")[4];

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('option-WhatsApp').click()
  
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '2'}).first().click()
  
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(3000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.locator('#email_login_input').fill('david@admin.com')
   
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL('**/admin')
  page.on('dialog', async (dialog) => {
      await dialog.accept(Order_num);
  });
  const search_order = page.locator('//li[@onclick="searchOrderID();"]');
  await search_order.click()

  await page.getByTestId('applicant-details').click()
  await page.getByTestId('show-docs-applicant-0').click()
  await page.getByTestId('upload-docs-0').selectOption('reject_letter')
  await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.join(__dirname, 'uploads/deliverable.jpg'))
  await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()
  await page.getByTestId('save-uploaded-docs-0').click()
  await page.waitForTimeout(10000)
  await expect(page.locator('.upload-input-wrap')).toBeVisible()
  await expect(page.getByTestId('order-status')).toHaveText('Rejected By Gov')
})