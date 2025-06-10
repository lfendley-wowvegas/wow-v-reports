import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async ({page}) => {
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

  const Login = new LoginPage(page);
  
  await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
});

test("Open the redemption view", async ({ page }, testinfo) => {
  await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  await page.getByRole('button', { name: 'PLAY NOW' }).click();
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
