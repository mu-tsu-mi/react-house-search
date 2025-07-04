import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("fetches and displays a new house from Domain when a valid URL is submitted", async () => {
    // Mock Domain HTML with embedded JSON data
    const mockDomainHtml = `
      <script id="__NEXT_DATA__">
        ${JSON.stringify({
          props: {
            pageProps: {
              componentProps: {
                listingSummary: {
                  address: "1 Test St",
                  baths: 2,
                  beds: 3,
                  parking: 1,
                },
                rootGraphQuery: {
                  listingByIdV2: {
                    saleMethod: "Auction",
                    propertyTypes: ["House"],
                    priceDetails: {
                      rawValues: {
                        from: 1000000,
                        to: 1200000,
                        exactPriceV2: 1100000,
                      },
                    },
                    smallMedia: [{ url: "test-photo.jpg" }],
                  },
                },
                inspection: {
                  appointmentOnly: false,
                  inspectionTimes: [],
                },
                suburb: "Testville",
                listingId: "test-id-123",
                listingUrl: "https://www.domain.com.au/1-test-street-testville",
              },
            },
          },
        })}
      </script>
    `;

    // Mock axios.get to return the above HTML
    axios.get.mockResolvedValue({ data: mockDomainHtml });

    render(<App />);

    // Enter a valid Domain URL and submit
    const input = screen.getByPlaceholderText(/add url/i);
    await userEvent.type(
      input,
      "https://www.domain.com.au/1-test-street-testville"
    );

    const button = screen.getByRole("button", { name: /get a new house/i });
    await userEvent.click(button);

    // Wait for the house card to appear
    await waitFor(() => {
      expect(screen.getByText(/1 Test St/i)).toBeInTheDocument();
      expect(screen.getByText(/Auction/i)).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // beds
      expect(screen.getByText("2")).toBeInTheDocument(); // baths
      expect(screen.getByText("1")).toBeInTheDocument(); // parking
    });
  });
});
