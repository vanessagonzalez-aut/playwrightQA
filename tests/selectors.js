const { expect } = require('@playwright/test');
const path = require('path');

async function arrival_date(page){
  await page.waitForTimeout(1000)
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.waitForTimeout(1000)
  await page.locator('.dp--future').filter({hasText: '14'}).first().click()
  await page.waitForTimeout(1000)
}

async function departure_date(page, name){
  const departure_date_visible = page.locator('[name="' + name + '"]')
  await expect(departure_date_visible).toBeVisible()
  await departure_date_visible.click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '17'}).first().click()
}
async function phoneNumber(page) {
    await page.waitForTimeout(2000)
    await page.getByPlaceholder('111-222-3333').fill('11111111')
    await page.waitForTimeout(1000)
    await page.getByTestId('option-WhatsApp').click()
    await page.waitForTimeout(2000)
}

async function addressApi(page, name) {
    await page.locator('[name="' + name + '"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-type="place"]').first().click()
    await page.waitForTimeout(1000)
}

async function booleanOptions(page, name, dataHandle) {
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '"]').getByTestId(dataHandle).click()
    await page.waitForTimeout(2000)
}

async function dropdownOptions(page, dataHandle, options) {
    await page.getByTestId(dataHandle).selectOption({value: options})
}
const inputText = async (page, name, customText) => {
    await page.locator('[name="' + name + '"]').fill(customText)
}

const applicantPhoto = async (page) => {
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('id=instructions-continue').click()
    ]);
    await fileChooser.setFiles(path.join(__dirname ,'Travel documents/uploads_passport/Applicant-Photo.jpg'));
    //await page.getByTestId("try-another-way-button").click()
   // await page.setInputFiles('input[type="file"]', path.join(__dirname ,'Travel documents/uploads_passport/Applicant-Photo.jpg'));
    await page.locator("id=document-loading").waitFor({state: 'visible'})
    await page.locator("id=document-loading").waitFor({state: 'hidden', timeout: 15000})
    await page.locator('id=review-continue').click()
}
const passportPhoto = async (page) => {
    const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.locator('id=instructions-continue').click()
    ]);
    await fileChooser.setFiles(path.join(__dirname ,'Travel documents/uploads_passport/passport.jpg'));

    //await page.getByTestId("try-another-way-button").click()
    //await page.setInputFiles('input[type="file"]', path.join(__dirname ,'Travel documents/uploads_passport/passport.jpg'));
    await page.locator("id=document-loading").waitFor({state: 'visible'})
    await page.locator("id=document-loading").waitFor({state: 'hidden', timeout: 15000})
    await page.locator('id=review-continue').click()
}

const dropdownSelector = async (page, name, dataHandle, text, value) => {
    await page.locator('[name="' + name + '"]').waitFor({state: 'attached'})
    await page.locator('[name="' + name + '"]').click()
    await page.getByTestId(dataHandle).waitFor({state: 'visible'})
    await page.getByTestId(dataHandle).fill(text)
    await page.locator('[name="' + name + '"]').getByRole('option', {value: value}).click()
    await page.waitForTimeout(2000)
}

const datePicker = async (page, name, day, month, year) =>{
    await page.locator('[name="' + name + '.day"]').selectOption(day)
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '.month"]').selectOption(month)
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '.year"]').selectOption(year)
    await page.waitForTimeout(2000)
}

const flightDropdown = async (page, name, dataHandle, text) => {
    await page.locator('[name="' + name + '"]').click()
    await page.getByTestId(dataHandle).waitFor({state: 'visible'})
    await page.getByTestId(dataHandle).fill(text)
    await page.waitForTimeout(2000)
    await page.keyboard.press('Enter')
}

const phoneWithDropdown = async (page, name) => {
    await page.locator('[name="' + name + '"]').getByTestId("filter-value").click()
    await page.locator('[name="' + name + '"]').getByTestId("dial-codes").fill("52")
    await page.locator('[name="' + name + '"]').getByRole('option', {value: "+52"}).click()
    await page.locator('[name="' + name + '"]').locator("[name='telephone']").fill("12345")
}
module.exports = {
    arrival_date,
    phoneNumber,
    booleanOptions,
    departure_date,
    inputText,
    addressApi,
    dropdownOptions,
    applicantPhoto,
    passportPhoto,
    dropdownSelector,
    datePicker,
    flightDropdown,
    phoneWithDropdown
}