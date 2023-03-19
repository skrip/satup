import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import fetchMock from "jest-fetch-mock";

describe("Home", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    const fakeUsers = {
      result: 200,
      data: [
        {
          id: "new",
          firstName: "Joe",
          lastName: "Lama",
          email: "skrup@yahoo.com",
          gender: "male",
          address: [
            {
              street: "satu",
              house: "dua",
              city: "tiga",
              country: "empat",
            },
          ],
        },
      ],
    };

    fetchMock.mockResponse(JSON.stringify(fakeUsers));
  });

  it("renders Home", async () => {
    render(<Home />);

    const newCustomer = screen.queryByText("Add New Customer");
    expect(newCustomer).toBeInTheDocument();

    expect(await screen.findByText("Joe Lama")).toBeInTheDocument();
    expect(await screen.findByText("satu dua tiga empat")).toBeInTheDocument();
  });
});
