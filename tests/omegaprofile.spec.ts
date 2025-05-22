import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons";
require("dotenv").config();

test.beforeEach(async ({page}) => {
  await allure.severity("Medium");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("search", "ui", "smoke", "regression");

    const Login = new LoginPage(page);

    await Login.gotoLoginPage();
    await Login.login(process.env.WOW_USERNAME, process.env.WOW_PASSWORD);
});

test.describe("Omega Release Smoke Test for Profile", () => {
  test("Testing edit profile", async ({ page }, testinfo) => {

    await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
    await page.goto("https://www.wowvegas.com/profile/edit-profile");
    await expect(page).toHaveURL("https://www.wowvegas.com/profile/edit-profile");
    await expect(page.locator("[name='currentUsername']")).toHaveValue("slots_slave");
    await expect(page.locator("[name='birthDate']")).toHaveValue("September 9, 1984");

    const screenshot = await page.screenshot();
    await testinfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
  test("Testing gaming history", async ({ page }, testinfo) => {

    await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
    await page.goto("https://www.wowvegas.com/profile/edit-profile");
    await expect(page).toHaveURL("https://www.wowvegas.com/profile/edit-profile");
    await page.locator('[href="/profile/game-history"]').click();
    await expect(page).toHaveURL("https://www.wowvegas.com/profile/game-history");
    await expect(page.locator("table")).toContainText("SPIN");

    const screenshot = await page.screenshot();
    await testinfo.attach("screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  });
});