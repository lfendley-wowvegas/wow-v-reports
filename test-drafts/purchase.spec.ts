import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";

test.beforeEach(async ({ page }) => {
  await allure.severity("Critical");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("Transaction","Smoke");
});

test.describe("Transaction Functionality", () => {
  test("[Trustly] - Purchase a coin pack", async ({ page }, testinfo) => {
    // extend timeout due to transactional test
    test.slow();
    const Login = new LoginPage(page);

    await page.goto("https://dev.wowvegas.com/login", {waitUntil: 'commit'});
    await Login.login("wow_lfendley_7", "!Password1");
    await expect(page).toHaveURL("https://dev.wowvegas.com/lobby");

    // POPULAR: $7.49 Pack (360,500 WOW + 7.50 SC)
    await page.goto("https://dev.wowvegas.com/buy-coins/383");
    await page.getByText('Online Banking').click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().getByLabel('Demo Bank', { exact: true }).locator('i').click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().locator('#lbx-security-slider').click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().getByLabel('OK, got it!').click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().locator('iframe[title="Demo Bank login"]').contentFrame().getByLabel('Username').fill('demo');
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().locator('iframe[title="Demo Bank login"]').contentFrame().getByLabel('Password').fill('demo');
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().locator('iframe[title="Demo Bank login"]').contentFrame().getByTestId('button-test-id').click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().getByRole('radio', { name: 'Demo Checking Account -' }).click();
    await page.locator('iframe[name="paywithmybank-iframe"]').contentFrame().getByTestId('FIXED_BUTTON_WRAPPER').getByTestId('button-test-id').click();

    await expect(page).toHaveURL("https://dev.wowvegas.com/lobby");

    const screenshot = await page.screenshot();
    await testinfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  })
  
  test("[UniPass] - Purchase a coin pack", async ({ page }, testinfo) => {
    // extend timeout due to transactional test
    test.slow();

    // POPULAR: $7.49 Pack (360,500 WOW + 7.50 SC)
    await page.goto("https://dev.wowvegas.com/buy-coins/383");
    await page.getByText("Buy with card").click();
    await page
      .getByRole("dialog")
      .locator("iframe")
      .contentFrame()
      .locator("#card-number iframe")
      .contentFrame()
      .getByPlaceholder("1234 5678 9012 3456")
      .fill("4000020951595032");
    await page
      .getByRole("dialog")
      .locator("iframe")
      .contentFrame()
      .locator("#expiry-date iframe")
      .contentFrame()
      .locator("#field")
      .fill("02/34");
    await page
      .getByRole("dialog")
      .locator("iframe")
      .contentFrame()
      .locator("#cvv-number iframe")
      .contentFrame()
      .getByPlaceholder("CVV")
      .fill("123");
    await page
      .getByRole("dialog")
      .locator("iframe")
      .contentFrame()
      .locator("#holdername iframe")
      .contentFrame()
      .getByPlaceholder("Cardholder Name")
      .fill("FL-BRW1");
    await page
      .getByRole("dialog")
      .locator("iframe")
      .contentFrame()
      .getByRole("button", { name: "Pay $7.49" })
      .click();
    await expect(page).toHaveURL("https://dev.wowvegas.com/lobby");

    const screenshot = await page.screenshot();
    await testinfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});
