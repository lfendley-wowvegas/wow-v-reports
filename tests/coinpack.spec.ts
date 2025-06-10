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
    "coin-pack",
    "purchase",
    "ui",
    "smoke",
    "regression"
  );
  const Login = new LoginPage(page);
  
  await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
  await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
});

test("Open a Coin Pack purchase view", async ({ page }, testinfo) => {
  await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  await page.getByRole('button', { name: 'PLAY NOW' }).click();
  await page.getByRole('button', { name: 'Opt In' }).click();
  await page.getByRole('link', { name: 'Buy Coins' }).click();
  await expect(page).toHaveURL("https://www.wowvegas.com/buy-coins");
  await page.getByRole('button', { name: ' Buy for $0.99' }).click();
  await expect(page).toHaveURL("https://www.wowvegas.com/buy-coins/3146");

  const screenshot = await page.screenshot();
  await testinfo.attach("screenshot", {
    body: screenshot,
    contentType: "image/png",
  });
});
