const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
const selectors = require('../selectors')

const path = require('path');

let Order_num
test('File upload checker', async({page}) => {
    test.slow()
    var myDate = new Date(new Date(). getTime()+(10*24*60*60*1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'india/apply-now')
    await appFunctions.autofillExisting(page, "india/apply-now/edit-traveler/0", '', false, 'IN')
    await page.waitForURL("**/india/apply-now/traveler-review**")
    const continue_sidebar = page.getByRole("button").getByText("Continue")
    await continue_sidebar.click()
    await page.waitForURL("**/india/apply-now/contact-details")
    await continue_sidebar.click() 
    await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByText("Payment received").waitFor({state: 'visible'})
    Order_num = page.url().split("/")[4] 


    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")  
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
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3a") 
    await selectors.booleanOptions(page, "applicant.0.are_employed", "option-Retired")
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")    
    await page.waitForTimeout(3000)
    await page.locator("[name='applicant.0.religion']").click()
    const input_religion = page.getByTestId('dropdown-applicant.0.religion');
    await input_religion.fill('bahai');
    await page.getByRole("option", {name: 'Bahai'}).click()
    await selectors.booleanOptions(page, "applicant.0.marital_status", "option-Single")
    await selectors.dropdownSelector(page, "applicant.0.birth_country", "dropdown-applicant.0.birth_country", "mexico", "MX")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_work")
    await selectors.booleanOptions(page, "applicant.0.occupation", "option-Retired")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_family")
    await selectors.booleanOptions(page, "applicant.0.applicable_statement", "option-No, I don’t know their names")
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")

    await selectors.applicantPhoto(page)
    await selectors.passportPhoto(page)
})