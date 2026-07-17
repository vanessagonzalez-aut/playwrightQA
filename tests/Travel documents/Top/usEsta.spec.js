const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('United States ESTA', async ({ page, context }) => {
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: deploy_url
    },
    {
      name: 'nationalityFromPassport',
      value: 'AU',
      url: deploy_url
    }
  ]);
  test.slow()
  await page.goto(deploy_url + 'usa/apply-now')
  await page.getByRole("button").getByText("Add New Traveler").click()
  await appFunctions.step_1(page)
  const continue_sidebar = page.getByRole("button").getByText("Continue")
  await continue_sidebar.click()
  await page.waitForURL("**/usa/apply-now/passport-details/0")
  await appFunctions.step_2(page, continue_sidebar)
  await page.waitForURL("**/usa/apply-now/address-details/0")
  await appFunctions.step_3c(page, continue_sidebar)
  await page.waitForURL("**/usa/apply-now/additional-info/0")
  await appFunctions.additionalInfo(page, continue_sidebar, "US")
  await page.waitForURL("**/usa/apply-now/traveler-review**")
  await continue_sidebar.click()
  await page.waitForURL("**/usa/apply-now/contact-details**")
  await continue_sidebar.click()
  await page.waitForURL("**/usa/apply-now/checkout**")
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByText("Payment received").waitFor({state: 'visible'})
  
  await selectors.booleanOptions(page, "general.usa_travel_type", "option-No")
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=accommodation")
  await page.waitForTimeout(2000)
  await selectors.booleanOptions(page, 'general.hotel_info_us', 'option-No')
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=emergency_contact")
  await selectors.booleanOptions(page, 'general.emergency_contact_us', 'option-No')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_work")
  await selectors.booleanOptions(page, 'applicant.0.employer_info_us', 'option-No')
  await selectors.inputText(page, 'applicant.0.employer_name', 'test')
  await page.waitForTimeout(2000)
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_family")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "applicant.0.fathers_first_name", "Test")
  await selectors.inputText(page, "applicant.0.fathers_last_name", "Test")
  await selectors.inputText(page, "applicant.0.mothers_first_name", "Test")
  await selectors.inputText(page, "applicant.0.mothers_last_name", "Test")
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_declarations")
  await selectors.booleanOptions(page, "applicant.0.declarations_us", "option-No")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.waitForTimeout(4000)
  const passportPostPaymentModal = await page.getByText("Use selected details").isVisible()
  if (passportPostPaymentModal){
    await page.getByText("Use selected details").click()
  }
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
  await selectors.phoneNumber(page)
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForTimeout(4000)
  await page.getByRole('button').getByText('Skip').click()
})