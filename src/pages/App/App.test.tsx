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

const mockHouse = Array.from(
  new Map([[1, { id: 1, address: "123 Main St", userNotes: {} }]])
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

  describe("with one house", () => {
    beforeEach(() => {
      localStorage.setItem("houses", JSON.stringify(mockHouse));
      render(<App />);
    });

    it("can edit user notes of a house", async () => {
      // find the tram input and enter some text
      const tramInput = screen.getByRole("textbox", { name: /tram/i });
      await userEvent.type(tramInput, "tram 5mins walk");

      // click save button

      // check localStorage  usinglocalStorage.getItem has an updated userNotes on the house
    });
  });
});
