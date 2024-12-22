import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import * as allure from "allure-js-commons"

test.beforeEach(async () => {
  await allure.severity("Critical");
  await allure.owner("Lee Fendley");
  await allure.parentSuite("Functionality");
  await allure.tags("Functional","Smoke");
});


test.describe("Login functionality", () => {
  test("User can login with Correct credentials", async ({ page }) => {
    const Login = new LoginPage(page);

    await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
    await Login.login("slots_slave", "4YfJLxbKMpE9wrs@LEhg");
    await expect(page).toHaveURL("https://www.wowvegas.com/lobby");
  });

  test("User fails to login with incorrect credentials", async ({ page }, testinfo) => {   
    const Login = new LoginPage(page);

    await page.goto("https://www.wowvegas.com/login", {waitUntil: 'commit'});
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
