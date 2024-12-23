import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async () => {
  await allure.severity("Critical");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Promotional");
  await allure.tags("Promotions","Smoke");
});

test("Daily Mission Widget is Visible", async ({ page }, testinfo) => {
  const Login = new LoginPage(page);
  
  await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
  // await page.getByRole('img', { name: 'popup offer' }).click();
  await expect(page.getByText("Daily Mission Reward")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
