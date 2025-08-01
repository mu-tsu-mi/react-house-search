import { test, expect } from "@playwright/test";
// Enable temporary access to cors anywhere before running tests.
// https://cors-anywhere.herokuapp.com/corsdemo

test("has title", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/React App/);
});

test("get house button", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // Click the get a new house button.
  await page.getByRole("button", { name: /get a new house/i }).click();

  // Expects an error message.
  await expect(page.getByText("Enter a URL")).toBeVisible();
});

test("add a new house to local storage", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  const houseUrl =
    "http://www.domain.com.au/16-2-pottery-court-brunswick-vic-3056-2020123755";

  await page.getByPlaceholder("Add URL").fill(houseUrl);

  await page.getByRole("button", { name: /get a new house/i }).click();

  await expect(
    page.getByText("16/2 Pottery Court, Brunswick VIC 3056")
  ).toBeVisible({
    timeout: 10000,
  });
});
