import { test, expect } from "@playwright/test";

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
