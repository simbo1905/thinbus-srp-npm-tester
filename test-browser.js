/**
 * Headless browser end-to-end test for the Thinbus SRP demo app.
 *
 * Requires @playwright/test to be installed with Chromium:
 *   npx playwright install chromium
 *
 * Usage:
 *   node test-browser.js
 *
 * The test:
 *  1. Registers a user via the SRP register page
 *  2. Logs in with the same credentials via the SRP login page
 *  3. Asserts the authenticated welcome message is displayed
 */

'use strict';

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = 'testuser@example.com';
const TEST_PASS = 'SuperSecret123!';

(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // ---------- Registration ----------
    await page.goto(`${BASE_URL}/register.html`);
    await page.fill('#username', TEST_USER);
    await page.fill('#verifier', TEST_PASS);
    await page.click('button[type="button"]');

    // The form POSTs to /save; wait for a response page confirming registration
    await page.waitForFunction(
      () => document.body.innerText.includes('You can now attempt'),
      { timeout: 10000 }
    );
    console.log('✓ Registration succeeded');

    // ---------- Login ----------
    await page.goto(`${BASE_URL}/login.html`);
    await page.fill('#username', TEST_USER);
    await page.fill('#do_no_post', TEST_PASS);
    await page.click('button[type="button"]');

    // The login flow is async (XHR challenge then form POST to /authenticate)
    await page.waitForFunction(
      () => document.body.innerText.includes('you have successfully authenticated'),
      { timeout: 10000 }
    );
    console.log('✓ Login succeeded');

    console.log('All browser tests passed.');
    process.exit(0);
  } catch (err) {
    console.error('Browser test FAILED:', err.message || err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
