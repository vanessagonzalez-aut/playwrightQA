const { test, expect } = require('@playwright/test');
const {general_url, deploy_url} = require('../urls');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const randomEmail = require('random-email')
const path = require('path');
let wolfEmail = randomEmail({domain: "ivisatravel.com"})

let Order_num 
test('Individual subscription purchase - Wolf', async ({ page, context }) => {
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'ivisatravel.visachinaonline.com'
    }
  ])
  await page.goto(general_url + 'ivisatravel.visachinaonline.com/a/malaysia')
  await appFunctions.step_1(page, "individual")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/a/malaysia/passport-details/0**")
  await selectors.dropdownSelector(page, "applicant.0.nationality_country", "down-applicant.0.nationality_country", "australia", "AU")
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/a/malaysia/address-details/0**")
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/a/malaysia/additional-info/0**")
  await appFunctions.additionalInfo(page, continue_sidebar)
  await page.waitForURL("**/a/malaysia/traveler-review**")
  await continue_sidebar.click()
  await page.waitForURL("**/a/malaysia/contact-details**")
  await page.locator("[name='general.email']").fill(wolfEmail)
  await continue_sidebar.click()
  await page.waitForURL("**/a/malaysia/checkout**")
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  const has_subscription = await page.getByText("Confirmation").isVisible()
  if (has_subscription){
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()

    return
  }
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')

  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.arrival_date(page)
  await selectors.departure_date(page, "general.departure_date")

  await selectors.booleanOptions(page, "general.flight_reservation", "option-No")
  await selectors.booleanOptions(page, "general.hotel_info_us", "option-No")
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num + "/continue#step=trav0_passport_after_payment")
  await selectors.inputText(page, "applicant.0.passport_num", "123456789")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "9", "5", "2040")
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
  await next_btn.click()
  await page.waitForURL(general_url + "ivisatravel.visachinaonline.com/order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)  
await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(general_url + "ivisatravel.visachinaonline.com/order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num)
  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await page.waitForTimeout(3000)
  await page.getByTestId("purchase-subscription-button").click()
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num + "/purchase_addons/new_mop?subscription=true")
  await page.locator('id=cardNumber').frameLocator('[title="Card number"]').locator('id=primer-hosted-input').fill('4111 1111 1111 1111')
  await page.locator('id=expiry').frameLocator('[title="Expiry (MM/YY)"]').locator('id=primer-hosted-input').fill('10/26')
  await page.locator('id=cvv').frameLocator('[title="CVV"]').locator('id=primer-hosted-input').fill('123')
  await page.locator('id=cardFormName').frameLocator('[title="Name on card"]').locator('id=primer-hosted-input').fill('Jhon')
  await page.locator('.billing-address-form').locator("input").fill('12345')
  await page.locator('id=btnSubmitPayment').click()
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num + "?subscription=true")

  // Place free order 
 await page.goto(general_url + 'ivisatravel.visachinaonline.com/a/malaysia')
await page.getByRole("radio").nth(0).click()
  await page.getByRole("button").getByText("Confirm").click()
  await page.waitForURL('**/a/malaysia/edit-traveler/0**')
  await page.waitForTimeout(2000)
  const checkNationalityError = await page.getByTestId('alert-modal-button').isVisible()
  if(checkNationalityError){
      await page.getByTestId('alert-modal-button').click()
  }
  await page.getByTestId("option-Male").click() 
  await page.locator('[name="applicant.0.is_passport_on_hand"]').getByTestId("option-true").click()
  
  await page.locator('[name="applicant.0.home_address"]').fill('123')
  await page.waitForTimeout(2000)
  await page.keyboard.press("Space")
  await page.waitForTimeout(1000)
  await page.keyboard.press("Enter")
  await page.waitForTimeout(1000)
  await page.locator('//li[@data-type="place"]').first().click()
  await page.waitForTimeout(1000)
  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')
  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')
  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')
  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')
  await page.waitForTimeout(2000)
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await passport_issue_day.selectOption('13')
  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2024')
  await page.waitForTimeout(2000)
  await page.locator('[name="applicant.0.are_employed"]').getByTestId("option-true").click()
  await page.waitForTimeout(2000)
  await page.locator('[name="applicant.0.criminal_offence"]').getByTestId("option-false").click()
  await page.waitForTimeout(2000)
  await page.locator('[name="applicant.0.specific_travel_plans"]').getByTestId("option-false").click()
  await page.waitForTimeout(2000)
  await page.getByTestId("dropdown-applicant.0.reason_for_travel").selectOption({value: "Tourism"})

  await continue_sidebar.click()
 await page.waitForURL("**/a/malaysia/traveler-review**")
 await continue_sidebar.click()
 await page.waitForURL("**/a/malaysia/contact-details**")
  await continue_sidebar.click() 
  await page.waitForTimeout(2000)
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByTestId("processing-standard").click()

  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  await page.getByTestId("transition-page-button").click()
  await selectors.arrival_date(page)
  await selectors.departure_date(page, "general.departure_date")
  await selectors.booleanOptions(page, "general.flight_reservation", "option-No")
  await selectors.booleanOptions(page, "general.hotel_info_us", "option-No")
  Order_num = page.url().split("/")[4] 
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num + "/continue#step=trav0_passport_after_payment")
  await selectors.inputText(page, "applicant.0.passport_num", "123456789")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "9", "5", "2040")
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
  await next_btn.click()
  await page.waitForURL(general_url + "ivisatravel.visachinaonline.com/order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)  
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(general_url + "ivisatravel.visachinaonline.com/order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/order/' + Order_num)
})