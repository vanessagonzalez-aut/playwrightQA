const { test, expect, devices } = require('@playwright/test');
const { deploy_url} = require('../urls');
const selectors = require('../selectors')
const { newPaymentCheckout } = require('../functions');
const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});

test.fixme('Travel Doc application pre and post payment are working Mobile', async({page}) => {
    await page.goto(deploy_url + 'thailand/apply-now')
    const headerMobileNav = page.locator('id=headerMobileNav');
    await expect(headerMobileNav).toBeVisible()
    // Validations step_1
    const container = page.locator('id=question-container')
    const container_txt = ["The Thailand Digital Arrival Card is mandatory for Mexico passport holders traveling to ThailandYour passport Mexico", "Your passport", "Applying for", "50,000+ Reviews"]
    container_txt.forEach(async txt => await expect(container).toContainText(txt))
    const continue_sidebar = page.locator('id=btnContinueUnderSectionMobile')
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await page.waitForURL('**/thailand/apply-now#step=step_3a')
      
    // Validations Step_3a
    await expect(page.locator('[name="general.email"]')).toBeVisible()
    await expect(page.getByTestId("add-traveler")).toBeVisible()

    // General checks    
    await expect(page.getByRole('heading', { name: 'Thailand Digital Arrival Card' })).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator("id=question-container")).toContainText('Personal details')
    await expect(page.locator("id=question-container")).toContainText("Enter the details as they appear on your passport")

    //
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

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/thailand/apply-now#step=step_3c')

    // Validations Step_3c
    await expect(page.getByRole('heading', { name: 'Thailand Digital Arrival Card' })).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator("id=question-container")).toContainText('Passport details')
    await expect(page.locator("id=question-container")).toContainText("Add passport details later")
    
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
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL("**/thailand/apply-now#step=review")
    await newPaymentCheckout(page, '6011 1111 1111 1117', '123')
    
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()
    // Post payment
    
    
    //await page.locator('[name="general.city_current_residence"]').fill("Test")
    const next_btn = page.locator('id=btnContinueUnderSection')
    /*
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(3000)
    */
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '2'}).first().click()
    
    //await page.getByTestId("option-Tourism").click()
    /*
    const before_thailand = page.locator('[name="general.country_where_boarded"]')
    await before_thailand.click()
    const before_thailand_input = page.getByTestId('dropdown-general.country_where_boarded');
    await expect(before_thailand_input).toBeVisible();
    await before_thailand_input.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
    */
    await page.waitForTimeout(2000)
    await page.getByTestId("option-No").click()
     await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    // Sidebar checks
    await page.waitForTimeout(1000)
    await page.getByTestId('option-Male').click()
    await page.waitForTimeout(1000)
    await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
    await page.waitForTimeout(2000)
    /*
    const host_city = page.locator('[name="applicant.0.profession_occupation"]')
    await host_city.click()
    const host_city_input = page.getByTestId('dropdown-applicant.0.profession_occupation');

    await expect(host_city_input).toBeVisible();
    await host_city_input.fill('Accountant');
    await page.waitForTimeout(2000)
    await page.getByRole('option', { name: 'Accountant' }).click()
    await page.waitForTimeout(2000)
    */
    const submit_post_payment = page.locator('id=btnSubmitApplication')
    await expect(submit_post_payment).toBeEnabled()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=contact_and_updates")
    await selectors.phoneNumber(page)
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000)
    const skip_recommend = await page.isVisible('id=skip-recommendation-button')
    if (skip_recommend ){
      await page.locator('id=skip-recommendation-button').click()
    }

    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
})




