import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async () => {
  await allure.severity("High");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Transactional");
  await allure.tags(
    "transaction",
    "redemption",
    "ui",
    "smoke",
    "regression"
  );
});

test("Open the redemption view", async ({ page }, testinfo) => {
  test.slow();
  const Login = new LoginPage(page);
  
  await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
  await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  await page.getByRole('button', { name: ' Got it! ' }).click();
  await page.getByRole('link', { name: ' Redeem ' }).click();
  await expect(page).toHaveURL("https://www.wowvegas.com/redeem");
  await page.getByRole('button', { name: 'Redeem Cash Prize' }).click();
  await expect(page.getByText("Here you can redeem your SC winnings for real prizes")).toBeVisible();

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
