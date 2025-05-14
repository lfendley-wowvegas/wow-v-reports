import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.js";
import * as allure from "allure-js-commons";
require('dotenv').config();

test.beforeEach(async () => {
  await allure.severity("Critical");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("auth", "login", "smoke", "regression");
});


test.describe("Login functionality", () => {
  test("User can login with Correct credentials", async ({ page }) => {
    const Login = new LoginPage(page);

    await page.goto("https://wowvegas.com/login", {waitUntil: 'commit'});
    await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
    await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  });

  test("User fails to login with incorrect credentials", async ({ page }, testinfo) => {   
    const Login = new LoginPage(page);

    await page.goto("https://wowvegas.com/login", {waitUntil: 'commit'});
    await Login.login("incorrect username", "incorrect password");
    // Assert the error text shows, incorrect credentials or too many login attempts
    await expect(
      page
        .getByText("The username or password was incorrect. Please try again.")
        .or(page.getByText("Failed with too many login attempts."))
    ).toBeVisible();

    const screenshot = await page.screenshot();
    await testinfo.attach('screenshot', {body: screenshot, contentType: 'image/png'});
  });
});
