import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async () => {
  await allure.severity("Medium");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("search", "ui", "smoke", "regression");
});

test("Search Functionality displays on click", async ({ page }, testinfo) => {
  test.slow();
  const Login = new LoginPage(page);
  
  await page.goto("https://wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
  await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  await page.getByRole('button', { name: ' Got it! ' }).click();
  await page.getByRole('button', { name: 'Search ' }).click();
  await expect(page.getByText("Try these popular picks")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
