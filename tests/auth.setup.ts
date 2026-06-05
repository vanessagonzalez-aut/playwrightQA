import test, { test as setup, expect } from '@playwright/test';
import {deploy_url, email_test} from './urls'
const percySnapshot = require('@percy/playwright');
import * as appFunctions from './functions'
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page, context }) => {
  if(!fs.existsSync(authFile)){
    test.slow()
    await context.addCookies([
      {
        name: 'default_currency',
        value: 'USD',
        url: deploy_url
      },
      {
        name: 'nationalityFromPassport',
        value: 'MX',
        url: deploy_url
      },
      {
        name: 'pavr',
        value: '1.0.0-JUP-2.0.0',
        url: deploy_url
      }
    ]);

    await page.goto(`${deploy_url}turkey/apply-now`);
    await appFunctions.step_1(page);
    await appFunctions.step_1(page)
    await page.waitForTimeout(2000)
    await percySnapshot(page, 'Step1Application')
    const continue_sidebar = page.getByRole("button").getByText("Continue")
    await continue_sidebar.click()
    await page.waitForURL("**/turkey/apply-now/passport-details/0", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step2Application')
    await appFunctions.step_2(page, continue_sidebar)
    await page.waitForURL("**/turkey/apply-now/address-details/0", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step3Application')
    await appFunctions.step_3c(page, continue_sidebar)
    await page.waitForURL("**/turkey/apply-now/additional-info/0", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step4Application')
    await appFunctions.additionalInfo(page, continue_sidebar)
    await page.waitForURL("**/turkey/apply-now/traveler-review**", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step5Application')
    await continue_sidebar.click()
    await page.waitForURL("**/turkey/apply-now/contact-details", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step6Application')
    await expect(page.locator('[name="general.email"]')).toBeVisible()
    await page.locator('[name="general.email"]').fill(email_test)
    await continue_sidebar.click()
    await page.waitForURL("**/turkey/apply-now/checkout", {waitUntil: 'domcontentloaded'})
    await percySnapshot(page, 'Step7Application')
    await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000)
    // Set password
    await page.goto(deploy_url + 'account/settings/security')
    const password_set = page.locator('id=new_password')
    await expect(password_set).toBeVisible()
    await password_set.fill('testivisa5!')
    const password_set_confirm = page.locator('id=password_repeat')
    await password_set_confirm.fill('testivisa5!')
    await page.getByTestId('updatePasswordBtn').click()
    const confirmation_modal = page.locator('.swal-overlay--show-modal')
    await expect.soft(confirmation_modal).toBeVisible()

    await page.context().storageState({ path: authFile });
  }
});