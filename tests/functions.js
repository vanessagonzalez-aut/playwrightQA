const {deploy_url} = require('./urls');
const cld = require('cld')
const { expect } = require('@playwright/test');

var uk_eta = {
  product: "Thailand Digital Arrival Card",
  languages: [
    {
        translations: "",
        pre_payment: 0,
        pre_payment_missing: [],
        post_payment_missing: [],
        post_payment: 0

    }
  ],
  deployment: deploy_url
}
async function translations(selector, section, product, language){

    const allElements = await selector.all();
    const filtered_array = await Promise.all(
        allElements.map(async (el) => {
            let get_text = (await el.textContent())?.trim()?.replace(/\n/g, ' ').replace(/[0-9]/g, '').replace(/[!@#$%^&*(),.?":{}|<>+]/g, '');
            if(get_text && get_text.length > 0){
                return get_text
            }
        })
    )
    const remove_undefined = filtered_array.filter(Boolean);

    let detect_english = remove_undefined.filter(async (text) => {
        const detect = await cld.detect(text)
        const check_includes = detect.chunks.some(chunk => chunk.code === "en")

        if (check_includes){
            return text
        }
    })
    if(detect_english.length > 0){
        product.languages.forEach(element => {    
            element[section]++
            element.translations = language
            element[`${section}_missing`].push(...detect_english)
        });
    }
}

async function newPaymentCheckout(page,creditCard, cvvNum,continuebtn){
    if(continuebtn){
        await page.getByRole('button', { name: 'Continue to payment' }).click()
    }
    await page.waitForTimeout(2000)
    const duplicate = await page.locator('id=btnDisclaimerNext').isVisible()
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    
    await page.locator('id=cardNumber').frameLocator('[title="Card number"]').locator('id=primer-hosted-input').waitFor({state: 'attached'})
    await page.locator('id=expiry').frameLocator('[title="Expiry (MM/YY)"]').locator('id=primer-hosted-input').waitFor({state: 'attached'})
    await page.locator('id=cvv').frameLocator('[title="CVV"]').locator('id=primer-hosted-input').waitFor({state: 'attached'})
    await page.locator('id=cardFormName').frameLocator('[title="Name on card"]').locator('id=primer-hosted-input').waitFor({state: 'attached'})
    await page.waitForTimeout(3000)
    await page.locator('id=cardNumber').frameLocator('[title="Card number"]').locator('id=primer-hosted-input').fill(creditCard)
    await page.locator('id=expiry').frameLocator('[title="Expiry (MM/YY)"]').locator('id=primer-hosted-input').fill('10/26')
    await page.locator('id=cvv').frameLocator('[title="CVV"]').locator('id=primer-hosted-input').fill(cvvNum)
    await page.locator('id=cardFormName').frameLocator('[title="Name on card"]').locator('id=primer-hosted-input').fill('Jhon')
    const zip_code = await page.locator('.billing-address-form').isVisible()
    if(zip_code){
        await page.locator('.billing-address-form').locator("input").fill('12345')
    }
    /*
    await page.locator('[name="number"]').fill(creditCard);
    const expiration_month = page.locator('[name="mmyy"]')
    await expiration_month.fill('10/26')
    const cvv = page.locator('[name="cvv"]')
    await cvv.fill(cvvNum)
    const cardholder_name = page.locator('[name="full_name"]')
    await cardholder_name.fill('John Smith')
    */
}
async function oldPaymentCheckout(page, url, creditCard, cvvNum){
    await page.waitForURL(url + 'step=review')
    if(continuebtn){
        await page.getByRole('button', { name: 'Continue to payment' }).click()
    }
    await page.waitForTimeout(4000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1)
    
    await stripeFrame.locator("id=payment-numberInput").fill(creditCard);

    const expiration_month = stripeFrame.locator("id=payment-expiryInput")
    await expiration_month.fill('10/26')

    const cvv = stripeFrame.locator("id=payment-cvcInput")
    await cvv.fill(cvvNum)
    const zip_code = stripeFrame.locator("id=payment-postalCodeInput")
    await zip_code.fill('12345')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    
    const zip_code = page.getByPlaceholder("ZIP code")
    await zip_code.fill('12345')
    */ 
}
async function autofillExisting(page, url, nationality, subscription) {
    if(subscription){
        await page.getByRole("radio").nth(1).click()
    }else{
        await page.getByRole("radio").nth(0).click()
    }
    await page.getByRole("button").getByText("Confirm").click()
    await page.waitForURL(deploy_url + url, {waitUntil: 'domcontentloaded'})

    const checkNationalityError = await page.getByTestId('alert-modal-button').isVisible()
    if(checkNationalityError){
        await page.getByTestId('alert-modal-button').click()
    }
    await page.getByTestId("option-Male").click() 
    await page.locator('[name="applicant.0.is_passport_on_hand"]').getByTestId("option-true").click()
    if (nationality){
        if(nationality === "au"){
            await page.locator('[name="applicant.0.nationality_country"]').click()
            await page.waitForTimeout(2000)
            await page.getByTestId("down-applicant.0.nationality_country").fill("au")
            await page.locator('[name="applicant.0.nationality_country"]').getByRole('option', {name: "Australia flag Australia"}).click()
            await page.waitForTimeout(2000)
        }
    }
    await page.locator('[name="applicant.0.home_address"]').fill('123')
    await page.waitForTimeout(1000)
    await page.keyboard.press("Space")
    await page.locator('id=autocomplete_results').waitFor({state: 'visible'})
    await page.locator('//li[@data-type="place"]').first().click()
    await page.waitForTimeout(1000)

    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(2000)
    const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
    await passport_issue_day.selectOption('13')
    const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
    await passport_issue_month.selectOption('7')
    const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
    await passport_issue_year.selectOption('2024')
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.are_employed"]').getByTestId("option-true").click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.criminal_offence"]').getByTestId("option-false").click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.specific_travel_plans"]').getByTestId("option-false").click()
    await page.waitForTimeout(2000)
    await page.getByTestId("dropdown-applicant.0.reason_for_travel").selectOption({value: "Tourism"})
    const continue_sidebar = page.getByRole("button").getByText("Continue")
    await continue_sidebar.click()
}
async function step_1(page, subscription){
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2001')
    if(subscription && subscription === "individual"){
        await dob_year.selectOption('2002')
    }
    const name_applicant = page.locator('[name="applicant.0.first_name"]')
    await name_applicant.fill('Test')
    
    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="applicant.0.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)
    await page.getByTestId('option-Male').click()  
}


async function step_2(page, continue_sidebar){
    await page.getByTestId('option-true').click()  
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(2000)
    const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
    await passport_issue_day.selectOption('13')
    const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
    await passport_issue_month.selectOption('7')
    const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
    await passport_issue_year.selectOption('2024')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
}

async function step_3c(page,continue_sidebar){
    await page.locator('[name="applicant.0.home_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-type="place"]').first().click()
    await page.waitForTimeout(1000)
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
}
async function additionalInfo(page,continue_sidebar){
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.are_employed"]').getByTestId("option-false").click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.criminal_offence"]').getByTestId("option-false").click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.specific_travel_plans"]').getByTestId("option-false").click()
    await page.waitForTimeout(2000)
    await page.getByTestId("dropdown-applicant.0.reason_for_travel").selectOption({value: "Tourism"})
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
}


module.exports = {
    translations,
    uk_eta,
    newPaymentCheckout, 
    step_1,
    step_2,
    step_3c,
    additionalInfo,
    autofillExisting
}