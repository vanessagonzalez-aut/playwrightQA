const {deploy_url} = require('../urls.js');
const { expect } = require('@playwright/test');

async function step_1_passport(page, email){
    await expect(page.getByPlaceholder('John William')).toBeVisible()

    const dob_day = page.locator('[name="general.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="general.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="general.dob.year"]')
    await dob_year.selectOption('1986')

    const name_applicant = page.locator('[name="general.first_name"]')
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')
    
    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="general.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)
    if(email){
        await page.locator('[name="general.email"]').fill(email)
    }
}

async function step_2_passport(page, passportType){
    await page.waitForURL('**/passport-renewal/united-states/application#step=step_4')
    await page.waitForTimeout(2000)
    if(passportType === "Online"){
        await page.locator('#question-container').getByText('Standard Service', { exact: true }).click()
    }
    if(passportType === "USPS"){
        await page.getByText("Expedited Service", {exact: true}).click()
    }
    if(passportType === "Emergency"){
        await page.locator('#question-container').getByText('Standard Service', { exact: true }).click()
    }
}

async function step_3_passport(page){
    await page.locator('[name="applicant.0.shipping_address"]').fill('123')
    await page.waitForTimeout(3000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-type="place"]').first().click()
    await page.waitForTimeout(1000)

    const state = page.locator('[name="applicant.0.shipping_state"]');
    await expect(state).toBeVisible();
    await state.click();
    const input_state = page.getByTestId('dropdown-applicant.0.shipping_state');

    await expect(input_state).toBeVisible();
    await input_state.fill('Alabama');
    await page.getByRole("option", {name: ' Alabama'}).click()
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.shipping_zip"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.shipping_city"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)

}


module.exports = {
    step_1_passport,
    step_2_passport,
    step_3_passport
}