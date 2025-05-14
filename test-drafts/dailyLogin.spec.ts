import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeAll(async () => {
    await allure.severity("Medium");
    await allure.owner("Lee Fendley");
    await allure.parentSuite("Promotional");
    await allure.tags("Promotions", "Smoke");
})

test.describe("Daily Login Claim Check", () => {
    test("User can claim their daily login award", async ({ page }, testinfo) => {
      test.slow()
      const Login = new LoginPage(page);
  
      await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
      await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
      await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
      await page.goto("https://www.wowvegas.com/promotions/daily-coin-reward");
      await page.getByRole("button", { name: "Claim now" }).click();

      await expect(page.getByText("Bonus claimed")).toBeVisible();

      const screenshot = await page.screenshot();
      await testinfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    });

    test('Already claimed or unavailable daily login award', async ({ page }, testinfo) => {
      test.slow()
      const Login = new LoginPage(page);
  
      await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
      await Login.login("slots_slave", "4YfJLxbKMpE9wrs@LEhg");
      await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
      await page.goto("https://www.wowvegas.com/promotions/daily-coin-reward");
      await page.getByRole("button", { name: "Claim now" }).click();

      await expect(page.getByText("Bonus Unavailable")).toBeVisible();

      const screenshot = await page.screenshot();
      await testinfo.attach("screenshot", {
        body: screenshot,
        contentType: "image/png",
      });
    })
    
});