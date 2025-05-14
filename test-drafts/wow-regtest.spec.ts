const { expect, test } = require("@playwright/test");

// Configure the Playwright Test timeout to 210 seconds,
// ensuring that longer tests conclude before Checkly's browser check timeout of 240 seconds.
// The default Playwright Test timeout is set at 30 seconds.
test.setTimeout(210000);

function createUniqueNameGenerator() {
  let firstNames = [
    "Liam",
    "Frank",
    "John",
    "Michael",
    "David",
    "Richard",
    "Joseph",
    "Charles",
    "Thomas",
    "Montgomery",
    "Christopher",
    "Daniel",
    "Emma",
    "Noah",
    "Olivia",
    "Ava",
    "Elijah",
    "Sophia",
    "James",
    "Isabella",
    "Lucas",
    "Mia",
    "Mason",
    "Charlotte",
    "Logan",
    "Amelia",
    "Ethan",
    "Harper",
    "Alexander",
    "Evelyn",
    "Henry",
    "Abigail",
    "Jackson",
    "Emily",
    "Sebastian",
    "Ella",
    "Aiden",
    "Elizabeth",
    "Matthew",
    "Camila",
    "Samuel",
  ];

  let secondNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Timms",
    "Swanson",
    "Tyron",
    "Moose",
    "Slippery",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
  ];

  const getRandomAndRemove = (arr) => {
    if (arr.length === 0) {
      throw new Error("No more unique names available.");
    }
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  };

  return {
    generateFirstName: () => getRandomAndRemove(firstNames),
    generateSecondName: () => getRandomAndRemove(secondNames),
    // utility to reset - TODO: add a test to check this
    // Can extend with more names to allow more pairings, current 925~ reg accounts
    reset: () => {
      firstNames = [
        "Liam",
        "Frank",
        "John",
        "Michael",
        "David",
        "Richard",
        "Joseph",
        "Charles",
        "Thomas",
        "Christopher",
        "Daniel",
        "Emma",
        "Noah",
        "Olivia",
        "Ava",
        "Elijah",
        "Sophia",
        "James",
        "Isabella",
        "Lucas",
        "Mia",
        "Mason",
        "Charlotte",
        "Logan",
        "Amelia",
        "Ethan",
        "Harper",
        "Alexander",
        "Evelyn",
        "Henry",
        "Abigail",
        "Jackson",
        "Emily",
        "Sebastian",
        "Ella",
        "Aiden",
        "Elizabeth",
        "Matthew",
        "Camila",
        "Samuel",
      ];

      secondNames = [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Swanson",
        "Testerr",
        "Moose",
        "Slippery",
        "Miller",
        "Davis",
        "Garcia",
        "Rodriguez",
        "Martinez",
        "Hernandez",
        "Lopez",
        "Gonzalez",
        "Wilson",
        "Anderson",
        "Thomas",
        "Taylor",
        "Moore",
        "Jackson",
        "Martin",
        "Lee",
        "Perez",
        "Thompson",
        "White",
        "Harris",
        "Sanchez",
        "Clark",
        "Ramirez",
        "Lewis",
        "Robinson",
      ];
    },
  };
}

async function sendSlackMessage(webhookUrl, title, fields) {
  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: title,
        emoji: true
      }
    },
    {
      type: "section",
      fields: fields.map(f => ({
        type: "mrkdwn",
        text: `*${f.label}:*\n${f.value}`
      }))
    }
  ];
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks })
  });
}

test.describe("Testing the registrations", () => {
  test("Standard Registration flow", async ({ page }) => {
    test.slow();
    const nameGen = createUniqueNameGenerator();
    const fname = nameGen.generateFirstName();
    const sname = nameGen.generateSecondName();
    const index = Math.floor(Math.random() * 1000);

    await page.goto("https://www.wowvegas.com/register");
    /* TODO: Make DRY by converting most of this to POM */
    await page.getByPlaceholder("Enter your username").fill(`${fname}${index}`);
    await page
      .getByPlaceholder("Enter your email address")
      .fill(`lfendley+reg${index}@metawin.inc`);
    await page.getByPlaceholder("Enter your password").fill("!Password1");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("Enter your first name").fill(fname);
    await page.getByPlaceholder("Enter your last name").fill(sname);
    await page.getByLabel("State", { exact: true }).selectOption("FL");
    await page.getByPlaceholder("MM").fill("5");
    await page.getByPlaceholder("DD").fill("5");
    await page.getByPlaceholder("YYYY").fill("1979");
    await page.getByLabel("I confirm the following: I am").check();
    await page.getByRole("button", { name: "Play Now" }).click();

    await page.waitForURL(/confirmation/);
    await expect(page).toHaveURL(/confirmation/, { timeout: 30000});

    try {
      await sendSlackMessage(
        "https://hooks.slack.com/services/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",
        "WOW Vegas Regular Reg :white_check_mark:",
        [
          { label: "Username", value: `${fname}${index}` },
          // { label: "First Name", value: fname },
          // { label: "Last Name", value: sname }
        ]
      );
    } catch (error) {
      console.error("Error sending Slack message:", error);
    }
  });

  test("RAF Registration flow", async ({ page }) => {
    test.slow();
    const nameGen = createUniqueNameGenerator();
    const fname = nameGen.generateFirstName();
    const sname = nameGen.generateSecondName();
    const index = Math.floor(Math.random() * 1000);

    await page.goto("https://www.wowvegas.com/?raf=5797788");
    await expect(page).toHaveURL(/raf=5797788/);

    // Wait for the 'affx' cookie to be set (retry up to 2 seconds)
    let affxCookie = null;
    for (let i = 0; i < 20; i++) {
      affxCookie = await page.evaluate(() => {
        function getCookie(name) {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return (parts.pop() ?? "").split(";").shift();
        }
        return getCookie("affx");
      });
      if (affxCookie) break;
      await page.waitForTimeout(100);
    }

    expect(affxCookie, "affx cookie should be set").toBeTruthy();
    expect(affxCookie).toBe("a_24b_1c_5797788");

    await page.goto("https://www.wowvegas.com/register");
    await page.getByPlaceholder("Enter your username").fill(`${fname}${index}`);
    await page
      .getByPlaceholder("Enter your email address")
      .fill(`lfendley+reg${index}@metawin.inc`);
    await page.getByPlaceholder("Enter your password").fill("!Password1");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("Enter your first name").fill(fname);
    await page.getByPlaceholder("Enter your last name").fill(sname);
    await page.getByLabel("State", { exact: true }).selectOption("FL");
    await page.getByPlaceholder("MM").fill("5");
    await page.getByPlaceholder("DD").fill("5");
    await page.getByPlaceholder("YYYY").fill("1979");
    await page.getByLabel("I confirm the following: I am").check();
    await page.getByRole("button", { name: "Play Now" }).click();

    await page.waitForURL(/confirmation/);
    await expect(page).toHaveURL(/confirmation/, { timeout: 30000});

    try {
      await sendSlackMessage(
        "https://hooks.slack.com/services/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",
        "WOW Vegas RAF Reg :white_check_mark:",
        [
          { label: "Username", value: `${fname}${index}` },
          // { label: "First Name", value: fname },
          // { label: "Last Name", value: sname },
          { label: "BTag", value: affxCookie }
        ]
      );
    } catch (error) {
      console.error("Error sending Slack message:", error);
    }
  });
});
