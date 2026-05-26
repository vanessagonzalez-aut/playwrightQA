const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');
const {translations, us_esta_ko, newPaymentCheckout} = require('../functions');

let Order_num
test('Check translations US ESTA korean', async ({ page }) => {
    test.slow()
    var myDate = new Date(new Date(). getTime()+(10*24*60*60*1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'ko/usa/apply-now')
    await page.waitForTimeout(4000)

    await translations(page.locator('id=question-container'), "div", "pre_payment", us_esta_ko)
    await translations(page.getByTestId("step-1-sidebar"), "div", "pre_payment", us_esta_ko)

    const dropdown_country = page.getByTestId('filter-value');
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.common_nationality_country');
    await expect(input_country).toBeVisible();
    await input_country.fill('Australia');
    await page.getByRole("option", {name: '호주 플래그'}).click()
    //await translations(page, page.getByTestId("step-1-sidebar"), "div")

    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  
    await page.locator('.dp--future').filter({hasText: date1}).first().click()
    */

    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/ko/usa/apply-now#step=step_3a')
    
    await page.waitForTimeout(1000)
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')
    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')
    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2000')
    const name_applicant = page.locator('[name="applicant.0.first_name"]')
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')
    
    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="applicant.0.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)

    await translations(page.locator('id=main'), "h1", "pre_payment", us_esta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", us_esta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", us_esta_ko)
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await page.waitForURL('**/ko/usa/apply-now#step=step_3c')

    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(4000)
    await translations(page.locator('id=main'), "h1", "pre_payment", us_esta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", us_esta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", us_esta_ko)

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/ko/usa/apply-now#step=step_4')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await newPaymentCheckout(page,"**/ko/usa/apply-now#", '6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    await translations(page.locator('id=post-payment-sidebar'), "div", "post_payment", us_esta_ko)
    await translations(page.locator('id=post-payment-sidebar'), "h4", "post_payment", us_esta_ko)
    await translations(page.locator('id=post-payment-sidebar'), "h3", "post_payment", us_esta_ko)

    await page.getByTestId("transition-page-button").click()
    Order_num = page.url().split("/")[5] 
    await page.getByPlaceholder('202 555 0173').fill('11111111')
    await page.getByTestId('option-WhatsApp').click()

    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=accommodation")
    await page.waitForTimeout(2000)
    await page.getByTestId("option-Yes").click()
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await page.locator('[name="general.destination_location_name"]').fill('test')
    await page.locator('[name="general.destination_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJWy8aLa3HwoAR2aaEiB_BXTc"]').click()
    await page.waitForTimeout(1000)
    await page.getByPlaceholder("111-222-3333").fill("1234463")

    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    //
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=emergency_contact")
    await page.waitForTimeout(2000)
    await page.getByTestId("option-Yes").click()
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await page.getByPlaceholder('엘리자베스').fill('Test')
    await page.waitForTimeout(1000)
    await page.getByPlaceholder('데커').fill('Test')
    await page.waitForTimeout(1000)
    await page.locator('[name="general.emergency_contact_email"]').fill('test@mailinator.com')
    await page.locator('xpath=//div[@name="general.emergency_contact_phone"]//div[@data-handle="filter-value"]').click()
    await page.waitForTimeout(2000)
    await page.getByTestId('dial-codes').fill('52')
    await page.waitForTimeout(2000)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')
    await page.getByPlaceholder("111-222-3333").fill("1234463")

    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_personal")
    await page.waitForTimeout(2000)
    await page.getByTestId("option-Male").click()
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_residency_information_after_payment")
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await page.locator('[name="applicant.0.home_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJWy8aLa3HwoAR2aaEiB_BXTc"]').click()
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    // 
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_work")   
    await page.waitForTimeout(2000) 
    await page.locator('[name="applicant.0.employer_name"]').fill('Test')
    await page.getByTestId("option-Yes").click()
    await translations(page.locator('id=question-container'), "post_payment", us_esta_ko)
    await page.locator('[name="applicant.0.your_company_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJWy8aLa3HwoAR2aaEiB_BXTc"]').click()
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_work")    
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "post_payment", us_esta_ko)
    await page.getByTestId("option-I don't have information about any of them").click()
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_declarations")  
    await page.waitForTimeout(2000)
    await page.getByTestId("option-Yes").click()
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "post_payment", us_esta_ko)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_documents")
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await page.locator('id=instructions-continue').click()

    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/2.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    await page.locator('id=review-continue').click()
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/passport.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)

    await page.locator('id=review-continue').click()
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_ocr_review")
    await translations(page.locator('main'), "div", "post_payment")
    await page.getByText("선택한 세부정보 사용").click()
    await translations(page.locator('id=question-container'), "div", "post_payment", us_esta_ko)
    
    const request = await fetch("https://littleserver-production.up.railway.app/translations", {
    //const request = await fetch("http://localhost:3000/translations", {  
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(us_esta_ko),
    });
    const respose_api = await request.json()
    console.log(respose_api)
    
})