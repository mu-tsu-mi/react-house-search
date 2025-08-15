import { it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.tsx";

const mockHouses = Array.from(
  new Map([
    [1, { id: 1, address: "123 Main St", userNotes: {} }],
    [2, { id: 2, address: "234 Second St", userNotes: {} }],
  ])
);

describe("App", () => {
  describe("with many houses", () => {
    beforeEach(() => {
      localStorage.setItem("houses", JSON.stringify(mockHouses));
      render(<App />);
    });

    it("renders the street address of each house", () => {
      expect(screen.getByText("123 Main St")).toBeVisible();
      expect(screen.getByText("234 Second St")).toBeVisible();
    });
  });

  // Show error message when an invalid url is submitted
  describe("App", () => {
    describe("an invalid url is entered", () => {
      it("displays error message", async () => {
        render(<App />);

        const invalidUrl = "http://www.google.com/";
        const urlInput = screen.getByPlaceholderText(/Add URL/i);
        await userEvent.type(urlInput, invalidUrl);

        const button = screen.getByRole("button", { name: /Get a new house/i });
        await userEvent.click(button);

        expect(
          screen.getByText("URL must be a Domain property page")
        ).toBeVisible();
      });
    });
  });
});
