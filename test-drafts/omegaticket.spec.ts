// tests/jira-status.spec.ts
import { test, expect } from "@playwright/test";

let tickets: string[] = [];

test.describe("Check Omega Jira ticket statuses", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(
      "https://omegasys.atlassian.net/servicedesk/customer/user/login"
    );

    await page.fill("input#user-email", "lfendley@metawin.inc");
    await page.click("button#login-button");
    await expect(page.locator("input#user-email")).toBeVisible();
    await page.fill("input#user-password", "Tindalstreet84!!");
    await page.click("button#login-button");

    await page.waitForURL(
      "https://omegasys.atlassian.net/servicedesk/customer/portals"
    );

    // Save authenticated state
    await context.storageState({ path: "auth.json" });

    await context.close();
  });

  test("Get currentStatus.status from Jira API", async ({ browser }) => {
    const context = await browser.newContext({ storageState: "auth.json" });
    const page = await context.newPage();

    await page.goto(
      "https://omegasys.atlassian.net/servicedesk/customer/user/requests?page=1&reporter=all&sNames=UAT&sNames=UAT&sNames=WAITING%20FOR%20DEPLOYMENT&statusPIds=31&statusPIds=81&statusPIds=31"
    );

    await page.waitForSelector(
      '[data-testid="request-list.request-list-table-v2--head--cell"]'
    );

    // Extract values from the 2nd column (Ticket reference e.g. WOW-1234)
    const values = await page.$$eval("table tbody tr", (rows) => {
      return rows
        .map((row) => {
          const secondColumn = row.querySelectorAll("td")[1];
          const anchor = secondColumn?.querySelector("a");
          return anchor?.textContent?.trim() || null;
        })
        .filter((v): v is string => Boolean(v)); // Remove nulls and narrow type
    });

    tickets.push(...values);

    for (const ticket of tickets) {
      const url = `https://omegasys.atlassian.net/rest/servicedeskapi/request/${ticket}`;

      const [response] = await Promise.all([
        page.waitForResponse(
          (resp) => resp.url() === url && resp.status() === 200
        ),
        page.goto(url),
      ]);

      const data = await response.json();

      if (data.currentStatus?.status) {
        console.log(`Ticket ${ticket}: Status is ${data.currentStatus.status}`);
      } else {
        console.log(`Ticket ${ticket}: currentStatus.status not found`);
      }
    }

    await context.close();
  });
});
