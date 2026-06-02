const { test, expect } = require('@playwright/test');
const {general_url, deploy_url} = require('../urls');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const randomEmail = require('random-email')
const path = require('path');
let wolfEmail = randomEmail({domain: "ivisatravel.com"})

test.describe.configure({ mode: 'serial' });
test('File upload - Wolf', async({page, context}) =>{
  test.slow()
  var myDate = new Date(new Date(). getTime()+(10*24*60*60*1000));
  const datepicker_date = new Date(myDate);
  const date1 = datepicker_date.getDate();
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


    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/' + "order/" + Order_num + "/continue#step=travel_general")  
    await page.waitForTimeout(2000) 
    
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('.dp--future').filter({hasText: date1}).first().click()
    const dropdown_country = page.locator('[name="general.port_of_arrival"]');
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.port_of_arrival');

    await expect(input_country).toBeVisible();
    await input_country.fill('Ahmedabad Airport - Ahmedabad - AMD');
    await page.locator('//div[@value="Ahmedabad Airport - Ahmedabad - AMD"]').click()

    const country_before_india =  page.getByTestId('filter-value').nth(1);
    await country_before_india.click();
    const select_country = page.getByTestId('dropdown-general.ten_years_countries.0.country_where_boarded');
    await select_country.fill('united states');
    await page.getByRole("option", {name: 'United States flag United States'}).click()


    await next_btn.click()
    await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/' + "order/" + Order_num + "/continue#step=trav0_personal")    
    await page.waitForTimeout(3000)
    await page.locator("[name='applicant.0.religion']").click()
    const input_religion = page.getByTestId('dropdown-applicant.0.religion');
    await input_religion.fill('bahai');
    await page.getByRole("option", {name: 'Bahai'}).click()
    await selectors.booleanOptions(page, "applicant.0.marital_status", "option-Single")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/' + "order/" + Order_num + "/continue#step=trav0_work")
    await selectors.booleanOptions(page, "applicant.0.occupation", "option-Retired")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/' + "order/" + Order_num + "/continue#step=trav0_family")
    await selectors.booleanOptions(page, "applicant.0.applicable_statement", "option-No, I don’t know their names")
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(general_url + 'ivisatravel.visachinaonline.com/' + "order/" + Order_num + "/continue#step=trav0_documents")

    // Confirm instructions appear Applicant photo
    await expect(page.locator("id=document-step")).toContainText("Test Test", "Upload your photo", "Face the camera straight on with a plain background.", "No angles or head tilts ", "No glasses, hats, or scarves", "No glasses, hats, or scarves")
    
    // Upload wrong file Applicant photo
    await page.locator('id=instructions-continue').click()
    
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await selectors.applicantPhoto(page)
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await page.locator('id=review-continue').click()

    // Confirm instructions appear Passport photo
    await expect(page.locator("id=document-step")).toContainText("Show the full page, including the code at the bottom", "Keep the page flat, not bent or at an angle", "All text must be clear, with no glare, shadows, or fingers")
    
    await page.locator('id=instructions-continue').click()
    
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await selectors.passportPhoto(page)
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await page.locator('id=review-continue').click()
})
