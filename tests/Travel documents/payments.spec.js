const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const {general_url, deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');

test('Payment with VISA and Cancelled order Status', async({page}) => {
  test.slow()
  await page.goto(deploy_url + 'thailand/apply-now')
  await appFunctions.autofillExisting(page, "thailand/apply-now/edit-traveler/0")
  await page.waitForURL("**/thailand/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/thailand/apply-now/contact-details")
  await continue_sidebar.click() 
  const duplicate = await page.locator('id=btnDisclaimerNext').isVisible()
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await appFunctions.newPaymentCheckout(page, '3782 8224 6310 005', '1234')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(1000)
  let Order_num = page.url().split("/")[4];

  // Cancel order
  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.locator('#email_login_input').fill('sergio@admin.com')
  await page.getByRole("button", {name: 'Continue'}).click()
  
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL('**/admin')

  await page.goto(general_url + 'admin.visachinaonline.com/admin/users/2231070/edit')
  await page.locator('[name="employee_role"]').selectOption("admin")
  await page.waitForTimeout(5000)
  await page.getByText("Update user").click()
  await page.waitForTimeout(5000)
  await page.waitForURL('**/admin/users')

  await page.goto(general_url + 'admin.visachinaonline.com/admin')
  await page.waitForTimeout(3000)
  page.on('dialog', async (dialog) => {
      await dialog.accept(Order_num);
  });
  const search_order = page.locator('//li[@onclick="searchOrderID();"]');
  await search_order.click()

  await page.getByTestId("dl-manage-order-title").click()
  await page.locator('[name="change-status"]').selectOption('cancelled')
  await page.locator("select").filter({hasText: "Select reason:"}).selectOption("trip_cancelled")
  await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
  await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
  await page.getByTestId('submitChangeStatus').click()
  await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')

  await page.goto(general_url + 'visachinaonline.com/order/' + Order_num)
  await page.waitForTimeout(2000)
  await percySnapshot(page, "CancelledStatus")
})
  
test('Payment with Master Card', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
  await appFunctions.autofillExisting(page, "thailand/apply-now/edit-traveler/0")
  await page.waitForURL("**/thailand/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/thailand/apply-now/contact-details")
  await continue_sidebar.click() 
  const duplicate = await page.locator('id=btnDisclaimerNext').isVisible()
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await appFunctions.newPaymentCheckout(page,'5555 5555 5555 4444', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
  
test('Payment with Amex', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
  await appFunctions.autofillExisting(page, "thailand/apply-now/edit-traveler/0")
  await page.waitForURL("**/thailand/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/thailand/apply-now/contact-details")
  await continue_sidebar.click() 
  const duplicate = await page.locator('id=btnDisclaimerNext').isVisible()
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }

  await appFunctions.newPaymentCheckout(page,'3782 8224 6310 005', '1234')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
  
test('Payment with Discover', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
  await appFunctions.autofillExisting(page, "thailand/apply-now/edit-traveler/0")
  await page.waitForURL("**/thailand/apply-now/traveler-review")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/thailand/apply-now/contact-details")
  await continue_sidebar.click() 
    await appFunctions.newPaymentCheckout(page,'6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})