const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const {general_url, deploy_url} = require('../../urls');
const appFunctions = require('../../functions')
const selectors = require('../../selectors')
const randomEmail = require('random-email')
let fastpassportEmail = randomEmail()

test('FastPassport - United Kingdom', async({page, context}) =>{
  test.slow()
  await context.addCookies([
    {
      name: 'default_currency',
      value: 'USD',
      url: general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states'
    }
 ])
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-kingdom/application#step=step_1')
  await selectors.inputText(page, "general.first_name", "Test")
  await selectors.inputText(page, "general.last_name", "Test")
  await selectors.inputText(page, "general.email", fastpassportEmail)
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await page.waitForURL('**/passport-renewal/united-kingdom/application#step=step_3')
  await page.selectOption("[name='general.passport_issued_date.day']", "1")
  await page.selectOption("[name='general.passport_issued_date.month']", "1")
  await page.selectOption("[name='general.passport_issued_date.year']", "2017")
  
  await page.selectOption("[name='general.passport_expiration_date.day']", "1")
  await page.selectOption("[name='general.passport_expiration_date.month']", "1")
  await page.selectOption("[name='general.passport_expiration_date.year']", "2025")
  await continue_sidebar.click()
  await page.waitForURL('**/passport-renewal/united-kingdom/application#step=review')
  await page.waitForTimeout(4000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await percySnapshot(page, "ukPassportCheckout")
  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  // Post Payment
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  await selectors.inputText(page, "general.passport_num", "12345")
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  let Order_num = page.url().split("/")[4] 
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_personal')
  await page.waitForTimeout(1000)
  await page.selectOption("[name='applicant.0.dob.day']", "1")
  await page.waitForTimeout(1000)
  await page.selectOption("[name='applicant.0.dob.month']", "1")
  await page.waitForTimeout(1000)
  await page.selectOption("[name='applicant.0.dob.year']", "1999")
  await selectors.booleanOptions(page, "applicant.0.gender", "option-Male")
  await selectors.inputText(page, "applicant.0.birth_city", "Test")
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_residency_information')
  await selectors.addressApi(page, "applicant.0.home_address")
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_documents')
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await page.waitForNavigation({waitUntil: 'load'})
  const track_application = page.locator('#trackApplication')
  await expect(track_application).toBeVisible()
})