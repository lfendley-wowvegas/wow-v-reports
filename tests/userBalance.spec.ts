import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";

test.beforeEach(async () => {
  await allure.severity("Critical");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("Transaction","Smoke");
});

test("User Balance is Displayed", async ({ page }, testinfo) => {
  const Login = new LoginPage(page);
  
  await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login("slots_slave", "4YfJLxbKMpE9wrs@LEhg");
  await page.getByRole('img', { name: 'popup offer' }).click();
  await expect(page.getByText("Sweepstakes Coins")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
