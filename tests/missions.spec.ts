import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async ({page}) => {
  await allure.severity("Medium");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Promotional");
  await allure.tags("promotion", "daily-mission", "ui", "regression");

  const Login = new LoginPage(page);
  
  await page.goto("https://wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
});

test("Widgets are Visible", async ({ page }, testinfo) => {
  await expect(page.getByText("Daily Mission Reward")).toBeVisible();
  await expect(page.getByText("Victory Vault")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
