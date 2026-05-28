const { test, expect } = require('@playwright/test');
const {general_url, deploy_url} = require('../urls');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const randomEmail = require('random-email')
let wolfEmail = randomEmail({domain: "ivisatravel.com"})

test.describe.configure({ mode: 'serial' });
test('Password Creation and login - Wolf', async({page, context}) =>{
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'ivisatravel.visachinaonline.com'
    }
  ])
  await page.goto(general_url + 'ivisatravel.visachinaonline.com/a/india');
  await appFunctions.step_1(page)
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/a/india/passport-details/0")
  await selectors.dropdownSelector(page, "applicant.0.nationality_country", "down-applicant.0.nationality_country", "Mexico", "MX")
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/a/india/address-details/0")
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/a/india/additional-info/0")
  await appFunctions.additionalInfo(page, continue_sidebar)
  await page.waitForURL("**/a/india/traveler-review")
  await continue_sidebar.click() 
  await page.locator("[name='general.email']").fill(wolfEmail)
  await continue_sidebar.click()

  await page.waitForURL("**/a/india/checkout")
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  let Order_num = page.url().split("/")[4];

   await page.goto(general_url + 'ivisatravel.visachinaonline.com/account/settings')
    const user = page.locator('id=loggedInUserContainer')
    await expect(user).toBeVisible()
    await user.click()
    const btn_logout = page.locator('id=btnLogout')
    await expect(btn_logout).toBeVisible()
    await btn_logout.click()
    await page.goto(general_url + 'ivisatravel.visachinaonline.com/login')
    const email = page.locator('id=email_login_input')
    await expect(email).toBeVisible()
    await email.fill(wolfEmail)
    const continue_login = page.locator('id=continue_button')
    await expect(continue_login).toBeEnabled()
    await continue_login.click()
    const password = page.locator('id=password_login_input')
    await expect(password).toBeVisible()
    await password.fill('testivisa5!')  
    const login_cta = page.locator('id=log_in_button')
    await expect(login_cta).toBeEnabled()
    await login_cta.click()
    await page.waitForNavigation({waitUntil: 'load'})
})
