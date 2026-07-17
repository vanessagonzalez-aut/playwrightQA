const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Curacao Immigration Card + Passenger Locator Card', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'curacao/apply-now')
  await appFunctions.autofillExisting(page, "curacao/apply-now/edit-traveler/0")
  await page.waitForURL("**/curacao/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/curacao/apply-now/contact-details")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByText("Payment received").waitFor({state: 'visible'})
  
  await selectors.dropdownSelector(page,"general.destination_location_name", "dropdown-general.destination_location_name", "abc", "ABC Apartments")
  await selectors.arrival_date(page)
  await selectors.booleanOptions(page, "general.flight_reservation", "option-No")
  await selectors.dropdownSelector(page,"general.city_of_departure", "dropdown-general.city_of_departure", "amsterdam", "Amsterdam")

  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_passport_after_payment")
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
  await page.getByRole('button').getByText('Skip').click()
})