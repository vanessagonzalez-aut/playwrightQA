const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const {deploy_url} = require('../urls');

let Order_num 
test('Individual subscription purchase', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'malaysia/apply-now')
  await page.getByRole("button").getByText("Add New Traveler").click()
  await appFunctions.step_1(page, "individual")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/malaysia/apply-now/passport-details/0")
  await selectors.dropdownSelector(page, "applicant.0.nationality_country", "down-applicant.0.nationality_country", "australia", "AU")
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/malaysia/apply-now/address-details/0")
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/malaysia/apply-now/additional-info/0")
  await appFunctions.additionalInfo(page, continue_sidebar)
  await page.waitForURL("**/malaysia/apply-now/traveler-review**")
  await continue_sidebar.click()
  await page.waitForURL("**/malaysia/apply-now/contact-details")
  await continue_sidebar.click()
  await page.waitForURL("**/malaysia/apply-now/checkout")
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
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_passport_after_payment")
  await selectors.inputText(page, "applicant.0.passport_num", "123456789")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "9", "5", "2040")
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
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(deploy_url + "order/" + Order_num)
  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Purchase Subscription modal');
  await page.getByTestId("purchase-subscription-button").click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/purchase_addons/new_mop?subscription=true")
  await page.locator('id=cardNumber').frameLocator('[title="Card number"]').locator('id=primer-hosted-input').fill('4111 1111 1111 1111')
  await page.locator('id=expiry').frameLocator('[title="Expiry (MM/YY)"]').locator('id=primer-hosted-input').fill('10/26')
  await page.locator('id=cvv').frameLocator('[title="CVV"]').locator('id=primer-hosted-input').fill('123')
  await page.locator('id=cardFormName').frameLocator('[title="Name on card"]').locator('id=primer-hosted-input').fill('Jhon')
  await page.locator('.billing-address-form').locator("input").fill('12345')
  await page.locator('id=btnSubmitPayment').click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "?subscription=true")

  // Place free order 
 await page.goto(deploy_url + 'malaysia/apply-now')
 await appFunctions.autofillExisting(page, "malaysia/apply-now/edit-traveler/0", false, true)
 await page.waitForURL("**/malaysia/apply-now/traveler-review**")
 await continue_sidebar.click()
 await page.waitForURL("**/malaysia/apply-now/contact-details**")
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
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_passport_after_payment")
  await selectors.inputText(page, "applicant.0.passport_num", "123456789")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "9", "5", "2040")
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
 await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})