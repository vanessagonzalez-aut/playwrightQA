require('dotenv').config();
const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions')
const selectors = require('../../selectors')


test.fixme('Aruba ED Card', async ({ page }) => {
  const month = new Intl.DateTimeFormat('en-US', { month: 'numeric' }).format(new Date());
  const now = new Date();
  const day = now.getDate();
  await page.goto('https://www.flightstats.com/v2/flight-tracker/arrivals/AUA?year=2026&month=' + month + '&date=' + day +'&hour=12')
  const getFlightInfo = await page.locator('.table__CellText-sc-1x7nv9w-15').nth(0).textContent()
  const getFlightAirline = await page.locator('.table__SubText-sc-1x7nv9w-16').nth(0).textContent()
  const flight_number = getFlightInfo.replace(/\D/g, "");

  await page.goto(deploy_url + 'aruba/apply-now')
  await appFunctions.autofillExisting(page, "aruba/apply-now/edit-traveler/0")
  await page.waitForURL("**/aruba/apply-now/traveler-review**")
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/aruba/apply-now/contact-details")
  await continue_sidebar.click() 
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  
  await selectors.arrival_date(page)
  await selectors.booleanOptions(page, 'general.flight_reservation', 'option-Yes')

  await selectors.flightDropdown(page, 'general.arrival_flight_airline', 'dropdown-general.arrival_flight_airline', getFlightAirline)
  await selectors.inputText(page, "general.arrival_flight_number", '12345')
  await page.waitForTimeout(2000)
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForTimeout(2000)
  await expect.soft(page.locator(".input-error")).toContainText("Please provide a valid arrival flight number ")
  await selectors.inputText(page, "general.arrival_flight_number", flight_number)
  await page.waitForTimeout(2000)

  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForTimeout(2000)
  await page.getByTestId('option-Male').click()
  await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
  await page.waitForTimeout(2000)
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
})