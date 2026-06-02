const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const {general_url, deploy_url} = require('../urls');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const randomEmail = require('random-email')
let wolfEmail = randomEmail({domain: "ivisatravel.com"})

test.describe.configure({ mode: 'serial' });
test('Different currency payment - Wolf and CC update', async({page, context}) =>{
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'ivisatravel.visachinaonline.com'
    }
  ])
  await page.goto(general_url + 'ivisatravel.visachinaonline.com/a/turkey');
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
  await page.locator('id=updatePrefButton').click()
  await page.waitForTimeout(3000)
  await appFunctions.step_1(page)
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/a/turkey/passport-details/0")
  await selectors.dropdownSelector(page, "applicant.0.nationality_country", "down-applicant.0.nationality_country", "Mexico", "MX")
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/a/turkey/address-details/0")
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/a/turkey/additional-info/0")
  await appFunctions.additionalInfo(page, continue_sidebar)
  await page.waitForURL("**/a/turkey/traveler-review")
  await continue_sidebar.click() 
  await page.locator("[name='general.email']").fill(wolfEmail)
  await continue_sidebar.click()

  await page.waitForURL("**/a/turkey/checkout")
  await appFunctions.newPaymentCheckout(page, '4111 1111 1111 1111', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.frameLocator(".challenge-iframe").getByText('Pass challenge').click()
  
  await page.waitForNavigation({waitUntil: 'load'})
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
  
  await page.waitForTimeout(3000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  // CC TEST
  await page.goto(general_url + 'ivisatravel.visachinaonline.com/account/payment-method');
  await expect(page.getByTestId("addPaymentMethodBtn")).toBeEnabled()
  
  await page.goto(general_url + 'ivisatravel.visachinaonline.com/account/payment-method/edit')
  await page.getByPlaceholder("Card number").fill("4556 7610 2998 3886")
  await page.getByPlaceholder("MM/YY").fill("10/29")
  await page.getByPlaceholder("CVV").fill("123")
  await page.getByPlaceholder("Cardholder name").fill("John Smith")
  await page.locator("id=btnSubmitPayment").click()
  await page.waitForURL('**/account/payment-method')
})
