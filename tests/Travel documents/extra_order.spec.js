const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const path = require('path');
const {general_url, deploy_url} = require('../urls');
const selectors = require('../selectors')

test('Extra Order', async ({ page, browser }) => {
  test.slow()
  await page.goto(deploy_url + 'turkey/apply-now')
  await appFunctions.autofillExisting(page, "turkey/apply-now/edit-traveler/0**")
  await page.waitForURL("**/turkey/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/turkey/apply-now/contact-details**")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(1000)
  await page.getByTestId("transition-page-button").click()
  let Order_num = page.url().split("/")[4];

  
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
  await page.waitForTimeout(2000)
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.locator('#email_login_input').fill('david@admin.com')
   
  
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL(general_url + 'admin.visachinaonline.com/admin')
  await page.getByTestId('admin-search-input').fill(Order_num)
  await page.getByTestId('admin-search-submit').click()
  await page.waitForTimeout(3000)
  await page.getByTestId("dropdown-other-actions").selectOption("additional_payment")
  await page.getByTestId("dropdown-charge-type").selectOption("visa_cost")
  await page.locator('[name="amount"]').fill("10")
  await page.getByTestId("dropdown-charge-reason").selectOption("visa_type_change")
  await page.waitForTimeout(3000)
  await page.locator("id=submitChargeButton").click()
  await page.waitForNavigation()
  const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'testivisa5!',
      },
  });
  await context.clearCookies();
  const email = await context.newPage();
  await email.goto(general_url + 'visachinaonline.com/mail')
  await email.getByText("Payment required for your Turkey eVisa (Order#" + Order_num + ")").first().click()
  const iframe = email.frameLocator('iframe');
  const [newTab] = await Promise.all([
    email.context().waitForEvent('page'),
    iframe.getByText('Pay now').click(),
  ]);
  await newTab.waitForLoadState()
  await expect(newTab.getByText("Additional charge approved.")).toBeVisible()
  await page.getByRole('button', { name: 'OK' }).click()
  await page.getByTestId('applicant-details').click()
  await page.getByTestId('show-docs-applicant-0').click()
  await page.getByTestId('upload-docs-0').selectOption('visa')
  await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.join(__dirname, 'uploads/deliverable.jpg'))
  await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()
  await page.getByTestId('save-uploaded-docs-0').click()
  await page.waitForTimeout(10000)
  await expect(page.locator('.upload-input-wrap')).toBeVisible()
  await expect(page.getByTestId('order-status')).toHaveText('Complete')
})