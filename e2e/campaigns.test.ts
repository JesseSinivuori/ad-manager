import { test, expect } from "@playwright/test";
import { scrollGridToLeft, scrollGridToRight } from "./helpers/helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/campaigns");
  await page.waitForURL("/campaigns");
});

test("campaigns", async ({ page, isMobile }) => {
  if (isMobile) return; //mobile tests are not finished
  test.slow();
  await test.step("creates a campaign successfully", async () => {
    await page.getByRole("button", { name: "New campaign" }).click();
    const date = new Date().toISOString();
    await page.getByLabel("NameName").fill(`Test ${date}`);
    await page
      .getByLabel(/Choose date, selected date is/)
      .first()
      .click();
    if (isMobile) {
      await page.getByRole("button", { name: "OK" }).click();
    }
    await page.getByLabel("calendar view is open, switch to year view").click();
    await page.getByRole("button", { name: "2030", exact: true }).click();
    await page.getByRole("gridcell", { name: "13", exact: true }).click();
    await page
      .getByLabel(/Choose date, selected date is/)
      .nth(1)
      .click();
    if (isMobile) {
      await page.getByRole("button", { name: "OK" }).click();
    }
    await page.getByLabel("calendar view is open, switch to year view").click();
    await page.getByRole("button", { name: "2030", exact: true }).click();
    await page.getByRole("gridcell", { name: "23", exact: true }).click();

    await page
      .getByLabel("Target AudienceTarget Audience")
      .fill("Test Audience");
    await page.getByLabel("BudgetBudget").fill("1234567");
    await page
      .getByLabel("Ad GroupsAd Groups")
      .fill("Group 1, Group 2, Group 3");
    await page
      .getByLabel("KeywordsKeywords")
      .fill("Keyword 1, Keyword 2, Keyword 3");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(page.getByText(`Test ${date}`)).toBeVisible();
  });

  await test.step("has correct status, and toggles it", async () => {
    expect(await page.getByTestId("status").first().innerText()).toEqual(
      "paused"
    );
    await scrollGridToRight(page);
    await page.getByRole("cell", { name: "Activate" }).first().click();

    await scrollGridToLeft(page);
    expect(await page.getByTestId("status").first().innerText()).toEqual(
      "active"
    );
  });

  await test.step("updates the campaign", async () => {
    await scrollGridToRight(page);

    await page.getByRole("button", { name: "Edit" }).first().click();

    const date = new Date().toISOString();
    await page.getByLabel("NameName").fill(`Updated Test ${date}`);

    await page
      .getByLabel(/Choose date, selected date is/)
      .first()
      .click();
    await page.getByLabel("calendar view is open, switch to year view").click();
    await page.getByRole("button", { name: "2030", exact: true }).click();
    await page.getByRole("gridcell", { name: "3", exact: true }).click();
    await page
      .getByLabel(/Choose date, selected date is/)
      .nth(1)
      .click();
    await page.getByLabel("calendar view is open, switch to year view").click();
    await page.getByRole("button", { name: "2030", exact: true }).click();
    await page.getByRole("gridcell", { name: "23", exact: true }).click();

    await page
      .getByLabel("Target AudienceTarget Audience")
      .fill("Updated Test Audience");
    await page.getByLabel("BudgetBudget").fill("7654321");
    await page
      .getByLabel("Ad GroupsAd Groups")
      .fill("Updated Group 1, Updated Group 2, Updated Group 3");
    await page
      .getByLabel("KeywordsKeywords")
      .fill("Updated Keyword 1, Updated Keyword 2, Updated Keyword 3");

    await page.getByRole("button", { name: "Update" }).click();

    await scrollGridToLeft(page);
    await expect(page.getByText(`Test ${date}`)).toBeVisible();

    await test.step("deletes the campaign", async () => {
      await scrollGridToRight(page);
      await page.getByRole("button", { name: "Delete" }).first().click();
      await scrollGridToLeft(page);
      await expect(page.getByText(`Test ${date}`)).not.toBeVisible();
    });
  });
});
