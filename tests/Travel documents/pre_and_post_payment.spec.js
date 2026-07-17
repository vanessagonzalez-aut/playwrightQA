const { test, expect } = require('@playwright/test');
const {deploy_url, email_test} = require('../urls');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
const selectors = require('../selectors')

test.fixme('Travel Doc application pre and post payment are working', async({page}) => {
    await page.goto(deploy_url + 'thailand/apply-now')

    // Validations step_1
    const container = page.locator('id=question-container')
    const container_txt = ["The Thailand Digital Arrival Card is mandatory for Mexico passport holders traveling to ThailandYour passport Mexico", "Your passport", "Applying for", "50,000+ Reviews"]
    container_txt.forEach(async txt => await expect(container).toContainText(txt))

    const sidebar = page.getByTestId('step-1-sidebar')
    const sidebar_txt = ['Valid for', '30 days after arrival', 'Number of entries','Single entry', 'Max stay', '30 days per entry']
    sidebar_txt.forEach(async txt => await expect(sidebar).toContainText(txt))

    const ids = ['id=help-button', 'id=currencyHeader', 'id=langHeader', 'id=logo-ivisa-link']
    ids.forEach(async id => await expect(page.locator(id)).toBeVisible())
    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()
    */
    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    //await page.waitForURL('**/thailand/apply-now#step=step_2')
  /*
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  */
    await page.waitForURL('**/thailand/apply-now#step=step_3a')
    
    // Validations Step_2
    await expect(page.locator('[name="general.email"]')).toBeVisible()

    // General checks    
    const sidebar_step_2 = page.getByTestId('sidebar-summary-breakdown')
    const sidebar_validations = ['Thailand Digital Arrival Card']

    sidebar_validations.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

    // Validations Step_3a
    await expect(page.getByTestId("add-traveler")).toBeVisible()

    // General checks    
    await expect(page.getByRole('heading').first()).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator("id=question-container")).toContainText('Personal details')
    await expect(page.locator("id=question-container")).toContainText("Enter the details as they appear on your passport")
    await expect(page.locator("id=btnPreviousSidebar")).toBeVisible()    

    const sidebar_3a = ['Thailand Digital Arrival Card', '1 Traveler']
    sidebar_3a.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

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
    await percySnapshot(page, 'Step2Application')
    await continue_sidebar.click()
    await page.waitForURL('**/thailand/apply-now#step=step_3c')

    // Validations Step_3c
    await expect(page.getByRole('heading').first()).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator("id=question-container")).toContainText('Passport details')
    await expect(page.locator("id=question-container")).toContainText("Add passport details later")
    await expect(page.locator("id=btnPreviousSidebar")).toBeVisible()    

    sidebar_3a.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

    await appFunctions.step_3c(page,continue_sidebar)
    await page.waitForURL('**/thailand/apply-now#step=review')

    await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
    
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByText("Payment received").waitFor({state: 'visible'})
    // Post payment

    // Sidebar checks
    const sidebar_checks = page.locator('//div[@data-vue-component="product-application-suspense-wrapper"]')
    const sidebar_post_payment_txt = ['Thailand Digital Arrival Card', 'Trip details', 'Test Test', 'Personal details']
    sidebar_post_payment_txt.forEach(async txt => await expect(sidebar_checks).toContainText(txt))
    await percySnapshot(page, 'PostPaymentApplication')
    await expect(page.getByTestId('General details')).toBeVisible()
    
    const next_btn = page.locator('id=btnContinueUnderSection')
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()
    await page.getByTestId("option-No").click()
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    await page.waitForTimeout(1000)
    await page.getByTestId('option-Male').click()
    await page.waitForTimeout(1000)
    await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
    /*
    // Sidebar checks
    sidebar_post_payment_txt.forEach(async txt => await expect(sidebar_checks).toContainText(txt))
    await expect(page.getByTestId('General information')).toBeVisible()
    await expect(page.getByTestId('Personal details')).toBeVisible()
    
    const host_city = page.locator('[name="applicant.0.profession_occupation"]')
    await host_city.click()
    const host_city_input = page.getByTestId('dropdown-applicant.0.profession_occupation');

    await expect(host_city_input).toBeVisible();
    await host_city_input.fill('Accountant');
    await page.waitForTimeout(2000)
    await page.getByRole('option', { name: 'Accountant' }).click()
    await page.waitForTimeout(2000)
    */
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
    await page.waitForTimeout(2000)
    const skip_recommend = await page.isVisible('id=skip-recommendation-button')
    if (skip_recommend ){
      await page.locator('id=skip-recommendation-button').click()
    }

})




