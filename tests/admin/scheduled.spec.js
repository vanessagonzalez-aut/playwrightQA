const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const path = require('path');

test.fixme('Scheduled', async({browser}) => {
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()
    console.log(Order.Scheduling)

    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Order.Scheduling);
    });

    await page.goto(deploy_url + 'login')
    await page.locator('#email_login_input').fill('david@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()
    // Change to reviewed status
    await page.locator('[name="change-status"]').selectOption('reviewed')
    await expect(page.getByTestId("submitChangeStatus")).toBeEnabled()
    await page.getByTestId("submitChangeStatus").click()
    await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
    await search_order.click()

    // Add Gov document
    await page.getByTestId('applicant-details').click()
    await page.getByTestId('show-docs-applicant-0').click()
    await page.getByTestId('upload-docs-0').selectOption('pdf_application')

    await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.join(__dirname, 'uploads/deliverable.jpg'))
    await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()

    await page.getByTestId('save-uploaded-docs-0').click()
    
    await page.waitForTimeout(10000)
    await expect(page.locator('.upload-input-wrap')).toBeVisible()

    // Add annotation
    await page.getByTestId('add_annotation_button').click()
    await page.getByTestId("annotation_type_select").selectOption("appointment_location")
    await page.locator('//input[@class="v2-small"]').fill("TEST")
    await page.getByTestId("save_annotation_button").click()

    await page.getByTestId('add_annotation_button').click()
    await page.getByTestId("annotation_type_select").selectOption("guided_entry_fingerprint_appointment_time")
    await page.locator("//input[@type='datetime-local']").click()
    await page.waitForTimeout(10000)
    await page.keyboard.type("10022025000110am", {delay: 100})
    await page.getByTestId("save_annotation_button").click()
    await expect(page.getByTestId('add_annotation_button')).toBeVisible()

})