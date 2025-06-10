import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async ({page}) => {
  await allure.severity("Medium");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("search", "ui", "smoke", "regression");

  const Login = new LoginPage(page);
  
  await page.goto("https://wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
});

test("Search Functionality displays on click", async ({ page }, testinfo) => {
  await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  await page.getByRole('button', { name: 'PLAY NOW' }).click();
  await page.getByRole('button', { name: 'Search ' }).click();
  await expect(page.getByText("Try these popular picks")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
